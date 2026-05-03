# Test Plan Template — WI-436

_Generated: 2026-05-03 16:43 UTC_

## Acceptance Criteria Under Test

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

## Frontend Files to Test

| File | Component | Test Type |
|---|---|---|
| `demo-app/frontend/src/components/CommentButton.tsx` | | render / interaction / edge |
| `demo-app/frontend/src/components/CommentPanel.tsx` | | render / interaction / edge |
| `demo-app/frontend/src/components/TaskCard.tsx` | | render / interaction / edge |
| `demo-app/frontend/src/pages/HomePage.tsx` | | render / interaction / edge |
| `demo-app/frontend/src/utils/strings.ts` | | render / interaction / edge |

## Component Test Requirements

| Component | Render | Interaction | Edge Case |
|---|---|---|---|

## Endpoint Test Requirements

| Endpoint | 2xx | 4xx | 5xx |
|---|---|---|---|
| GET /api/v1/tasks/{taskId}/comments | [ ] | [ ] | [ ] |
| POST /api/v1/tasks/{taskId}/comments | [ ] | [ ] | [ ] |

## Coverage Target

| File | Min Coverage |
|---|---|
| `demo-app/backend/src/Models/Comment.cs` | 70% |
| `demo-app/backend/src/DTOs/CommentDto.cs` | 70% |
| `demo-app/backend/src/DTOs/CreateCommentDto.cs` | 70% |
| `demo-app/backend/src/Services/ICommentService.cs` | 70% |
| `demo-app/backend/src/Services/CommentService.cs` | 70% |
| `demo-app/backend/src/Controllers/CommentsController.cs` | 70% |
| `demo-app/backend/src/DTOs/TaskDto.cs` | 70% |
| `demo-app/backend/src/Program.cs` | 70% |
| `demo-app/frontend/src/components/CommentButton.tsx` | 70% |
| `demo-app/frontend/src/components/CommentPanel.tsx` | 70% |
| `demo-app/frontend/src/components/TaskCard.tsx` | 70% |
| `demo-app/frontend/src/pages/HomePage.tsx` | 70% |
| `demo-app/frontend/src/utils/strings.ts` | 70% |

## Gherkin Scenarios

- As a user, I want to see a comment count on each task card, so that I can quickly know how many comments a task has without opening it
- As a user, I want to open a side panel to read all comments on a task, so that I can review discussion without leaving the current view
- As a user, I want to type and save a comment on a task via the side panel, so that I can contribute notes or updates to a task
- As a user, I want to see an error message if my comment fails to save, so that I know the action did not complete and my input is not lost
- As a user, I want to close the comment panel by clicking outside it or pressing Escape, so that I can return to the task board quickly
