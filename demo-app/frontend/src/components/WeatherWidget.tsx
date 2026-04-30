import { useWeather } from '../hooks/useWeather';
import {
  LABEL_WEATHER_LOADING,
  LABEL_WEATHER_ERROR,
  LABEL_WEATHER_ARIA,
} from '../utils/strings';
import { WeatherIcon } from './WeatherIcon';

export interface WeatherWidgetProps {
  className?: string;
}

export function WeatherWidget({ className = '' }: WeatherWidgetProps) {
  const { weather, loading, error } = useWeather();

  if (loading) {
    return (
      <span
        aria-label={LABEL_WEATHER_LOADING}
        className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
      >
        {LABEL_WEATHER_LOADING}
      </span>
    );
  }

  if (error !== null || weather === null) {
    return (
      <span
        aria-label={LABEL_WEATHER_ERROR}
        className={`text-sm text-gray-400 dark:text-gray-500 ${className}`}
      >
        {LABEL_WEATHER_ERROR}
      </span>
    );
  }

  return (
    <div
      aria-label={`${LABEL_WEATHER_ARIA}: ${weather.condition}`}
      className={`flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200 ${className}`}
    >
      <WeatherIcon condition={weather.condition} />
      <span>{weather.condition}</span>
    </div>
  );
}
