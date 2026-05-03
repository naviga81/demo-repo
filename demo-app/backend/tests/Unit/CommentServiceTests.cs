using DemoApp.Api.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace DemoApp.Tests.Unit;

public sealed class CommentServiceTests
{
    private readonly Mock<IActivityService> _mockActivityService;
    private readonly CommentService _sut;

    public CommentServiceTests()
    {
        _mockActivityService = new Mock<IActivityService>();
        _mockActivityService
            .Setup(s => s.RecordActivityAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(new DemoApp.Api.DTOs.ActivityEntryDto
            {
                Id = "act-1",
                TaskId = "task-1",
                Description = "Comment added",
                CreatedAt = DateTime.UtcNow.ToString("o"),
            });

        _sut = new CommentService(_mockActivityService.Object, NullLogger<CommentService>.Instance);
    }

    [Fact]
    public async Task AddCommentAsync_ValidInput_ReturnsCommentDtoWithCorrectFields()
    {
        var result = await _sut.AddCommentAsync("task-1", "Hello world");

        Assert.NotNull(result);
        Assert.Equal("task-1", result.TaskId);
        Assert.Equal("Hello world", result.Text);
        Assert.False(string.IsNullOrWhiteSpace(result.Id));
    }

    [Fact]
    public async Task AddCommentAsync_ValidInput_RecordsCommentAddedActivity()
    {
        await _sut.AddCommentAsync("task-1", "Hello");

        _mockActivityService.Verify(
            s => s.RecordActivityAsync("task-1", "Comment added"),
            Times.Once);
    }

    [Fact]
    public async Task GetCommentsByTaskIdAsync_NoComments_ReturnsEmptyList()
    {
        var result = await _sut.GetCommentsByTaskIdAsync("task-none");

        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetCommentsByTaskIdAsync_AfterAddingComments_ReturnsCorrectComments()
    {
        await _sut.AddCommentAsync("task-2", "First");
        await _sut.AddCommentAsync("task-2", "Second");

        var result = await _sut.GetCommentsByTaskIdAsync("task-2");

        Assert.Equal(2, result.Count);
        Assert.Contains(result, c => c.Text == "First");
        Assert.Contains(result, c => c.Text == "Second");
    }

    [Fact]
    public async Task GetCommentCountAsync_AfterAddingComments_ReturnsCorrectCount()
    {
        await _sut.AddCommentAsync("task-3", "One");
        await _sut.AddCommentAsync("task-3", "Two");

        var count = await _sut.GetCommentCountAsync("task-3");

        Assert.Equal(2, count);
    }

    [Fact]
    public async Task GetCommentCountAsync_NoComments_ReturnsZero()
    {
        var count = await _sut.GetCommentCountAsync("task-empty");

        Assert.Equal(0, count);
    }
}
