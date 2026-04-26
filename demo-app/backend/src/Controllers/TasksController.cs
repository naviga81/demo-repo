using DemoApp.Api.DTOs;
using DemoApp.Api.Services;
using Microsoft.AspNetCore.Mvc;
using TaskModel = DemoApp.Api.Models.Task;

namespace DemoApp.Api.Controllers;

/// <summary>
/// Provides endpoints for managing tasks.
/// </summary>
[ApiController]
[Route("api/v1/tasks")]
public sealed class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    /// <summary>Initialises the controller with the task service.</summary>
    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    /// <summary>Returns all tasks.</summary>
    /// <returns>A list of all tasks.</returns>
    /// <response code="200">Tasks retrieved successfully.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllTasks()
    {
        var tasks = await _taskService.GetAllTasksAsync();
        return Ok(tasks.Select(MapToDto));
    }

    /// <summary>Returns a single task by ID.</summary>
    /// <param name="id">The task identifier.</param>
    /// <returns>The task if found, or 404 if not.</returns>
    /// <response code="200">Task retrieved successfully.</response>
    /// <response code="404">No task found with the given ID.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TaskDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTaskById(string id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);
        if (task is null)
        {
            return NotFound();
        }
        return Ok(MapToDto(task));
    }

    private static TaskDto MapToDto(TaskModel task) =>
        new()
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Completed = task.Completed,
            CreatedAt = task.CreatedAt,
        };
}
