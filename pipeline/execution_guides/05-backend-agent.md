# 05 — Backend Agent

**Source:** `pipeline/agents/backend_agent.py`
**System prompt:** `pipeline/prompts/backend.md`
**Contract output:** `ChangeSummary` with `agent_type = "backend"`

## Purpose

Writes all .NET C# code changes required by the feature. Validates API contracts
against the Frontend Agent's change summary before committing.

## Inputs

- `LLDDocument` from the Spec Agent
- `StructuredSpec` from the Clarification Agent
- ADO User Story IDs
- `ChangeSummary` from the Frontend Agent (for API contract validation)
- Current `demo-app/backend/` codebase

## Outputs

- Committed .NET C# code on the same feature branch as the Frontend Agent
- `ChangeSummary` JSON containing:
  - `files_created` — list of new file paths
  - `files_modified` — list of modified file paths
  - `self_review` — violations found and fixed (or clean result)
  - `api_contract_validation` — result of contract match against frontend summary
  - `dependencies_added` — new NuGet packages (with justification)
  - `branch_name` — the feature branch name

## Self-Review Step

Before committing, the agent re-reads every file it wrote and checks each against
the backend coding standards in `.claude/rules/backend-standards.md`. Any violation
found is fixed before the commit.

## API Contract Validation

For every new or modified endpoint, the agent reads the Frontend Agent's change summary
and verifies an exact match on:
- HTTP method
- Path (including version prefix)
- Request body shape
- Response shape

If a mismatch is found, the agent resolves it before committing — either by adjusting
the endpoint to match what the frontend expects, or by flagging a contract conflict in
the change summary for the Orchestrator to surface.

## File Boundary

Only writes to `demo-app/backend/`. Any path outside this prefix raises `RuntimeError`
before the file is touched.

## Key Patterns

- New endpoints must be registered in the appropriate controller under `src/Controllers/`
- New services must be registered in `src/Program.cs` via the DI container:
  `builder.Services.AddSingleton<INewService, NewService>()`
- New models go in `src/Models/`; DTOs go in `src/DTOs/`
- Shared constants go in `src/Common/`
- Never remove or modify `src/GlobalUsings.cs` or `tests/GlobalUsings.cs`

## Dependency Justification

If a new NuGet package is needed, the change summary must include:
- Why the package is needed
- Two alternatives considered and why they were not chosen
- The specific reason this package was selected
