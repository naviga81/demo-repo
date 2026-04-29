using DemoApp.Api.DTOs;
using DemoApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DemoApp.Api.Controllers;

/// <summary>
/// Handles weather-related API requests.
/// </summary>
[ApiController]
[Route("api/v1/weather")]
public class WeatherController : ControllerBase
{
    private readonly IWeatherService _weatherService;

    /// <summary>
    /// Initializes a new instance of <see cref="WeatherController"/>.
    /// </summary>
    /// <param name="weatherService">The weather service used to retrieve weather data.</param>
    public WeatherController(IWeatherService weatherService)
    {
        _weatherService = weatherService;
    }

    /// <summary>
    /// Returns the current weather condition and icon.
    /// </summary>
    /// <returns>A <see cref="WeatherDto"/> with the current condition and icon identifier.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(WeatherDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<WeatherDto>> GetCurrentWeather()
    {
        var weather = await _weatherService.GetCurrentWeatherAsync();
        return Ok(weather);
    }
}
