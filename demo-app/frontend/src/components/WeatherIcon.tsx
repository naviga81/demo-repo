import { getWeatherIcon } from '../utils/weatherIconMap';

export interface WeatherIconProps {
  condition: string;
  className?: string;
}

export function WeatherIcon({ condition, className = '' }: WeatherIconProps) {
  const icon = getWeatherIcon(condition);

  return (
    <span
      role="img"
      aria-label={condition}
      className={className}
    >
      {icon}
    </span>
  );
}
