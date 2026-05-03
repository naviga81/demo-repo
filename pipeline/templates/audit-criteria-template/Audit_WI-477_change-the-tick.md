# Audit Criteria Template — WI-477

_Generated: 2026-05-03 21:56 UTC_

## Acceptance Criteria

1. The tick icon currently displayed beside the Task Manager title in the header is removed
2. A paper icon is displayed beside the Task Manager title in the header in its place
3. The paper icon is non-interactive (no click, hover, or focus behaviour)
4. The paper icon matches the same size as the Task Manager title text
5. The paper icon matches the same colour as the Task Manager title text

## Audit Category Checklist

| Category | Weight | Pass Threshold | Status |
|---|---|---|---|
| Code Correctness | 20% | ≥ 7/10 | [ ] |
| Standards Compliance | 15% | ≥ 7/10 | [ ] |
| Test Coverage | 20% | ≥ 7/10 | [ ] |
| Security | 20% | No HIGH/CRITICAL | [ ] |
| Spec Adherence | 10% | > 0/10 | [ ] |
| Performance | 10% | ≥ 5/10 | [ ] |
| Documentation | 5% | ≥ 5/10 | [ ] |

## Files Under Review

**Frontend:**

- `demo-app/frontend/src/components/PaperIcon.tsx`
- `demo-app/frontend/src/components/Header.tsx`
- `demo-app/frontend/src/__tests__/Header.test.tsx`

**Backend:**


## Blocking Conditions

- Any security finding severity HIGH or CRITICAL → **auto-reject**
- Any failing test → **auto-reject**
- Spec adherence score = 0 → **auto-reject**

## Merge Threshold

| Score | Outcome |
|---|---|
| ≥ 8.0 | Auto-merge |
| 7.0 – 7.99 | Draft PR, human review |
| < 7.0 | Pipeline failed |
