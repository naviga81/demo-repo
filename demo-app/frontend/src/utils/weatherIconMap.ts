export const WEATHER_ICON_MAP: Record<string, string> = {
  sunny: '☀️',
  clear: '☀️',
  cloudy: '☁️',
  overcast: '☁️',
  'partly cloudy': '⛅',
  rain: '🌧️',
  rainy: '🌧️',
  drizzle: '🌦️',
  storm: '⛈️',
  thunderstorm: '⛈️',
  snow: '❄️',
  snowy: '❄️',
  sleet: '🌨️',
  fog: '🌫️',
  foggy: '🌫️',
  mist: '🌫️',
  windy: '💨',
  hail: '🌩️',
  tornado: '🌪️',
  hot: '🌡️',
  cold: '🥶',
};

export const WEATHER_ICON_FALLBACK = '🌡️';

export function getWeatherIcon(condition: string): string {
  const key = condition.toLowerCase().trim();
  return WEATHER_ICON_MAP[key] ?? WEATHER_ICON_FALLBACK;
}
