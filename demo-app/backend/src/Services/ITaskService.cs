using DemoApp.Api.DTOs;
using TaskModel = DemoApp.Api.Models.Task;

namespace DemoApp.Api.Services;

/// <summary>
/// Represents the result of a complete-task operation.
/// </summary>
public abstract record CompleteTaskResult
{
    /// <summary>The task was not found.</summary>
    public sealed record NotFound : CompleteTaskResult;

    /// <summary>The task was already completed.</summary>
    public sealed record AlreadyCompleted : CompleteTaskResult;

    /// <summary>The task was successfully marked as complete.</summary>
    /// <param name="Task">The updated task model.</param>
    public sealed record Success(TaskModel Task) : CompleteTaskResult;
}

/// <summary>
/// Defines the contract for task management operations.
/// </summary>
public interface ITaskService
{
    /// <summary>Returns all tasks.</summary>
    Task<IEnumerable<TaskModel>> GetAllTasksAsync();

    /// <summary>Returns a single task by ID, or null if not found.</summary>
    /// <param name="id">The task identifier.</param>
    Task<TaskModel?> GetTaskByIdAsync(string id);

    /// <summary>Creates a new task from the provided DTO and returns the persisted task.</summary>
    /// <param name="dto">The data required to create the task.</param>
    /// <returns>The newly created task.</returns>
    Task<TaskModel> CreateTaskAsync(CreateTaskDto dto);

    /// <summary>Marks an existing task as complete.</summary>
    /// <param name="id">The task identifier.</param>
    /// <returns>
    /// A <see cref="CompleteTaskResult"/> discriminated union:
    /// <see cref="CompleteTaskResult.NotFound"/> if no task exists with the given ID,
    /// <see cref="CompleteTaskResult.AlreadyCompleted"/> if the task is already complete,
    /// or <see cref="CompleteTaskResult.Success"/> containing the updated task.
    /// </returns>
    Task<CompleteTaskResult> CompleteTaskAsync(string id);
}
