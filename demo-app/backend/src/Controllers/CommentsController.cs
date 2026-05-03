using DemoApp.Api.DTOs;
using DemoApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DemoApp.Api.Controllers;

/// <summary>
/// Handles comment operations for tasks.
/// </summary>
[ApiController]
[Route("api/v1/tasks/{taskId}/comments")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;
    private readonly ILogger<CommentsController> _logger;

    /// <summary>
    /// Initializes a new instance of <see cref="CommentsController"/>.
    /// </summary>
    /// <param name="commentService">The comment service.</param>
    /// <param name="logger">The logger.</param>
    public CommentsController(ICommentService commentService, ILogger<CommentsController> logger)
    {
        _commentService = commentService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves all comments for a specific task.
    /// </summary>
    /// <param name="taskId">The unique identifier of the task.</param>
    /// <returns>A list of comment DTOs.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CommentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(string taskId)
    {
        try
        {
            var comments = await _commentService.GetCommentsByTaskIdAsync(taskId);
            if (comments is null)
            {
                return NotFound();
            }

            return Ok(comments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error retrieving comments for task {TaskId}.", taskId);
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }

    /// <summary>
    /// Creates a new comment on a specific task.
    /// </summary>
    /// <param name="taskId">The unique identifier of the task.</param>
    /// <param name="dto">The create comment payload.</param>
    /// <returns>The newly created comment DTO.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(CommentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CommentDto>> CreateComment(string taskId, [FromBody] CreateCommentDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var comment = await _commentService.AddCommentAsync(taskId, dto.Text);
            if (comment is null)
            {
                return NotFound();
            }

            return CreatedAtAction(nameof(GetComments), new { taskId }, comment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error creating comment for task {TaskId}.", taskId);
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }
}
