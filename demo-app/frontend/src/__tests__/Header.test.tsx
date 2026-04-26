import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from '../components/Header';
import { useTheme } from '../hooks/useTheme';

vi.mock('../hooks/useTheme');

describe('Header', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme });
    mockToggleTheme.mockClear();
  });

  it('renders app title and toggle button', () => {
    render(<Header />);
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('calls toggleTheme when the toggle button is clicked', () => {
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: /switch to dark mode/i }));
    expect(mockToggleTheme).toHaveBeenCalledOnce();
  });

  it('renders without crashing when theme is dark', () => {
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark', toggleTheme: mockToggleTheme });
    render(<Header />);
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
