import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '../components/Header';
import * as useThemeModule from '../hooks/useTheme';
import * as useWeatherModule from '../hooks/useWeather';

describe('Header', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: { condition: 'Sunny', icon: '☀️' },
      loading: false,
      error: null,
    });
  });

  it('render test - renders the header with title, weather widget, and theme toggle', () => {
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
    });

    render(<Header />);

    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
  });

  it('interaction test - calls toggleTheme when the theme button is clicked', async () => {
    const toggleTheme = vi.fn();
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme,
    });

    render(<Header />);

    const button = screen.getByRole('button', { name: 'Switch to dark mode' });
    await userEvent.click(button);

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('edge case - renders weather error state without crashing when weather is unavailable', () => {
    vi.spyOn(useWeatherModule, 'useWeather').mockReturnValue({
      weather: null,
      loading: false,
      error: 'Failed to fetch',
    });
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
    });

    render(<Header />);

    expect(screen.getByText('Weather unavailable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument();
  });
});
