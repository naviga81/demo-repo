import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockToggleTheme = vi.fn();
let mockTheme = 'light';

vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggleTheme: mockToggleTheme,
  }),
}));

import { Header } from '../components/Header';

describe('Header', () => {
  beforeEach(() => {
    mockTheme = 'light';
    mockToggleTheme.mockReset();
  });

  it('Render_InLightMode_DisplaysSunIcon', () => {
    mockTheme = 'light';
    render(<Header />);
    const sunIcon = screen.getByRole('img', { name: 'Light mode icon' });
    expect(sunIcon).toBeDefined();
  });

  it('Render_InDarkMode_DisplaysMoonIcon', () => {
    mockTheme = 'dark';
    render(<Header />);
    const moonIcon = screen.getByRole('img', { name: 'Dark mode icon' });
    expect(moonIcon).toBeDefined();
  });

  it('Render_InLightMode_SunIconAppearsBeforeToggleButton', () => {
    mockTheme = 'light';
    render(<Header />);
    const sunIcon = screen.getByRole('img', { name: 'Light mode icon' });
    const toggleButton = screen.getByRole('button');
    const container = sunIcon.parentElement;
    expect(container).not.toBeNull();
    const children = Array.from(container!.children);
    const iconIndex = children.indexOf(sunIcon);
    const buttonIndex = children.indexOf(toggleButton);
    expect(iconIndex).toBeLessThan(buttonIndex);
  });

  it('Render_InDarkMode_MoonIconAppearsBeforeToggleButton', () => {
    mockTheme = 'dark';
    render(<Header />);
    const moonIcon = screen.getByRole('img', { name: 'Dark mode icon' });
    const toggleButton = screen.getByRole('button');
    const container = moonIcon.parentElement;
    expect(container).not.toBeNull();
    const children = Array.from(container!.children);
    const iconIndex = children.indexOf(moonIcon);
    const buttonIndex = children.indexOf(toggleButton);
    expect(iconIndex).toBeLessThan(buttonIndex);
  });

  it('Interaction_ClickToggleButton_CallsToggleTheme', async () => {
    mockTheme = 'light';
    const user = userEvent.setup();
    render(<Header />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('Render_InLightMode_ButtonShowsDarkModeLabel', () => {
    mockTheme = 'light';
    render(<Header />);
    const button = screen.getByRole('button');
    expect(button.textContent).toMatch(/dark/i);
  });

  it('Render_InDarkMode_ButtonShowsLightModeLabel', () => {
    mockTheme = 'dark';
    render(<Header />);
    const button = screen.getByRole('button');
    expect(button.textContent).toMatch(/light/i);
  });

  it('Scenario_SunIconVisibleInLightMode_SunIconIsPresent', () => {
    mockTheme = 'light';
    render(<Header />);
    expect(screen.getByRole('img', { name: 'Light mode icon' })).toBeDefined();
  });

  it('Scenario_MoonIconVisibleInDarkMode_MoonIconIsPresent', () => {
    mockTheme = 'dark';
    render(<Header />);
    expect(screen.getByRole('img', { name: 'Dark mode icon' })).toBeDefined();
  });

  it('Scenario_IconUpdatesOnToggle_IconSwitchesAfterToggle', () => {
    mockTheme = 'light';
    const { rerender } = render(<Header />);
    expect(screen.getByRole('img', { name: 'Light mode icon' })).toBeDefined();

    mockTheme = 'dark';
    rerender(<Header />);
    expect(screen.getByRole('img', { name: 'Dark mode icon' })).toBeDefined();
  });
});
