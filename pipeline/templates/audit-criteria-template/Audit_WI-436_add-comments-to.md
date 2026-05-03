# Audit Criteria Template — WI-436

_Generated: 2026-05-03 16:44 UTC_

## Acceptance Criteria

1. Each task card displays a comment icon button showing the current comment count (e.g. 💬 3)
2. Clicking the comment icon button opens a slide-in side panel from the right side of the screen
3. When the panel opens, comments are fetched fresh from the backend API each time
4. The side panel displays the task title at the top
5. The side panel lists all existing comments for that task, each showing comment text and timestamp (no author attribution)
6. The side panel contains a text input area and a Save button at the bottom
7. Typing a comment exceeding 500 characters is prevented or flagged — the comment cannot be saved if it exceeds 500 characters
8. Clicking Save with valid input sends the comment to the backend API and, on success, appends the comment to the list immediately without a page reload
9. After a successful save, the comment count on the task card updates to reflect the new total
10. If the backend API call to save a comment fails, an error message is displayed and the comment is not added to the list
11. Clicking outside the side panel closes it
12. Pressing the Escape key closes the side panel
13. The side panel functions correctly when opened from any task card on the page
14. Comment edit and delete actions are not present in the UI

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

- `demo-app/frontend/src/components/CommentButton.tsx`
- `demo-app/frontend/src/components/CommentPanel.tsx`
- `demo-app/frontend/src/components/TaskCard.tsx`
- `demo-app/frontend/src/pages/HomePage.tsx`
- `demo-app/frontend/src/utils/strings.ts`

**Backend:**

- `demo-app/backend/src/Models/Comment.cs`
- `demo-app/backend/src/DTOs/CommentDto.cs`
- `demo-app/backend/src/DTOs/CreateCommentDto.cs`
- `demo-app/backend/src/Services/ICommentService.cs`
- `demo-app/backend/src/Services/CommentService.cs`
- `demo-app/backend/src/Controllers/CommentsController.cs`
- `demo-app/backend/src/DTOs/TaskDto.cs`
- `demo-app/backend/src/Program.cs`

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
