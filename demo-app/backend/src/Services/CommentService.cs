using DemoApp.Api.DTOs;
using DemoApp.Api.Models;

namespace DemoApp.Api.Services;

/// <summary>
/// In-memory implementation of <see cref="ICommentService"/>.
/// </summary>
public class CommentService : ICommentService
{
    private readonly ITaskService _taskService;
    private readonly List<Comment> _comments = [];
    private readonly object _lock = new();

    /// <summary>
    /// Initializes a new instance of <see cref="CommentService"/>.
    /// </summary>
    /// <param name="taskService">The task service used to verify task existence.</param>
    public CommentService(ITaskService taskService)
    {
        _taskService = taskService;
    }

    /// <inheritdoc />
    public Task<IReadOnlyList<CommentDto>?> GetCommentsByTaskIdAsync(string taskId)
    {
        var task = _taskService.GetTaskById(taskId);
        if (task is null)
        {
            return Task.FromResult<IReadOnlyList<CommentDto>?>(null);
        }

        IReadOnlyList<CommentDto> result;
        lock (_lock)
        {
            result = _comments
                .Where(c => c.TaskId == taskId)
                .OrderBy(c => c.CreatedAt)
                .Select(MapToDto)
                .ToList()
                .AsReadOnly();
        }

        return Task.FromResult<IReadOnlyList<CommentDto>?>(result);
    }

    /// <inheritdoc />
    public Task<CommentDto?> AddCommentAsync(string taskId, string text)
    {
        var task = _taskService.GetTaskById(taskId);
        if (task is null)
        {
            return Task.FromResult<CommentDto?>(null);
        }

        var comment = new Comment
        {
            Id = Guid.NewGuid().ToString(),
            TaskId = taskId,
            Text = text,
            CreatedAt = DateTime.UtcNow,
        };

        lock (_lock)
        {
            _comments.Add(comment);
        }

        return Task.FromResult<CommentDto?>(MapToDto(comment));
    }

    /// <inheritdoc />
    public Task<int> GetCommentCountAsync(string taskId)
    {
        int count;
        lock (_lock)
        {
            count = _comments.Count(c => c.TaskId == taskId);
        }

        return Task.FromResult(count);
    }

    private static CommentDto MapToDto(Comment comment) => new()
    {
        Id = comment.Id,
        TaskId = comment.TaskId,
        Text = comment.Text,
        CreatedAt = comment.CreatedAt,
    };
}
