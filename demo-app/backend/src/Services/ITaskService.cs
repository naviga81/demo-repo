using TaskModel = DemoApp.Api.Models.Task;

namespace DemoApp.Api.Services;

/// <summary>
/// Defines the contract for task management operations.
/// </summary>
public interface ITaskService
{
    /// <summary>Returns all tasks.</summary>
    Task<IEnumerable<TaskModel>> GetAllTasksAsync();

    /// <summary>Returns a single task by ID, or null if not found.</summary>
    Task<TaskModel?> GetTaskByIdAsync(string id);
}
