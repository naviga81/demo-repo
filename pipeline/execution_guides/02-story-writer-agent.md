# 02 — Story Writer Agent

**Source:** `pipeline/agents/story_writer_agent.py`
**System prompt:** `pipeline/prompts/story_writer.md`
**Invoked by:** Orchestrator (sub-step, runs immediately after clarification score ≥ 80)

## Purpose

Translates the structured spec into formal ADO User Stories. Each story has Gherkin
scenarios, Fibonacci story points, and acceptance criteria.

## Inputs

- `StructuredSpec` from the Clarification Agent
- ADO project details (org URL, project name)
- Current demo app codebase (read-only scan for dependency detection)

## Outputs

- Created ADO User Story IDs with story points set
- Updated ADO board state (`Ready for Development` per story)
- Structured story output passed to the Spec Agent

## User Story Format

```
As a [user], I want [feature], so that [benefit]
```

Every story must have at least one acceptance criterion. Stories are independently
deliverable where possible. Maximum one area of concern per story (no combined
frontend + backend stories unless tightly coupled).

## Gherkin Scenarios

Four scenarios are required per story:

| Type | Description |
|---|---|
| Happy path | Normal successful flow when everything works |
| Failure path | What happens when input is invalid or a service fails |
| Edge case | Unusual but valid input or state the system must handle |
| Boundary condition | Behaviour at the exact limit of valid input |

Syntax:
```
Scenario: <descriptive title>
  Given <initial state or precondition>
  When <action taken by user or system>
  Then <expected observable outcome>
  And <additional outcome if needed>
```

## Story Point Estimation (Fibonacci)

| Points | Meaning |
|---|---|
| 1 | Trivial — one file, well-understood pattern |
| 2 | Small — a few files, no new patterns |
| 3 | Medium — multiple files, minor new pattern |
| 5 | Large — cross-cutting, introduces new pattern |
| 8 | Very large — consider splitting |

## Dependency Detection

Before creating stories, scan the codebase for prerequisite functionality the new
stories depend on. If a dependency does not yet exist, flag it:
```
[DEPENDENCY MISSING: <description>]
```

## Duplicate Check

Before creating each story, query existing ADO work items for similar titles.
If a potential duplicate is found, flag it:
```
[POSSIBLE DUPLICATE: #<id>]
```

## Rules

- Must NOT write application code
- Must NOT modify ADO work item states other than creating child User Stories
- Must NOT make architectural decisions
