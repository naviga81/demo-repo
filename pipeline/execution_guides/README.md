# Pipeline Execution Guides

This folder contains human-readable documentation for each agent in the SDLC pipeline.
Each guide covers what the agent does, what it receives as input, what it produces as
output, and the key rules that govern its behaviour.

## Agent Sequence

```
ADO Work Item
     │
     ▼
01-clarification-agent    Score requirement 0–100; block if < 80
     │
     ▼
02-story-writer-agent     Create ADO User Stories with Gherkin + story points
     │
     ▼
03-spec-agent             Produce Low Level Design (LLD) JSON blueprint
     │
     ├──────────────────────────────────────────┐
     ▼                                          ▼
04-frontend-agent         Write React/TS     05-backend-agent    Write .NET C#
     │                                          │
     └──────────────────┬───────────────────────┘
                        │
                        ▼
               06-test-agent         Write + run tests; auto-correct failures
                        │
                        ▼
               07-audit-agent        Score changes 0–10; flag blocking findings
                        │
                        ▼
               08-supervisor-agent   Merge / draft PR / fail based on score
```

## Guides

| File | Agent | Source code |
|---|---|---|
| [01-clarification-agent.md](01-clarification-agent.md) | Clarification | `pipeline/agents/clarification_agent.py` |
| [02-story-writer-agent.md](02-story-writer-agent.md) | Story Writer | `pipeline/agents/story_writer_agent.py` |
| [03-spec-agent.md](03-spec-agent.md) | Spec Agent | `pipeline/agents/spec_agent.py` |
| [04-frontend-agent.md](04-frontend-agent.md) | Frontend Agent | `pipeline/agents/frontend_agent.py` |
| [05-backend-agent.md](05-backend-agent.md) | Backend Agent | `pipeline/agents/backend_agent.py` |
| [06-test-agent.md](06-test-agent.md) | Test Agent | `pipeline/agents/test_agent.py` |
| [07-audit-agent.md](07-audit-agent.md) | Audit Agent | `pipeline/agents/audit_agent.py` |
| [08-supervisor-agent.md](08-supervisor-agent.md) | Supervisor | `pipeline/agents/supervisor_agent.py` |

## Orchestrator

The Orchestrator is not listed above because it is not a specialist agent — it is the
controller that drives the sequence. Its entry point is `pipeline/orchestrator/main.py`.
It polls ADO, invokes each agent in order, manages checkpoints and retries, and handles
the diagnostic retry flow on failure.

## System Prompts

Each agent loads its system prompt at runtime from `pipeline/prompts/<agent-name>.md`.
The prompts are separate from the agent Python files so they can be updated without
modifying code. Do not move or rename files in `pipeline/prompts/` — agents construct
the path relative to their own file location and will raise `RuntimeError` if the
prompt is missing.
