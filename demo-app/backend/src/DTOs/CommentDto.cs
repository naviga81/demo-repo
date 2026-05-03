namespace DemoApp.Api.DTOs;

/// <summary>
/// Data transfer object for a comment returned from the API.
/// </summary>
public class CommentDto
{
    /// <summary>Gets or sets the unique identifier of the comment.</summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>Gets or sets the identifier of the task this comment belongs to.</summary>
    public string TaskId { get; set; } = string.Empty;

    /// <summary>Gets or sets the comment text.</summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>Gets or sets the UTC creation timestamp in ISO 8601 format.</summary>
    public DateTime CreatedAt { get; set; }
}
