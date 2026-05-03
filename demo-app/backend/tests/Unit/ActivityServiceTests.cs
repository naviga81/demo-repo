using DemoApp.Api.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace DemoApp.Tests.Unit;

public sealed class ActivityServiceTests
{
    private readonly ActivityService _sut = new(NullLogger<ActivityService>.Instance);

    [Fact]
    public async Task RecordActivityAsync_ValidInput_ReturnsActivityEntryDtoWithMatchingFields()
    {
        var result = await _sut.RecordActivityAsync("task-1", "Task created");

        Assert.NotNull(result);
        Assert.Equal("task-1", result.TaskId);
        Assert.Equal("Task created", result.Description);
        Assert.False(string.IsNullOrWhiteSpace(result.Id));
        Assert.False(string.IsNullOrWhiteSpace(result.CreatedAt));
    }

    [Fact]
    public async Task RecordActivityAsync_CalledMultipleTimes_EachEntryHasUniqueId()
    {
        var first = await _sut.RecordActivityAsync("task-1", "Task created");
        var second = await _sut.RecordActivityAsync("task-1", "Comment added");

        Assert.NotEqual(first.Id, second.Id);
    }

    [Fact]
    public async Task GetActivityByTaskIdAsync_NoEntries_ReturnsEmptyList()
    {
        var result = await _sut.GetActivityByTaskIdAsync("task-nonexistent");

        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task GetActivityByTaskIdAsync_AfterRecording_ReturnsMatchingEntry()
    {
        await _sut.RecordActivityAsync("task-2", "Task marked complete");

        var result = await _sut.GetActivityByTaskIdAsync("task-2");

        Assert.Single(result);
        Assert.Equal("Task marked complete", result[0].Description);
        Assert.Equal("task-2", result[0].TaskId);
    }
}
