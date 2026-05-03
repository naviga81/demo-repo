# Low Level Design — Work Item 411

_Generated: 2026-05-03 15:52 UTC_

---

## Frontend Changes

**Components to create:** components/PriorityIcon.tsx, components/PriorityFilter.tsx

**Components to modify:** components/TaskCard.tsx, components/TaskForm.tsx, pages/HomePage.tsx

**Hooks:** usePriorityFilter.ts

**State changes:** Add priority state ('low' | 'medium' | 'high') to TaskForm, defaulting to 'medium', Add selectedPriority state ('low' | 'medium' | 'high' | null) to usePriorityFilter hook to track the active priority filter, Add filteredTasks derived value in HomePage that filters visibleTasks by selectedPriority when a filter is active

**Props interfaces:** PriorityIconProps, PriorityFilterProps

---

## Backend Changes

### Endpoints

- `GET /api/v1/tasks`
  - Response: `{"type": "array", "items": {"id": "string", "title": "string", "description": "string", "dueDate": "string | null", "completed": "boolean", "createdAt": "string (ISO 8601)", "assignedTo": "string | null", "priority": "string (low | medium | high)"}}`
- `GET /api/v1/tasks/{id}`
  - Response: `{"id": "string", "title": "string", "description": "string", "dueDate": "string | null", "completed": "boolean", "createdAt": "string (ISO 8601)", "assignedTo": "string | null", "priority": "string (low | medium | high)"}`
- `POST /api/v1/tasks`
  - Request: `{"title": "string (required, max 255)", "description": "string (optional)", "dueDate": "string (optional, yyyy-MM-dd)", "assignedTo": "string (optional)", "priority": "string (optional, low | medium | high, defaults to medium)"}`
  - Response: `{"id": "string", "title": "string", "description": "string", "dueDate": "string | null", "completed": "boolean", "createdAt": "string (ISO 8601)", "assignedTo": "string | null", "priority": "string (low | medium | high)"}`
- `PATCH /api/v1/tasks/{id}`
  - Request: `{"priority": "string (required, low | medium | high)"}`
  - Response: `{"id": "string", "title": "string", "description": "string", "dueDate": "string | null", "completed": "boolean", "createdAt": "string (ISO 8601)", "assignedTo": "string | null", "priority": "string (low | medium | high)"}`

**Services:** Services/ITaskService.cs, Services/TaskService.cs

**Data models:** Models/Task.cs, Models/TaskPriority.cs

**DTO changes:** DTOs/TaskDto.cs, DTOs/CreateTaskDto.cs, DTOs/UpdateTaskPriorityDto.cs

---

## Files

### Files to Create

- `demo-app/frontend/src/components/PriorityIcon.tsx`
- `demo-app/frontend/src/components/PriorityFilter.tsx`
- `demo-app/frontend/src/hooks/usePriorityFilter.ts`
- `demo-app/backend/src/Models/TaskPriority.cs`
- `demo-app/backend/src/DTOs/UpdateTaskPriorityDto.cs`

### Files to Modify

- `demo-app/frontend/src/components/TaskCard.tsx`
- `demo-app/frontend/src/components/TaskForm.tsx`
- `demo-app/frontend/src/pages/HomePage.tsx`
- `demo-app/frontend/src/types/index.ts`
- `demo-app/frontend/src/utils/strings.ts`
- `demo-app/backend/src/Models/Task.cs`
- `demo-app/backend/src/DTOs/TaskDto.cs`
- `demo-app/backend/src/DTOs/CreateTaskDto.cs`
- `demo-app/backend/src/Services/ITaskService.cs`
- `demo-app/backend/src/Services/TaskService.cs`
- `demo-app/backend/src/Controllers/TasksController.cs`
- `demo-app/backend/tests/Unit/TaskServiceTests.cs`
- `demo-app/backend/tests/Unit/TasksControllerTests.cs`

---

## New Dependencies

_(none)_
