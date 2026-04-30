import { describe, expect, it } from 'vitest';
import {
  WEATHER_ICON_MAP,
  WEATHER_ICON_FALLBACK,
  getWeatherIcon,
} from '../utils/weatherIconMap';

describe('getWeatherIcon', () => {
  it('success case - returns the correct emoji for a known condition', () => {
    expect(getWeatherIcon('sunny')).toBe('☀️');
    expect(getWeatherIcon('cloudy')).toBe('☁️');
    expect(getWeatherIcon('rain')).toBe('🌧️');
  });

  it('error case - returns the fallback emoji for an unknown condition', () => {
    const result = getWeatherIcon('unknown-condition-xyz');
    expect(result).toBe(WEATHER_ICON_FALLBACK);
  });

  it('loading state - is case-insensitive and trims whitespace before lookup', () => {
    expect(getWeatherIcon('  Sunny  ')).toBe(WEATHER_ICON_MAP['sunny']);
    expect(getWeatherIcon('CLOUDY')).toBe(WEATHER_ICON_MAP['cloudy']);
  });
});
