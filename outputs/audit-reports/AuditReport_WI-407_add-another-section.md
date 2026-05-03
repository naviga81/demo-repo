# Audit Report — Work Item 407

_Generated: 2026-05-03 05:55 UTC_

---

## Result

| Composite Score | Recommendation |
|---|---|
| **7.85 / 10.0** | **HUMAN_REVIEW** |

---

## Category Scores

### Code Correctness — `1.4 / 2.0`

- **MEDIUM** (demo-app/frontend/src/hooks/useCompletedTasks.ts:15): useCompletedTasks calls useTasks() independently, creating a second fetch/state instance separate from the one used by useUpcomingTasks in HomePage. This means completed tasks are fetched and managed in a completely separate state tree, so optimistic updates applied via completeTask in useUpcomingTasks will not be reflected in the completed list until the separate fetch in useCompletedTasks resolves. The LLD intended useCompletedTasks to derive from the same task list, but the implementation of useTasks as called twice does not share state unless useTasks itself is a singleton/shared store.
- **LOW** (demo-app/frontend/src/hooks/useCompletedTasks.ts:8): getCompletedSortKey falls back to createdAt when completedAt is absent. While this is a reasonable fallback, for tasks that are marked complete the completedAt field should always be present per normal API contract. Silently falling back to createdAt could produce incorrect sort order if completedAt is unexpectedly missing, and no warning or defensive logging is emitted.
- **MEDIUM** (demo-app/frontend/src/components/CompletedTasksSection.tsx:16): CompletedTasksSection passes onComplete to TaskCard for completed tasks, which would allow a user to 're-complete' an already-completed task. There is no guard in CompletedTasksSection or TaskCard to suppress or disable the Mark Complete button for tasks that already have completed=true.

### Standards Compliance — `1.2 / 1.5`

- **LOW** (demo-app/frontend/src/pages/HomePage.tsx:22): The magic string constant UPCOMING_TASKS_MAX_HEIGHT = 'max-h-[200px]' is defined inline in HomePage.tsx rather than in a shared constants or styles file. While it is extracted to a const (avoiding a raw magic string in JSX), it lives in a page file rather than a dedicated constants location, which is a minor DRY/organisation violation.
- **LOW** (demo-app/frontend/src/hooks/useCompletedTasks.ts:4): useCompletedTasks does not expose loading or error states from the underlying useTasks call. The interface UseCompletedTasksResult only contains completedTasks, so consumers have no way to show a loading indicator or handle fetch errors specific to the completed tasks section. The LLD hook contract should mirror useUpcomingTasks for consistency.

### Test Coverage & Quality — `1.2 / 2.0`

- **HIGH**: coverage_percent is reported as 0.0. While all 58 tests pass, a coverage value of 0% indicates that instrumentation was not collected or was not reported, making it impossible to verify the ≥70% line coverage requirement on changed files. This is a blocking concern per the rubric.
- **MEDIUM** (demo-app/frontend/src/hooks/useCompletedTasks.ts:None): The useCompletedTasks hook tests (3 present: success, error, loading) do not include a test verifying the descending sort order when multiple completed tasks have different completedAt values. The sort logic in getCompletedSortKey is a key business rule with no direct sort-order assertion in the success case test.
- **LOW** (demo-app/frontend/src/hooks/useCompletedTasks.ts:8): There is no test for the fallback behaviour in getCompletedSortKey when completedAt is undefined (i.e., falling back to createdAt). This edge case is exercised in production but not covered by a test.
- **MEDIUM** (demo-app/frontend/src/pages/HomePage.tsx:None): No test exists for the CompletedTasksSection being rendered inside HomePage — there is no integration or page-level test verifying that HomePage renders the CompletedTasksSection below the Upcoming Tasks section as required by the acceptance criteria.

### Security — `2.0 / 2.0`

_(no findings)_

### Spec Adherence — `0.8 / 1.0`

- **LOW** (demo-app/frontend/src/components/CompletedTasksSection.tsx:16): Acceptance criterion: 'Completed tasks are rendered using the same visual style as upcoming tasks (no strikethrough, greying out, or other visual difference)'. The TaskCard component is reused without modification, which satisfies the visual parity requirement. However, as noted in code_correctness, the Mark Complete button is still visible and active on completed tasks inside CompletedTasksSection, which introduces an unintended UI inconsistency not explicitly addressed by any criterion but contrary to expected UX.
- **LOW** (demo-app/frontend/src/components/CompletedTasksSection.tsx:17): Acceptance criterion: 'The layout and styling of the Completed Tasks title and list mirrors the Upcoming Tasks title and list'. The Upcoming Tasks h2 includes an EyeIcon inline element, but the Completed Tasks h2 in CompletedTasksSection does not include any icon. This is a minor visual asymmetry, though strictly speaking the criterion says 'mirrors', which could be read as requiring no icon since the spec does not mention adding one. However the Upcoming Tasks heading has a decorative icon and the Completed Tasks heading does not — this partial mismatch is worth flagging.

### Performance — `0.9 / 1.0`

- **LOW** (demo-app/frontend/src/hooks/useCompletedTasks.ts:15): useCompletedTasks instantiates a second useTasks() hook which triggers an independent fetch to the tasks API. This results in two separate network requests on every HomePage mount — one from useUpcomingTasks and one from useCompletedTasks — when a single shared fetch would suffice. This is a minor but unnecessary network overhead.

### Documentation — `0.35 / 0.5`

- **LOW** (demo-app/frontend/src/hooks/useCompletedTasks.ts:14): The new useCompletedTasks hook and CompletedTasksSection component lack JSDoc/TSDoc comments describing their purpose, parameters, and return values. While this is a frontend TypeScript project rather than a C# project, the codebase convention of adding doc comments to public hooks and component interfaces is not followed here.
- **LOW** (demo-app/frontend/src/components/CompletedTasksSection.tsx:7): CompletedTasksSectionProps interface has no JSDoc comments on its properties, whereas other components in the codebase may document prop interfaces. Minor omission.

---

## Blocking Findings

_(none)_

---

## Summary

The implementation correctly introduces the CompletedTasksSection component and useCompletedTasks hook, satisfying the majority of acceptance criteria: the section heading is always visible, displays an empty message when no completed tasks exist, reuses TaskCard for visual parity, and sorts tasks in descending completedAt order. All 58 tests pass with zero failures. However, several issues require attention. Most critically, coverage_percent is reported as 0.0%, making it impossible to confirm the required ≥70% line coverage threshold — this is a blocking finding. A structural concern exists in that useCompletedTasks calls useTasks() independently from useUpcomingTasks, creating two separate fetch lifecycles and state trees; optimistic updates from completeTask will not synchronise between the two, and an extra network request is made on every page load. The Mark Complete button remains active on already-completed tasks within CompletedTasksSection, which is a correctness and UX issue. Spec adherence is largely met, with minor gaps: the Completed Tasks heading lacks the decorative icon present on the Upcoming Tasks heading (possible mirror mismatch), and there are no page-level integration tests confirming the relative placement of the two sections. Documentation is minimal with no JSDoc on the new hook or component. Overall the feature is functional but the dual-fetch architecture and missing coverage reporting should be resolved before shipping.
