# Test Results — Work Item 411

_Generated: 2026-05-03 15:56 UTC_

---

## Summary

| Metric | Value |
|---|---|
| **Status** | PASS |
| **Total** | 116 |
| **Passed** | 116 |
| **Failed** | 0 |
| **Skipped** | 0 |
| **Coverage** | 0.0% |

---

## Failed Tests

_(none)_

---

## Passed Tests

-  AssigneeAvatar render test - renders the initials of the given name inside the avatar
-  AssigneeAvatar interaction test - renders a tooltip element containing the full name
-  AssigneeAvatar edge case - renders a single initial when name has only one word
-  CheckTickIcon render test - renders an svg element that is hidden from assistive technology
-  CheckTickIcon interaction test - does not respond to click events when clicked
-  CheckTickIcon edge case - renders without crashing when no className prop is provided
-  CompletedTasksSection render test - renders the section heading and task cards when completed tasks are provided
-  CompletedTasksSection interaction test - calls onComplete with the correct task id when a task card fires the callback
-  CompletedTasksSection edge case - renders the heading and empty message when completedTasks is an empty array
-  EyeIcon render test - renders an svg element that is hidden from assistive technology
-  EyeIcon interaction test - applies a provided className to the svg element
-  EyeIcon edge case - renders without crashing when no props are provided
-  Header render test - renders the Task Manager title and the CheckTickIcon beside it
-  Header interaction test - clicking the theme toggle button calls toggleTheme
-  Header edge case - renders correctly in dark mode without crashing
-  LoadMoreButton render test - renders the button when visible is true
-  LoadMoreButton interaction test - calls onClick when the button is clicked
-  LoadMoreButton edge case - renders nothing when visible is false
-  PriorityFilter render test - renders a select with all priority options and an all-priorities option
-  PriorityFilter interaction test - calls onChange with the selected priority when a priority option is chosen
-  PriorityFilter edge case - calls onChange with null when the all-priorities option is selected
-  PriorityIcon render test - renders an svg with the correct aria-label for medium priority
-  PriorityIcon interaction test - renders the correct title attribute as tooltip text for high priority
-  PriorityIcon edge case - renders without crashing for low priority and applies blue color class
-  SmileyIcon render test - renders an svg with the correct aria-label and default size
-  SmileyIcon interaction test - renders with custom size and color props when provided
-  SmileyIcon edge case - renders without crashing when no props are provided
-  TaskCard render test - renders task title and priority icon
-  TaskCard interaction test - calls onComplete with the task id when the complete button is clicked
-  TaskCard edge case - renders Completed badge and no complete button when task is already completed
-  TaskForm render test - renders the form with a priority select defaulting to medium
-  TaskForm interaction test - allows changing the priority to high and submits with that priority
-  TaskForm edge case - shows a validation error when submitted with an empty title
-  WeatherIcon render test - renders a span with the correct aria-label for a known condition
-  WeatherIcon interaction test - applies the provided className to the rendered span
-  WeatherIcon edge case - renders the fallback icon when condition is an unrecognised string
-  WeatherWidget render test - renders condition and temperature in Fahrenheit when weather data is available
-  WeatherWidget interaction test - renders only the condition when temperature f is undefined
-  WeatherWidget edge case - renders weather error state without crashing when error is present
-  useAssignableUsers success case - returns users array when fetch succeeds
-  useAssignableUsers error case - sets error and returns empty users when fetch response is not ok
-  useAssignableUsers loading state - exposes loading as true while fetch is in flight
-  useCompleteTask success case - returns true when the PATCH request succeeds
-  useCompleteTask error case - returns false and sets completeError when fetch response is not ok
-  useCompleteTask loading state - completeError is null before any call is made
-  useCompletedTasks success case - returns only completed tasks sorted descending by completedAt
-  useCompletedTasks error case - returns an empty completedTasks array when the fetch fails
-  useCompletedTasks loading state - returns an empty completedTasks array while fetch is in flight
-  usePriorityFilter success case - filterTasks returns all tasks when selectedPriority is null
-  usePriorityFilter error case - filterTasks returns only matching tasks when a priority is selected
-  usePriorityFilter loading state - clearFilter resets selectedPriority to null and filterTasks returns all tasks
-  useTasks success case - fetches tasks and returns them when response is ok
-  useTasks error case - sets error message when fetch response is not ok
-  useTasks loading state - exposes loading as true while fetch is in flight
-  useTasks completeTask - optimistically updates task to completed in local state
-  useTasks completeTask - reverts task state when PATCH request fails
-  useUpcomingTasks success case - returns only the first 4 upcoming tasks on initial load
-  useUpcomingTasks error case - exposes error string and empty visibleTasks when fetch fails
-  useUpcomingTasks loading state - exposes loading as true while fetch is in flight
-  useUpcomingTasks loadMore - appends next 4 tasks when called once
-  useUpcomingTasks hasMore - is false when all tasks are already visible
-  useWeather success case - returns weather data including temperature f when fetch succeeds
-  useWeather error case - sets error and returns null weather when fetch response is not ok
-  useWeather loading state - exposes loading as true while fetch is in flight
-  getWeatherIcon success case - returns the correct emoji for a known condition
-  getWeatherIcon error case - returns the fallback emoji for an unknown condition
-  getWeatherIcon loading state - is case-insensitive and trims whitespace before lookup
- DemoApp.Tests.Unit.TaskServiceTests.GetTaskByIdAsync ReturnsTask WhenIdIsValid
- DemoApp.Tests.Unit.TasksControllerTests.UpdateTaskPriority InvalidPriority Returns400
- DemoApp.Tests.Unit.UsersControllerTests.GetAllUsers ServiceReturnsUsers Returns200WithUsersPayload
- DemoApp.Tests.Unit.TasksControllerTests.CreateTask ValidDto CreatedAtActionPointsToGetTaskById
- DemoApp.Tests.Unit.TasksControllerTests.CompleteTask PendingTask Returns200WithCompletedDto
- DemoApp.Tests.Unit.TasksControllerTests.CreateTask WithPriority Returns201WithCorrectPriority
- DemoApp.Tests.Unit.UserServiceTests.GetAllUsersAsync ContainsExpectedUserNames
- DemoApp.Tests.Unit.TasksControllerTests.CreateTask EmptyTitle Returns400WithValidationProblem
- DemoApp.Tests.Unit.TasksControllerTests.UpdateTaskPriority NonExistentId Returns404
- DemoApp.Tests.Unit.UsersControllerTests.GetAllUsers ServiceThrows Returns500
- DemoApp.Tests.Unit.TaskServiceTests.UpdateTaskPriorityAsync NonExistentId ReturnsNotFound
- DemoApp.Tests.Unit.TasksControllerTests.GetTaskById ValidId Returns200WithTask
- DemoApp.Tests.Unit.TaskServiceTests.GetTaskByIdAsync ReturnsNull WhenIdNotFound
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync MultipleCreations AssignsIncrementingIds
- DemoApp.Tests.Unit.TasksControllerTests.CreateTask NullDueDate Returns201WithNullDueDateInResponse
- DemoApp.Tests.Unit.WeatherControllerTests.GetCurrentWeather ServiceReturnsWeather Returns200WithWeatherDto
- DemoApp.Tests.Unit.TasksControllerTests.CreateTask ValidDto Returns201WithCreatedTask
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync NullDescription StoresEmptyString
- DemoApp.Tests.Unit.TaskServiceTests.CompleteTaskAsync NonExistentId ReturnsNotFound
- DemoApp.Tests.Unit.TaskServiceTests.UpdateTaskPriorityAsync ValidPriority PersistsPriorityChange
- DemoApp.Tests.Unit.TaskServiceTests.CompleteTaskAsync AlreadyCompletedTask ReturnsAlreadyCompleted
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync ValidDto ReturnsPersistedTask
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync TitleWithWhitespace TrimsTitleOnPersist
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync InvalidDueDateFormat StoresNullDueDate
- DemoApp.Tests.Unit.TasksControllerTests.CompleteTask AlreadyCompleted Returns409Conflict
- DemoApp.Tests.Unit.TaskServiceTests.GetAllTasksAsync ReturnsAllTasks WhenTasksExist
- DemoApp.Tests.Unit.WeatherServiceTests.GetCurrentWeatherAsync ValidCall ReturnsWeatherDtoWithTemperatureFahrenheit
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync MediumPrioritySpecified PersistsMedium
- DemoApp.Tests.Unit.UserServiceTests.GetAllUsersAsync ReturnsExactlyFiveUsers
- DemoApp.Tests.Unit.TaskServiceTests.GetAllTasksAsync AllSeededTasks HaveMediumPriority
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync LowPrioritySpecified PersistsLow
- DemoApp.Tests.Unit.WeatherControllerTests.GetCurrentWeather ServiceReturnsWeatherWithNullTemperature Returns200WithNullTemperature
- DemoApp.Tests.Unit.WeatherServiceTests.GetCurrentWeatherAsync ValidCall ReturnsPositiveTemperatureFahrenheit
- DemoApp.Tests.Unit.TaskServiceTests.CompleteTaskAsync PendingTask PersistsCompletedState
- DemoApp.Tests.Unit.WeatherServiceTests.GetCurrentWeatherAsync ValidCall ReturnsWeatherDtoWithNonEmptyCondition
- DemoApp.Tests.Unit.TasksControllerTests.UpdateTaskPriority ValidPriority Returns200WithUpdatedTask
- DemoApp.Tests.Unit.TasksControllerTests.CompleteTask NonExistentId Returns404
- DemoApp.Tests.Unit.WeatherServiceTests.GetCurrentWeatherAsync ValidCall ReturnsWeatherDtoWithNonEmptyIcon
- DemoApp.Tests.Unit.TaskServiceTests.CompleteTaskAsync PendingTask ReturnsSuccessWithCompletedTask
- DemoApp.Tests.Unit.TasksControllerTests.GetAllTasks TasksExist Returns200WithTaskList
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync HighPrioritySpecified PersistsHigh
- DemoApp.Tests.Unit.TasksControllerTests.CreateTask WhitespaceTitle Returns400WithValidationProblem
- DemoApp.Tests.Unit.TaskServiceTests.UpdateTaskPriorityAsync InvalidPriority ReturnsInvalidPriority
- DemoApp.Tests.Unit.TaskServiceTests.UpdateTaskPriorityAsync ValidPriority ReturnsSuccess
- DemoApp.Tests.Unit.WeatherControllerTests.GetCurrentWeather ServiceThrows PropagatesException
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync ValidDto TaskAppearsInGetAll
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync NullDueDate StoresNullDueDate
- DemoApp.Tests.Unit.TaskServiceTests.CreateTaskAsync NoPrioritySpecified DefaultsToMedium
- DemoApp.Tests.Unit.TasksControllerTests.GetTaskById InvalidId Returns404

---

## Skipped Tests

_(none)_
