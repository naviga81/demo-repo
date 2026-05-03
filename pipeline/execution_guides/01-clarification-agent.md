# 01 — Clarification Agent

**Source:** `pipeline/agents/clarification_agent.py`
**System prompt:** `pipeline/prompts/clarification.md`
**Contract output:** `StructuredSpec` (`pipeline/contracts/structured_spec.py`)

## Purpose

Quality gate on incoming requirements. Returns a confidence score that determines
whether the pipeline proceeds, pauses for more information, or halts.

## Inputs

- Raw ADO work item: `{ id, title, description }`

## Outputs

```json
{
  "confidence_score": 0,
  "spec": {
    "work_item_id": "string",
    "title": "string",
    "summary": "string",
    "confidence_score": 0,
    "partial_confidence": false,
    "gaps": ["string"],
    "affected_areas": ["frontend | backend | both"],
    "acceptance_criteria": ["string"],
    "out_of_scope": ["string"],
    "suggested_user_stories": ["string"]
  },
  "questions": ["string"]
}
```

## Confidence Score Tiers

| Score | Action |
|---|---|
| ≥ 80 | Proceed with full pipeline immediately |
| 50 – 79 | Post clarifying questions to ADO; set state to `Needs Info`; block and poll; re-evaluate on each new human comment; resume when score reaches 80 |
| < 50 | Hard block — post questions to ADO; set state to `Needs Info`; halt pipeline |

## Scoring Guidance

Start at 100. Deduct for each issue:

| Issue | Deduction |
|---|---|
| Unidentifiable feature area | −30 |
| No derivable acceptance criterion | −30 |
| Ambiguous pronoun or reference (per instance) | −15 |
| Unbounded scope | −20 |

## Rules

- A structured spec is produced for any score ≥ 50, even if incomplete
- For any score < 100, produce a list of specific questions for the Product Owner
- Must NOT write code, update ADO work item state, or make architectural decisions
- Read-only access to ADO work item content
