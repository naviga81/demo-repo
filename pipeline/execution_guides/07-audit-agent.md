# 07 — Audit Agent

**Source:** `pipeline/agents/audit_agent.py`
**System prompt:** `pipeline/prompts/audit.md`
**Contract output:** `AuditReport` (`pipeline/contracts/audit_report.py`)

## Purpose

Independent code reviewer. Scores all pipeline output against defined standards and
produces a structured audit report for the Supervisor Agent.

## Inputs

- Full diff of the feature branch vs. `main`
- `TestResults` from the Test Agent
- `StructuredSpec` from the Clarification Agent

## Outputs

```json
{
  "pipeline_run_id": "string",
  "work_item_id": "string",
  "composite_score": 0.0,
  "merge_recommendation": "APPROVE | HUMAN_REVIEW | REJECT",
  "blocking_findings": [],
  "categories": {
    "code_correctness":    { "score": 0.0, "max": 2.0, "findings": [] },
    "standards_compliance":{ "score": 0.0, "max": 1.5, "findings": [] },
    "test_coverage":       { "score": 0.0, "max": 2.0, "findings": [] },
    "security":            { "score": 0.0, "max": 2.0, "findings": [] },
    "spec_adherence":      { "score": 0.0, "max": 1.0, "findings": [] },
    "performance":         { "score": 0.0, "max": 1.0, "findings": [] },
    "documentation":       { "score": 0.0, "max": 0.5, "findings": [] }
  },
  "summary": "string"
}
```

## Scoring Categories

| # | Category | Weight | Max |
|---|---|---|---|
| 1 | Code Correctness | 20% | 2.0 |
| 2 | Standards Compliance | 15% | 1.5 |
| 3 | Test Coverage & Quality | 20% | 2.0 |
| 4 | Security | 20% | 2.0 |
| 5 | Spec Adherence | 10% | 1.0 |
| 6 | Performance | 10% | 1.0 |
| 7 | Documentation | 5% | 0.5 |

## Blocking Findings

These always block the merge regardless of composite score:
- Any security finding with severity `CRITICAL` or `HIGH`
- Any failing test in the test suite
- A build failure in either frontend or backend
- A missing acceptance criterion (spec adherence score = 0)

## What the Audit Agent Checks

- **Performance:** Synchronous operations inside React renders; N+1 query patterns;
  unbounded list rendering without pagination
- **DRY violations:** Logic appearing in more than one place
- **Dead code:** Unused imports, unused functions, unreachable code blocks
- **Bundle size:** Frontend imports that pull in an entire library unnecessarily
- **API versioning:** New backend endpoints not under `/api/v1/`
- **Gherkin coverage:** Every Gherkin scenario has a corresponding named test

## Rules

- Read-only agent — makes zero writes to any file or git state
- Must NOT modify code under any circumstance
