import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WeatherWidget } from '../components/WeatherWidget';
import * as useWeatherModule from '../hooks/useWeather';

describe('WeatherWidget', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('render test - displays loading text when weather is loading', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: null,
      loading: true,
      error: null,
    });

    render(<WeatherWidget />);

    expect(screen.getByText('Loading weather...')).toBeInTheDocument();
  });

  it('interaction test - displays condition text when weather data is available', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: { condition: 'Sunny', icon: '☀️' },
      loading: false,
      error: null,
    });

    render(<WeatherWidget />);

    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('edge case - displays error text when error is present and does not crash', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: null,
      loading: false,
      error: 'Network error',
    });

    render(<WeatherWidget />);

    expect(screen.getByText('Weather unavailable')).toBeInTheDocument();
  });
});
