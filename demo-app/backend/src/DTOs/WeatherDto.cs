namespace DemoApp.Api.DTOs;

/// <summary>
/// Data transfer object representing the current weather conditions.
/// </summary>
public class WeatherDto
{
    /// <summary>
    /// Gets or sets the human-readable weather condition description.
    /// </summary>
    public string Condition { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the icon identifier representing the current weather condition.
    /// </summary>
    public string Icon { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the current temperature in Fahrenheit, or null if unavailable.
    /// </summary>
    public double? TemperatureFahrenheit { get; set; }
}
