# AI-Powered SDLC Automation Pipeline

## Overview

This project fully automates the software development lifecycle from a plain-English
Azure DevOps work item to a merged GitHub pull request. A Product Owner creates a work
item tagged `ai-pipeline-trigger`. Eight specialized Claude agents then run sequentially:
clarifying requirements, writing ADO user stories, producing a low-level design,
generating React and .NET code, running and self-correcting tests, auditing code quality,
and merging the PR if the composite audit score reaches 8.0 / 10.0. No human developer
or tester is in the loop.

## Agent Sequence

| # | Agent | Responsibility |
|---|---|---|
| 1 | Clarification | Scores requirement clarity 0–100; hard blocks at < 50, posts questions and blocks at 50–79, proceeds at ≥ 80 |
| 2 | Story Writer | Creates ADO User Stories with Gherkin scenarios and Fibonacci story points |
| 3 | Spec Agent | Produces a Low Level Design (LLD) JSON blueprint for code agents |
| 4 | Frontend Agent | Writes React/TypeScript code; self-reviews against standards before commit |
| 5 | Backend Agent | Writes .NET C# code; validates API contracts against frontend change summary |
| 6 | Test Agent | Writes and runs tests; auto-corrects build errors then assertion failures |
| 7 | Audit Agent | Scores changes 0–10 across 7 weighted categories; flags blocking findings |
| 8 | Supervisor | Merges at ≥ 8.0; draft PR at 7.0–7.99; failure report at < 7.0 |

## References

| What you need | Where to look |
|---|---|
| How each agent works (inputs, outputs, rules) | [`pipeline/execution_guides/`](pipeline/execution_guides/) |
| Agent system prompts (loaded at runtime) | [`pipeline/prompts/`](pipeline/prompts/) |
| Frontend coding standards | [`.claude/rules/frontend-standards.md`](.claude/rules/frontend-standards.md) |
| Backend coding standards | [`.claude/rules/backend-standards.md`](.claude/rules/backend-standards.md) |
| Testing standards | [`.claude/rules/testing-standards.md`](.claude/rules/testing-standards.md) |
| Anti-patterns (what never to do) | [`.claude/rules/anti-patterns.md`](.claude/rules/anti-patterns.md) |
| Security documentation | [`security/`](security/) |
| Output document templates | [`pipeline/templates/`](pipeline/templates/) |

## Operational Facts

**ADO trigger:** Work items must be type `Feature` or `User Story`, state `New`, and
tagged `ai-pipeline-trigger`.

**Branch naming:** `feature/<work-item-id>-<kebab-case-slug>`
Example: `feature/4821-dark-light-mode-toggle`

**Audit thresholds:**
- Score ≥ 8.0 → auto-merge to `main`
- Score 7.0 – 7.99 → draft PR opened; human may promote manually
- Score < 7.0 or any CRITICAL/HIGH finding → `PIPELINE_FAILED`

**Environment variables (store in `.env`, never commit):**
```
ADO_ORG_URL=https://dev.azure.com/<your-org>
ADO_PROJECT=<your-project>
ADO_PAT=<your-personal-access-token>
ADO_WORK_ITEM_POLL_INTERVAL_SECONDS=60
ADO_TRIGGER_TAG=ai-pipeline-trigger
ANTHROPIC_API_KEY=<your-api-key>
```

**Tech stack:**
- Pipeline: Python 3.12, Claude API (`claude-sonnet-4-6`), MCP SDK
- Frontend: React 18 + TypeScript (strict), Vite, Tailwind CSS, Vitest + RTL
- Backend: .NET 10, ASP.NET Core Web API, C# 12, xUnit + Moq

## Repository Structure

```
CLAUDE.md                      ← this file — project overview only
CHANGELOG.md                   ← auto-updated on every successful pipeline merge
.claude/rules/                 ← coding standards and anti-patterns
security/                      ← secrets, boundaries, and input validation docs
pipeline/
  orchestrator/                ← entry point (main.py) and state machine
  agents/                      ← one Python file per agent
  prompts/                     ← system prompt .md loaded by each agent at runtime
  contracts/                   ← Pydantic models for inter-agent JSON contracts
  utils/                       ← git, GitHub, logging, and diagnosis helpers
  mcp-servers/ado-mcp/         ← Azure DevOps MCP server
  execution_guides/            ← human-readable docs for each agent
  templates/                   ← LLD, test report, audit, and PR description templates
demo-app/
  frontend/                    ← React 18 app (Frontend Agent writes here only)
  backend/                     ← .NET 10 API (Backend Agent writes here only)
outputs/                       ← pipeline-generated documents (gitignored)
runs/                          ← pipeline run records (gitignored)
```

---
*Full agent specifications: [`pipeline/execution_guides/`](pipeline/execution_guides/)*
*Last updated: 2026-05-02*
