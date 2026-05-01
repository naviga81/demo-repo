import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Header } from '../components/Header';
import * as useThemeModule from '../hooks/useTheme';

vi.mock('../components/WeatherWidget', () => ({
  WeatherWidget: () => <div data-testid="weather-widget" />,
}));

vi.mock('../components/ThemeIcon', () => ({
  ThemeIcon: ({ isDark }: { isDark: boolean }) => (
    <span data-testid="theme-icon" />
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('render test - renders the smiley emoji span with aria-hidden before the weather widget', () => {
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
    });

    render(<Header />);

    const smiley = document.querySelector('span[aria-hidden="true"]');
    expect(smiley).toBeInTheDocument();
    expect(smiley).toHaveAttribute('aria-hidden', 'true');

    const weatherWidget = screen.getByTestId('weather-widget');
    expect(weatherWidget).toBeInTheDocument();

    // Verify smiley appears before the weather widget in the DOM
    const parent = smiley!.parentElement;
    const children = Array.from(parent!.children);
    const smileyIndex = children.indexOf(smiley as Element);
    const weatherIndex = children.indexOf(weatherWidget);
    expect(smileyIndex).toBeLessThan(weatherIndex);
  });

  it('interaction test - clicking the theme toggle button calls toggleTheme', async () => {
    const toggleTheme = vi.fn();
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'light',
      toggleTheme,
    });

    render(<Header />);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('edge case - renders without crashing in dark theme and smiley is still present', () => {
    vi.spyOn(useThemeModule, 'useTheme').mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
    });

    render(<Header />);

    const smiley = document.querySelector('span[aria-hidden="true"]');
    expect(smiley).toBeInTheDocument();
    expect(smiley).toHaveClass('text-2xl');
    expect(smiley).toHaveClass('leading-none');
  });
});
