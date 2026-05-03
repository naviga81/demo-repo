# 03 — Spec Agent

**Source:** `pipeline/agents/spec_agent.py`
**System prompt:** `pipeline/prompts/spec.md`
**Contract output:** `LLDDocument` (`pipeline/contracts/lld_document.py`)

## Purpose

Translates user stories and the structured spec into a technical Low Level Design (LLD)
document. The LLD is the primary implementation blueprint used by the Frontend and
Backend agents.

## Inputs

- `StructuredSpec` from the Clarification Agent
- ADO User Story IDs (fetches full story details from ADO)
- Current demo app codebase (read-only)

## Outputs

- `LLDDocument` JSON (passed to Frontend and Backend agents)
- Human-readable `outputs/_LLD.md` written to the repository root
- ADO comment on the parent work item with an LLD summary

## LLD Schema

```json
{
  "work_item_id": "string",
  "frontend_changes": {
    "components_to_create": ["string"],
    "components_to_modify": ["string"],
    "hooks": ["string"],
    "state_changes": ["string"],
    "props_interfaces": ["string"]
  },
  "backend_changes": {
    "endpoints": [
      {
        "method": "string",
        "path": "string",
        "request_body": {},
        "response_body": {}
      }
    ],
    "services": ["string"],
    "data_models": ["string"],
    "dto_changes": ["string"]
  },
  "files_to_create": ["string"],
  "files_to_modify": ["string"],
  "new_dependencies": {
    "frontend": ["string"],
    "backend": ["string"]
  }
}
```

## What the Spec Agent Analyses

- Existing file structure and component hierarchy under `demo-app/frontend/`
- Existing API surface and data models under `demo-app/backend/`
- Acceptance criteria from each User Story
- Gherkin scenarios (used to identify edge cases that need backend handling)

## Rules

- Must NOT write any application code
- Must NOT make product or scope decisions — it implements the spec as written
- May only comment on ADO work items — must not change their state
- `outputs/_LLD.md` is overwritten on each run (it reflects the most recent pipeline run)
