# Low Level Design — Work Item 436

_Generated: 2026-05-03 16:37 UTC_

---

## Frontend Changes

**Components to create:** none

**Components to modify:** components/CommentButton.tsx, components/CommentPanel.tsx, components/TaskCard.tsx, pages/HomePage.tsx

**Hooks:** useComments.ts

**State changes:** CommentPanel: manage inputText (string), validationError (string|null), saveError (string|null), isSaving (boolean) — saveError is distinct from fetch error and is cleared on retry, CommentPanel: on open (activeTask changes), reset inputText, validationError, saveError and call fetchComments(activeTask.id), CommentPanel: Save button disabled when inputText.trim() is empty OR inputText.length > 500 OR isSaving is true, CommentPanel: on successful postComment, append returned comment to list, clear inputText, call onCommentAdded(taskId) to increment count in parent, CommentPanel: on failed postComment, set saveError message, do NOT append comment, do NOT clear inputText, HomePage: commentCounts record (Record<string, number>) — initialised by fetching comment counts per task on load; updated via handleCommentAdded callback that increments count for a given taskId, HomePage: activeCommentTask (ActiveCommentTask | null) — set when user clicks a comment button, cleared on panel close, TaskCard: accept commentCount (number, defaulting to 0) and onCommentClick callback; render CommentButton with those props

**Props interfaces:** CommentPanelProps, CommentButtonProps, TaskCardProps

---

## Backend Changes

### Endpoints

- `GET /api/v1/tasks/{taskId}/comments`
- `POST /api/v1/tasks/{taskId}/comments`
  - Request: `{"text": "string (1\u2013500 characters, required)"}`
  - Response: `{"id": "string (GUID)", "taskId": "string", "text": "string", "createdAt": "string (ISO 8601 UTC)"}`

**Services:** Services/ICommentService.cs, Services/CommentService.cs

**Data models:** Models/Comment.cs

**DTO changes:** DTOs/CommentDto.cs, DTOs/CreateCommentDto.cs, DTOs/TaskDto.cs

---

## Files

### Files to Create

- `demo-app/backend/src/Models/Comment.cs`
- `demo-app/backend/src/DTOs/CommentDto.cs`
- `demo-app/backend/src/DTOs/CreateCommentDto.cs`
- `demo-app/backend/src/Services/ICommentService.cs`
- `demo-app/backend/src/Services/CommentService.cs`
- `demo-app/backend/src/Controllers/CommentsController.cs`

### Files to Modify

- `demo-app/backend/src/DTOs/TaskDto.cs`
- `demo-app/backend/src/Program.cs`
- `demo-app/frontend/src/components/CommentButton.tsx`
- `demo-app/frontend/src/components/CommentPanel.tsx`
- `demo-app/frontend/src/components/TaskCard.tsx`
- `demo-app/frontend/src/pages/HomePage.tsx`
- `demo-app/frontend/src/utils/strings.ts`

---

## New Dependencies

_(none)_
