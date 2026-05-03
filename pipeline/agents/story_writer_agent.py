"""Story Writer Agent.

Decomposes a structured spec into formal ADO User Stories with Gherkin scenarios,
Fibonacci story point estimates, duplicate detection, and parent-child linking.

Exceptions propagate so the Orchestrator's retry loop can catch them.
"""

import json
import sys
from pathlib import Path
from typing import Any

import anthropic

_AGENT_DIR = Path(__file__).resolve().parent
_PIPELINE_DIR = _AGENT_DIR.parent
_ADO_MCP_DIR = _PIPELINE_DIR / "mcp-servers" / "ado-mcp"

for _dir in (_PIPELINE_DIR, _ADO_MCP_DIR):
    if str(_dir) not in sys.path:
        sys.path.insert(0, str(_dir))

from ado_client import ADOClient, ADOClientError, LINK_CHILD_TO_PARENT  # noqa: E402
from contracts.structured_spec import StructuredSpec  # noqa: E402

_MODEL = "claude-sonnet-4-6"
_MAX_TOKENS = 4096
_PROMPT_PATH = _PIPELINE_DIR / "prompts" / "story_writer.md"
_LOG_PREFIX = "[story_writer]"

_STOP_WORDS: frozenset[str] = frozenset({
    "a", "an", "the", "as", "i", "so", "that", "to", "and", "or",
    "for", "want", "with", "in", "on", "at", "by", "of", "my", "be",
})
_DUPLICATE_WORD_THRESHOLD = 3


def run(
    structured_spec: StructuredSpec,
    work_item: dict[str, Any],
    anthropic_client: anthropic.Anthropic,
    ado_client: ADOClient,
) -> list[int]:
    """Decompose a structured spec into ADO User Stories and return their IDs.

    Calls Claude to generate stories, then creates each in ADO with Gherkin
    scenarios, story points, duplicate flags, and parent-child links.

    Raises:
        RuntimeError: If the Claude API call fails or the response is not a
            valid JSON array. ADO creation failures per story are logged and
            skipped so a single bad story does not abort the remaining batch.
    """
    parent_id = int(work_item.get("id", 0))
    stories = _generate_stories(structured_spec, anthropic_client)

    try:
        existing_items = ado_client.get_work_items(
            item_type="User Story", tag="ai-pipeline"
        )
    except ADOClientError as exc:
        print(
            f"{_LOG_PREFIX} warning: could not fetch existing items for duplicate "
            f"check — proceeding without deduplication: {exc}"
        )
        existing_items = []

    created_ids: list[int] = []
    for story in stories:
        story_id = _create_story_in_ado(story, parent_id, existing_items, ado_client)
        if story_id is not None:
            created_ids.append(story_id)
            existing_items.append({"id": story_id, "fields": {
                "System.Title": story.get("title", "")
            }})

    return created_ids


def _generate_stories(
    spec: StructuredSpec,
    anthropic_client: anthropic.Anthropic,
) -> list[dict[str, Any]]:
    """Call Claude and return the parsed array of story dicts.

    Raises:
        RuntimeError: On API failure or non-array JSON response.
    """
    system_prompt = _load_system_prompt()
    user_message = _build_user_message(spec)

    try:
        response = anthropic_client.messages.create(
            model=_MODEL,
            max_tokens=_MAX_TOKENS,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )
    except Exception as exc:
        raise RuntimeError(
            f"Story Writer: Claude API call failed for spec '{spec.title}': {exc}"
        ) from exc

    raw_text = response.content[0].text.strip()

    try:
        stories: list[dict[str, Any]] = json.loads(raw_text)
        if not isinstance(stories, list):
            raise ValueError(f"expected a JSON array, got {type(stories).__name__}")
        return stories
    except (json.JSONDecodeError, ValueError) as exc:
        raise RuntimeError(
            f"Story Writer: response was not a valid JSON array. "
            f"Raw response: {raw_text[:300]}"
        ) from exc


def _create_story_in_ado(
    story: dict[str, Any],
    parent_id: int,
    existing_items: list[dict[str, Any]],
    ado_client: ADOClient,
) -> int | None:
    """Create one User Story in ADO and link it to the parent work item.

    Returns the created story ID, or None if the ADO call fails.
    """
    title = str(story.get("title") or "Untitled story")
    description = str(story.get("description") or "")
    story_points = int(story.get("story_points") or 3)
    gherkin_scenarios: list[dict[str, Any]] = story.get("gherkin_scenarios") or []

    is_dup, dup_id = _check_for_duplicate(title, existing_items)
    if is_dup:
        description = f"[POSSIBLE DUPLICATE: #{dup_id}] {description}"

    fields: dict[str, Any] = {
        "System.Title": title,
        "System.Description": _format_ado_description(description, gherkin_scenarios),
        "System.Tags": "ai-pipeline",
        "Microsoft.VSTS.Scheduling.StoryPoints": story_points,
    }

    try:
        created = ado_client.create_work_item("User Story", fields)
        story_id = int(created["id"])
        if parent_id:
            ado_client.link_work_items(story_id, parent_id, LINK_CHILD_TO_PARENT)
        return story_id
    except ADOClientError as exc:
        print(f"{_LOG_PREFIX} warning: failed to create story '{title[:60]}' — {exc}")
        return None


def _check_for_duplicate(
    title: str,
    existing_items: list[dict[str, Any]],
) -> tuple[bool, int]:
    """Return (True, duplicate_id) when an existing item has significant title overlap."""
    def key_words(text: str) -> set[str]:
        return {
            w.lower()
            for w in text.split()
            if w.lower() not in _STOP_WORDS and len(w) > 2
        }

    new_words = key_words(title)
    if not new_words:
        return False, 0

    for item in existing_items:
        existing_title = str(item.get("fields", {}).get("System.Title", ""))
        if len(new_words & key_words(existing_title)) >= _DUPLICATE_WORD_THRESHOLD:
            return True, int(item.get("id", 0))

    return False, 0


def _format_ado_description(
    description: str,
    gherkin_scenarios: list[dict[str, Any]],
) -> str:
    """Build the HTML description stored in the ADO User Story field."""
    parts: list[str] = []
    if description:
        parts.append(f"<p>{description}</p>")
    if gherkin_scenarios:
        parts.append("<h3>Gherkin Scenarios</h3>")
        for scenario in gherkin_scenarios:
            label = scenario.get("type", "").replace("_", " ").title()
            text = scenario.get("scenario", "")
            parts.append(f"<p><strong>{label}</strong></p><pre>{text}</pre>")
    return "".join(parts)


def _build_user_message(spec: StructuredSpec) -> str:
    """Serialise the structured spec to JSON for the Claude user message."""
    return json.dumps({
        "work_item_id": spec.work_item_id,
        "title": spec.title,
        "summary": spec.summary,
        "confidence_score": spec.confidence_score,
        "affected_areas": [a.value for a in spec.affected_areas],
        "acceptance_criteria": spec.acceptance_criteria,
        "out_of_scope": spec.out_of_scope,
        "gaps": spec.gaps,
        "suggested_user_stories": spec.suggested_user_stories,
    }, indent=2)


def _load_system_prompt() -> str:
    """Read the story writer system prompt from the prompts directory."""
    try:
        return _PROMPT_PATH.read_text(encoding="utf-8")
    except OSError as exc:
        raise RuntimeError(
            f"Story Writer: could not read system prompt at {_PROMPT_PATH}: {exc}"
        ) from exc


__all__: list[Any] = ["run"]
