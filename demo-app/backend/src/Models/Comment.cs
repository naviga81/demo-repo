namespace DemoApp.Api.Models;

/// <summary>
/// Domain model representing a comment on a task.
/// </summary>
public class Comment
{
    /// <summary>Gets or sets the unique identifier for the comment.</summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>Gets or sets the identifier of the task this comment belongs to.</summary>
    public string TaskId { get; set; } = string.Empty;

    /// <summary>Gets or sets the comment text.</summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>Gets or sets the UTC timestamp when the comment was created.</summary>
    public DateTime CreatedAt { get; set; }
}
