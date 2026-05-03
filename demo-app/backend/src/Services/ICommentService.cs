using DemoApp.Api.DTOs;

namespace DemoApp.Api.Services;

/// <summary>
/// Defines operations for managing comments on tasks.
/// </summary>
public interface ICommentService
{
    /// <summary>
    /// Retrieves all comments for a given task, or null if the task does not exist.
    /// </summary>
    /// <param name="taskId">The identifier of the task.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The result is a read-only list of
    /// comment DTOs, or null if the task does not exist.
    /// </returns>
    Task<IReadOnlyList<CommentDto>?> GetCommentsByTaskIdAsync(string taskId);

    /// <summary>
    /// Adds a new comment to the specified task.
    /// </summary>
    /// <param name="taskId">The identifier of the task.</param>
    /// <param name="text">The comment text.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The result is the newly created
    /// comment DTO, or null if the task does not exist.
    /// </returns>
    Task<CommentDto?> AddCommentAsync(string taskId, string text);

    /// <summary>
    /// Returns the number of comments for a given task.
    /// </summary>
    /// <param name="taskId">The identifier of the task.</param>
    /// <returns>A task that represents the asynchronous operation. The result is the comment count.</returns>
    Task<int> GetCommentCountAsync(string taskId);
}
