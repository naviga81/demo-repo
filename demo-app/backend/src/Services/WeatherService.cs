using DemoApp.Api.DTOs;

namespace DemoApp.Api.Services;

/// <summary>
/// Provides weather information with a set of rotating sample conditions.
/// </summary>
public class WeatherService : IWeatherService
{
    private static readonly WeatherConditionEntry[] WeatherConditions =
    [
        new WeatherConditionEntry("Sunny", "sunny", 85.0),
        new WeatherConditionEntry("Partly Cloudy", "partly-cloudy", 72.0),
        new WeatherConditionEntry("Cloudy", "cloudy", 65.0),
        new WeatherConditionEntry("Rainy", "rainy", 58.0),
        new WeatherConditionEntry("Stormy", "stormy", 54.0),
        new WeatherConditionEntry("Snowy", "snowy", 28.0),
        new WeatherConditionEntry("Windy", "windy", 61.0),
    ];

    /// <summary>
    /// Retrieves the current weather conditions based on the current day of the year.
    /// </summary>
    /// <returns>A <see cref="WeatherDto"/> containing the current condition, icon, and temperature in Fahrenheit.</returns>
    public Task<WeatherDto> GetCurrentWeatherAsync()
    {
        var index = DateTime.UtcNow.DayOfYear % WeatherConditions.Length;
        var entry = WeatherConditions[index];
        var weather = new WeatherDto
        {
            Condition = entry.Condition,
            Icon = entry.Icon,
            TemperatureFahrenheit = entry.TemperatureFahrenheit
        };
        return Task.FromResult(weather);
    }

    private sealed record WeatherConditionEntry(string Condition, string Icon, double? TemperatureFahrenheit);
}
