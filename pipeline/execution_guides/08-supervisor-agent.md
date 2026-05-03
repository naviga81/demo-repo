# 08 — Supervisor Agent

**Source:** `pipeline/agents/supervisor_agent.py`
**System prompt:** `pipeline/prompts/supervisor.md`
**Role:** Final decision-maker and PR description writer

## Purpose

Collects all scores, determines the merge outcome, creates the GitHub PR, and updates
ADO and the changelog on success.

## Inputs

- `AuditReport` from the Audit Agent
- `TestResults` from the Test Agent
- Pipeline run record

## Decision Logic

| Composite Score | Blocking Findings | Action |
|---|---|---|
| ≥ 8.0 | None | Open PR and auto-merge; update ADO to `Done`; update `CHANGELOG.md` |
| 7.0 – 7.99 | None | Open draft PR; post audit report to ADO; wait for optional human promotion |
| < 7.0 | Any | Open draft PR (not merged); post failure report to ADO; set `PIPELINE_FAILED` |
| Any score | CRITICAL or HIGH | Always block merge; set `PIPELINE_FAILED` |

## Merge Pre-Conditions (all must be true to auto-merge)

1. Composite audit score ≥ 8.0
2. Zero failing tests
3. No blocking audit findings (severity CRITICAL or HIGH)
4. Branch is up to date with `main`
5. All GitHub status checks pass (if CI is configured)

## Post-Merge Verification

After merging to `main`, the Supervisor re-runs the demo app's pre-existing baseline
test suite (all tests that were passing before this pipeline run). If any previously
passing test now fails:

1. Revert the merge via `git revert`
2. Push the revert commit to `main`
3. Post a rollback notice to the ADO work item
4. Set pipeline state to `PIPELINE_FAILED`

ADO is only updated to `Done` if post-merge baseline tests pass.

## Changelog Entry (on successful merge)

Appends to `CHANGELOG.md` at the repository root:
- Date
- Work item ID
- Feature title
- Plain-English description of what changed (derived from spec and change summaries)

## PR Format

The Supervisor writes the GitHub PR using the template at
`pipeline/templates/pr-description-template.md`.

PR metadata:
- **Title:** `[<work-item-id>] <spec title>`
- **Labels:** `ai-generated`, `pipeline-approved`
- **Body:** Audit report summary + change summaries + visual description

## Human Approval Escape Hatch (score 7.0 – 7.99)

- Draft PR is opened (not merged automatically)
- PR body contains the full audit report
- ADO work item receives a comment noting optional human review is available
- A human may promote the draft PR manually if they accept the quality trade-off
- Pipeline does not auto-fail in this state

## Rules

- Must NOT modify application source files
- Must NOT modify test files
- Only the Supervisor may open and merge a PR — no other agent has this permission
