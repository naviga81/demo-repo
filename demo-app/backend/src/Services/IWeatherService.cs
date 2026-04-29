using DemoApp.Api.DTOs;

namespace DemoApp.Api.Services;

/// <summary>
/// Defines the contract for retrieving weather information.
/// </summary>
public interface IWeatherService
{
    /// <summary>
    /// Retrieves the current weather conditions.
    /// </summary>
    /// <returns>A <see cref="WeatherDto"/> containing the current condition and icon.</returns>
    Task<WeatherDto> GetCurrentWeatherAsync();
}
