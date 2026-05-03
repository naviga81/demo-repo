using System.ComponentModel.DataAnnotations;

namespace DemoApp.Api.DTOs;

/// <summary>
/// Data transfer object for creating a new comment on a task.
/// </summary>
public class CreateCommentDto
{
    /// <summary>Gets or sets the comment text. Must be between 1 and 500 characters.</summary>
    [Required]
    [StringLength(500, MinimumLength = 1)]
    public string Text { get; set; } = string.Empty;
}
