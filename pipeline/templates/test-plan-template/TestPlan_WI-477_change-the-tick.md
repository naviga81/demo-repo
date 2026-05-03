# Test Plan Template — WI-477

_Generated: 2026-05-03 21:55 UTC_

## Acceptance Criteria Under Test

1. The tick icon currently displayed beside the Task Manager title in the header is removed
2. A paper icon is displayed beside the Task Manager title in the header in its place
3. The paper icon is non-interactive (no click, hover, or focus behaviour)
4. The paper icon matches the same size as the Task Manager title text
5. The paper icon matches the same colour as the Task Manager title text

## Frontend Files to Test

| File | Component | Test Type |
|---|---|---|
| `demo-app/frontend/src/components/PaperIcon.tsx` | | render / interaction / edge |
| `demo-app/frontend/src/components/Header.tsx` | | render / interaction / edge |
| `demo-app/frontend/src/__tests__/Header.test.tsx` | | render / interaction / edge |

## Component Test Requirements

| Component | Render | Interaction | Edge Case |
|---|---|---|---|
| components/PaperIcon.tsx | [ ] | [ ] | [ ] |

## Endpoint Test Requirements

| Endpoint | 2xx | 4xx | 5xx |
|---|---|---|---|

## Coverage Target

| File | Min Coverage |
|---|---|
| `demo-app/frontend/src/components/PaperIcon.tsx` | 70% |
| `demo-app/frontend/src/components/Header.tsx` | 70% |
| `demo-app/frontend/src/__tests__/Header.test.tsx` | 70% |

## Gherkin Scenarios

- As a user, I want to see a paper icon beside the Task Manager title in the header, so that the iconography better represents the task management context
