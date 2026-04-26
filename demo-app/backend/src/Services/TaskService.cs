using TaskModel = DemoApp.Api.Models.Task;

namespace DemoApp.Api.Services;

/// <summary>
/// In-memory implementation of <see cref="ITaskService"/>.
/// Seeded with sample tasks on construction; no database required.
/// </summary>
public sealed class TaskService : ITaskService
{
    private readonly List<TaskModel> _tasks;

    /// <summary>Initialises the service and seeds sample tasks.</summary>
    public TaskService()
    {
        _tasks =
        [
            new TaskModel
            {
                Id = "1",
                Title = "Set up project",
                Description = "Initialise the repository and configure the pipeline.",
                Completed = true,
                CreatedAt = new DateTime(2024, 1, 10, 9, 0, 0, DateTimeKind.Utc),
            },
            new TaskModel
            {
                Id = "2",
                Title = "Write unit tests",
                Description = "Cover all service methods with xUnit tests.",
                Completed = false,
                CreatedAt = new DateTime(2024, 1, 12, 10, 30, 0, DateTimeKind.Utc),
            },
            new TaskModel
            {
                Id = "3",
                Title = "Deploy to staging",
                Description = "Push the build to the staging environment and verify.",
                Completed = false,
                CreatedAt = new DateTime(2024, 1, 15, 14, 0, 0, DateTimeKind.Utc),
            },
        ];
    }

    /// <summary>Returns all tasks.</summary>
    public Task<IEnumerable<TaskModel>> GetAllTasksAsync() =>
        Task.FromResult<IEnumerable<TaskModel>>(_tasks);

    /// <summary>Returns a single task by ID, or null if not found.</summary>
    public Task<TaskModel?> GetTaskByIdAsync(string id) =>
        Task.FromResult(_tasks.FirstOrDefault(t => t.Id == id));
}
