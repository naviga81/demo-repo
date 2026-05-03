# Low Level Design — Work Item 407

_Generated: 2026-05-03 05:54 UTC_

---

## Frontend Changes

**Components to create:** components/CompletedTasksSection.tsx

**Components to modify:** pages/HomePage.tsx

**Hooks:** useCompletedTasks.ts

**State changes:** Add useCompletedTasks hook that derives completed tasks from useTasks, sorted descending by completedAt (falling back to createdAt) with no count limit, HomePage consumes useCompletedTasks alongside useUpcomingTasks to pass completed tasks list to CompletedTasksSection

**Props interfaces:** CompletedTasksSectionProps

---

## Backend Changes

### Endpoints

_(none)_

**Services:** none

**Data models:** none

**DTO changes:** none

---

## Files

### Files to Create

- `demo-app/frontend/src/components/CompletedTasksSection.tsx`
- `demo-app/frontend/src/hooks/useCompletedTasks.ts`

### Files to Modify

- `demo-app/frontend/src/pages/HomePage.tsx`
- `demo-app/frontend/src/utils/strings.ts`
- `demo-app/frontend/src/types/index.ts`

---

## New Dependencies

_(none)_
