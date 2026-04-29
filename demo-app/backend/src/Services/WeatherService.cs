using DemoApp.Api.DTOs;

namespace DemoApp.Api.Services;

/// <summary>
/// Provides weather information with a set of rotating sample conditions.
/// </summary>
public class WeatherService : IWeatherService
{
    private static readonly WeatherDto[] WeatherConditions =
    [
        new WeatherDto { Condition = "Sunny", Icon = "sunny" },
        new WeatherDto { Condition = "Partly Cloudy", Icon = "partly-cloudy" },
        new WeatherDto { Condition = "Cloudy", Icon = "cloudy" },
        new WeatherDto { Condition = "Rainy", Icon = "rainy" },
        new WeatherDto { Condition = "Stormy", Icon = "stormy" },
        new WeatherDto { Condition = "Snowy", Icon = "snowy" },
        new WeatherDto { Condition = "Windy", Icon = "windy" },
    ];

    /// <summary>
    /// Retrieves the current weather conditions based on the current day of the year.
    /// </summary>
    /// <returns>A <see cref="WeatherDto"/> containing the current condition and icon.</returns>
    public Task<WeatherDto> GetCurrentWeatherAsync()
    {
        var index = DateTime.UtcNow.DayOfYear % WeatherConditions.Length;
        var weather = WeatherConditions[index];
        return Task.FromResult(weather);
    }
}
