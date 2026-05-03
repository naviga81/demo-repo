# Agent Boundaries

Each agent in the pipeline operates within a strict boundary. Agents are not permitted
to access or modify resources outside their defined scope. The Audit Agent verifies
boundary compliance as part of every pipeline run.

## Boundary Matrix

| Agent | May READ | May WRITE | May NOT touch |
|---|---|---|---|
| Clarification | ADO work item description | — | ADO state, codebase, git |
| Story Writer | ADO work item, codebase (read-only scan) | ADO User Stories, ADO comments | Codebase, git, test files |
| Spec Agent | ADO stories, codebase (read-only) | `outputs/_LLD.md`, ADO comment | Codebase, git, any source file |
| Frontend Agent | LLD, structured spec, `demo-app/frontend/` | `demo-app/frontend/` only | Backend code, test files, CI config |
| Backend Agent | LLD, structured spec, frontend change summary, `demo-app/backend/` | `demo-app/backend/` only | Frontend code, test files, CI config |
| Test Agent | Change summaries, existing test suite | `demo-app/frontend/src/__tests__/`, `demo-app/backend/tests/` only | Application source files |
| Audit Agent | Full feature branch diff, test results, structured spec | — (read-only) | Nothing — zero writes |
| Supervisor | Audit report, test results, pipeline run record | GitHub PR, ADO work item state, `CHANGELOG.md` | Application source files, test files |

## Enforcement

### File boundary guard (Frontend and Backend agents)

`frontend_agent.py` rejects any write outside `demo-app/frontend/` with a `RuntimeError`
before the file is touched:

```python
if not path.startswith(_FRONTEND_ROOT):
    raise RuntimeError(f"rejected write outside frontend boundary: {path!r}")
```

The Backend Agent has an equivalent guard for `demo-app/backend/`.

### Test Agent source file protection

The Test Agent's self-correction passes (both build error correction and assertion
failure correction) operate only on files under the test directories. If a correction
attempt targets a file outside those directories, it is rejected and the pipeline fails
that correction cycle.

### Audit Agent is read-only

The Audit Agent receives the diff as input. It has no write tools registered and
produces only a structured JSON report. It cannot modify git state.

## ADO Access Levels

| Operation | Who can do it |
|---|---|
| Read work item details | Clarification, Story Writer, Spec Agent, Orchestrator |
| Post a comment | Orchestrator, Story Writer, Spec Agent, Supervisor |
| Create child work items (User Stories) | Story Writer only |
| Update work item state | Orchestrator, Supervisor only |
| Close / mark Done | Supervisor only (after post-merge tests pass) |

## What Agents Must Never Do

- No agent may call another agent directly — all orchestration goes through the Orchestrator
- No agent may modify `pipeline/` source files at runtime
- No agent may read or write the `.env` file
- No agent may push to `main` directly — only the Supervisor may open and merge a PR
- No agent may delete files from the repository
