# 04 — Frontend Agent

**Source:** `pipeline/agents/frontend_agent.py`
**System prompt:** `pipeline/prompts/frontend.md`
**Contract output:** `ChangeSummary` with `agent_type = "frontend"`

## Purpose

Writes all React/TypeScript code changes required by the feature. Self-reviews the
output against coding standards before committing.

## Inputs

- `LLDDocument` from the Spec Agent
- `StructuredSpec` from the Clarification Agent
- ADO User Story IDs
- Current `demo-app/frontend/` codebase (reads files listed in LLD `files_to_modify`)

## Outputs

- Committed React/TypeScript code on the feature branch
- `ChangeSummary` JSON containing:
  - `files_created` — list of new file paths
  - `files_modified` — list of modified file paths
  - `self_review` — violations found and fixed (or clean result)
  - `dependencies_added` — new npm packages (with justification)
  - `visual_description` — one-sentence plain-English UI description
  - `branch_name` — the feature branch name

## Self-Review Step

Before committing, the agent re-reads every file it wrote and checks each against the
13 standards in its self-review system prompt. Any violation found is fixed before the
commit. The self-review result is logged in the `ChangeSummary`.

Standards checked in self-review:
- Functional components only
- Explicit TypeScript interfaces on props
- No inline styles
- Accessible interactive elements
- Complete `useEffect` dependency arrays
- No implicit `any`
- No unused imports or variables
- No magic strings
- All user-facing strings externalized
- Shared state uses Context or state manager
- All API URLs use `/api/v1/` prefix
- Named imports exist as exports in the target file
- Task completion uses `COMPLETE_TASK_URL(id)` — never URL concatenation

## Branch Creation

The agent creates the feature branch:
```
feature/<work-item-id>-<kebab-case-slug>
```
The slug is derived from the feature title, truncated to 30 characters.

## File Boundary

Only writes to `demo-app/frontend/`. Any path outside this prefix raises `RuntimeError`
before the file is touched — the Orchestrator catches this as an agent failure.

## Dependency Justification

If a new npm package is needed, the change summary must include:
- Why the package is needed
- Two alternatives considered and why they were not chosen
- The specific reason this package was selected
