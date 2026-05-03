using DemoApp.Api.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace DemoApp.Tests.Unit;

public sealed class ActivityServiceTests
{
    private readonly ActivityService _sut = new(NullLogger<ActivityService>.Instance);

    [Fact]
    public async Task RecordActivityAsync_ValidInput_ReturnsActivityEntryDtoWithCorrectFields()
    {
        var result = await _sut.RecordActivityAsync("task-1", "Task created");

        Assert.NotNull(result);
        Assert.Equal("task-1", result.TaskId);
        Assert.Equal("Task created", result.Description);
        Assert.False(string.IsNullOrWhiteSpace(result.Id));
        Assert.False(string.IsNullOrWhiteSpace(result.CreatedAt));
    }

    [Fact]
    public async Task RecordActivityAsync_CalledTwice_BothEntriesReturnedByGetActivity()
    {
        await _sut.RecordActivityAsync("task-2", "Task created");
        await _sut.RecordActivityAsync("task-2", "Comment added");

        var entries = await _sut.GetActivityByTaskIdAsync("task-2");

        Assert.Equal(2, entries.Count);
    }

    [Fact]
    public async Task GetActivityByTaskIdAsync_NoEntriesForTask_ReturnsEmptyList()
    {
        var entries = await _sut.GetActivityByTaskIdAsync("nonexistent-task");

        Assert.NotNull(entries);
        Assert.Empty(entries);
    }

    [Fact]
    public async Task GetActivityByTaskIdAsync_MultipleTaskIds_ReturnsOnlyEntriesForRequestedTask()
    {
        await _sut.RecordActivityAsync("task-A", "Task created");
        await _sut.RecordActivityAsync("task-B", "Task created");
        await _sut.RecordActivityAsync("task-A", "Comment added");

        var entries = await _sut.GetActivityByTaskIdAsync("task-A");

        Assert.Equal(2, entries.Count);
        Assert.All(entries, e => Assert.Equal("task-A", e.TaskId));
    }

    [Fact]
    public async Task GetActivityByTaskIdAsync_ReturnsEntriesInChronologicalOrder()
    {
        await _sut.RecordActivityAsync("task-order", "Task created");
        await Task.Delay(10);
        await _sut.RecordActivityAsync("task-order", "Comment added");

        var entries = await _sut.GetActivityByTaskIdAsync("task-order");

        Assert.Equal(2, entries.Count);
        var first = DateTime.Parse(entries[0].CreatedAt);
        var second = DateTime.Parse(entries[1].CreatedAt);
        Assert.True(first <= second);
    }

    [Fact]
    public async Task RecordActivityAsync_InvalidInput_StillCreatesEntryWithGivenDescription()
    {
        var result = await _sut.RecordActivityAsync("task-x", "");

        Assert.NotNull(result);
        Assert.Equal("", result.Description);
    }
}
