using DemoApp.Api.Controllers;
using DemoApp.Api.DTOs;
using DemoApp.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace DemoApp.Tests.Unit;

public sealed class WeatherControllerTests
{
    private readonly Mock<IWeatherService> _mockService;
    private readonly WeatherController _sut;

    public WeatherControllerTests()
    {
        _mockService = new Mock<IWeatherService>();
        _sut = new WeatherController(_mockService.Object);
    }

    [Fact]
    public async Task GetCurrentWeather_ServiceReturnsWeather_Returns200WithWeatherDto()
    {
        var weatherDto = new WeatherDto { Condition = "Sunny", Icon = "sunny" };
        _mockService
            .Setup(s => s.GetCurrentWeatherAsync())
            .ReturnsAsync(weatherDto);

        var result = await _sut.GetCurrentWeather();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Equal(200, okResult.StatusCode);
        var dto = Assert.IsType<WeatherDto>(okResult.Value);
        Assert.Equal("Sunny", dto.Condition);
        Assert.Equal("sunny", dto.Icon);
    }

    [Fact]
    public async Task GetCurrentWeather_ServiceThrows_PropagatesException()
    {
        _mockService
            .Setup(s => s.GetCurrentWeatherAsync())
            .ThrowsAsync(new InvalidOperationException("Service failure"));

        await Assert.ThrowsAsync<InvalidOperationException>(() => _sut.GetCurrentWeather());
    }
}
