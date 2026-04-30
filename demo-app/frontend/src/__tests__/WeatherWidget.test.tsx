import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { WeatherWidget } from '../components/WeatherWidget';
import * as useWeatherModule from '../hooks/useWeather';

vi.mock('../components/WeatherIcon', () => ({
  WeatherIcon: ({ condition }: { condition: string }) => (
    <span data-testid="weather-icon" aria-label={condition} />
  ),
}));

describe('WeatherWidget', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('render test - renders condition and temperature in Fahrenheit when weather data is available', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: { condition: 'Partly Cloudy', icon: 'partly-cloudy', temperature_f: 72 },
      loading: false,
      error: null,
    });

    render(<WeatherWidget />);

    expect(screen.getByText('Partly Cloudy 72°F')).toBeInTheDocument();
  });

  it('interaction test - renders only the condition when temperature_f is undefined', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: { condition: 'Sunny', icon: 'sunny', temperature_f: undefined },
      loading: false,
      error: null,
    });

    render(<WeatherWidget />);

    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.queryByText(/°F/)).not.toBeInTheDocument();
  });

  it('edge case - renders weather error state without crashing when error is present', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: null,
      loading: false,
      error: 'Network error',
    });

    render(<WeatherWidget />);

    expect(screen.getByText('Weather unavailable')).toBeInTheDocument();
  });
});
