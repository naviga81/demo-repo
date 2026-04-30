import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { WeatherWidget } from '../components/WeatherWidget';
import * as useWeatherModule from '../hooks/useWeather';

describe('WeatherWidget', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('render test - renders the weather condition and its corresponding icon when data is available', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: { condition: 'sunny', icon: 'sunny' },
      loading: false,
      error: null,
    });

    render(<WeatherWidget />);

    expect(screen.getByText('sunny')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'sunny' })).toBeInTheDocument();
  });

  it('interaction test - displays the loading label while weather data is being fetched', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: null,
      loading: true,
      error: null,
    });

    render(<WeatherWidget />);

    expect(screen.getByText('Loading weather...')).toBeInTheDocument();
  });

  it('edge case - displays the error label when weather is null and error is present', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: null,
      loading: false,
      error: 'Network error',
    });

    render(<WeatherWidget />);

    expect(screen.getByText('Weather unavailable')).toBeInTheDocument();
  });
});
