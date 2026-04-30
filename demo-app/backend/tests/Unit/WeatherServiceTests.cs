using DemoApp.Api.Services;
using Xunit;

namespace DemoApp.Tests.Unit;

public sealed class WeatherServiceTests
{
    private readonly WeatherService _sut = new();

    [Fact]
    public async Task GetCurrentWeatherAsync_ValidCall_ReturnsWeatherDtoWithNonEmptyCondition()
    {
        var result = await _sut.GetCurrentWeatherAsync();

        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.Condition));
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_ValidCall_ReturnsWeatherDtoWithNonEmptyIcon()
    {
        var result = await _sut.GetCurrentWeatherAsync();

        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.Icon));
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_ValidCall_ReturnsWeatherDtoWithTemperatureFahrenheit()
    {
        var result = await _sut.GetCurrentWeatherAsync();

        Assert.NotNull(result);
        Assert.NotNull(result.TemperatureFahrenheit);
    }

    [Fact]
    public async Task GetCurrentWeatherAsync_ValidCall_ReturnsPositiveTemperatureFahrenheit()
    {
        var result = await _sut.GetCurrentWeatherAsync();

        Assert.NotNull(result);
        Assert.True(result.TemperatureFahrenheit > 0);
    }
}
