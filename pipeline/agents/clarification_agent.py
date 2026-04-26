"""Clarification Agent.

Evaluates a raw ADO work item and returns a confidence score plus a structured
spec. This is the first quality gate in the pipeline — low-confidence items are
halted here before any code is written.

Unlike the diagnosis utility, this agent propagates exceptions so the
Orchestrator's retry loop can catch and handle them.
"""

import json
import sys
from pathlib import Path
from typing import Any

import anthropic

_AGENT_DIR = Path(__file__).resolve().parent
_PIPELINE_DIR = _AGENT_DIR.parent

if str(_PIPELINE_DIR) not in sys.path:
    sys.path.insert(0, str(_PIPELINE_DIR))

from contracts.structured_spec import AffectedArea, ClarificationOutput, StructuredSpec  # noqa: E402

_MODEL = "claude-sonnet-4-6"
_MAX_TOKENS = 2048
_PROMPT_PATH = _PIPELINE_DIR / "prompts" / "clarification.md"

_FIELD_ID = "System.Id"
_FIELD_TITLE = "System.Title"
_FIELD_DESCRIPTION = "System.Description"

_FALLBACK_QUESTIONS = ["Please provide a more detailed description of the requirement."]


def run(work_item: dict[str, Any], anthropic_client: anthropic.Anthropic) -> ClarificationOutput:
    """Evaluate a work item's requirement clarity and return a structured output.

    Raises on API or parse failure (unlike the diagnosis utility which catches
    internally) so the Orchestrator's retry loop can handle failures correctly.
    """
    fields = work_item.get("fields", {})
    work_item_id = str(work_item.get("id") or fields.get(_FIELD_ID) or "unknown")
    title = str(fields.get(_FIELD_TITLE) or "Untitled").strip()
    description = str(fields.get(_FIELD_DESCRIPTION) or "").strip()

    system_prompt = _load_system_prompt()
    user_message = _build_user_message(work_item_id, title, description)

    try:
        response = anthropic_client.messages.create(
            model=_MODEL,
            max_tokens=_MAX_TOKENS,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )
    except Exception as exc:
        raise RuntimeError(
            f"Clarification Agent: Claude API call failed for work item {work_item_id}: {exc}"
        ) from exc

    raw_text = response.content[0].text.strip()

    try:
        parsed: dict[str, Any] = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Clarification Agent: response for work item {work_item_id} was not valid JSON. "
            f"Raw response: {raw_text[:300]}"
        ) from exc

    return _build_output(parsed, work_item_id, title, description)


def _load_system_prompt() -> str:
    """Read the clarification system prompt from the prompts directory."""
    try:
        return _PROMPT_PATH.read_text(encoding="utf-8")
    except OSError as exc:
        raise RuntimeError(
            f"Clarification Agent: could not read system prompt at {_PROMPT_PATH}: {exc}"
        ) from exc


def _build_user_message(work_item_id: str, title: str, description: str) -> str:
    """Format the work item fields into the user-turn message sent to Claude."""
    return (
        f"Work Item ID: {work_item_id}\n"
        f"Title: {title}\n"
        f"Description:\n{description or '(no description provided)'}"
    )


def _build_output(
    parsed: dict[str, Any],
    work_item_id: str,
    title: str,
    description: str,
) -> ClarificationOutput:
    """Construct a ClarificationOutput from the parsed Claude response.

    Raises:
        RuntimeError: If confidence_score is missing or non-numeric.
    """
    try:
        score = int(parsed["confidence_score"])
    except (KeyError, ValueError, TypeError) as exc:
        raise RuntimeError(
            f"Clarification Agent: missing or invalid 'confidence_score' in response: {exc}"
        ) from exc

    raw_questions: list[str] = parsed.get("questions") or []
    questions: list[str] | None = raw_questions if raw_questions else None
    gaps: list[str] = parsed.get("gaps") or []
    raw_areas: list[str] = parsed.get("affected_areas") or []
    acceptance_criteria: list[str] = parsed.get("acceptance_criteria") or []
    out_of_scope: list[str] = parsed.get("out_of_scope") or []
    suggested_stories: list[str] = parsed.get("suggested_user_stories") or []

    if score < 50:
        return ClarificationOutput(
            confidence_score=score,
            spec=None,
            questions=questions or _FALLBACK_QUESTIONS,
        )

    affected_areas = _parse_affected_areas(raw_areas)
    spec = StructuredSpec(
        work_item_id=work_item_id,
        title=title,
        summary=description or title,
        confidence_score=score,
        partial_confidence=50 <= score <= 79,
        gaps=gaps,
        affected_areas=affected_areas,
        acceptance_criteria=acceptance_criteria,
        out_of_scope=out_of_scope,
        suggested_user_stories=suggested_stories,
    )

    return ClarificationOutput(
        confidence_score=score,
        spec=spec,
        questions=questions,
    )


def _parse_affected_areas(raw_areas: list[str]) -> list[AffectedArea]:
    """Convert raw strings to AffectedArea enum values, defaulting to [both] on empty."""
    result: list[AffectedArea] = []
    for area in raw_areas:
        try:
            result.append(AffectedArea(area.lower()))
        except ValueError:
            pass
    return result or [AffectedArea.both]


__all__: list[Any] = ["run"]
