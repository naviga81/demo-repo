import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { HomePage } from '../pages/HomePage';
import * as useUpcomingTasksModule from '../hooks/useUpcomingTasks';
import type { Task } from '../types';

vi.mock('../components/TaskForm', () => ({
  TaskForm: ({ onTaskCreated }: { onTaskCreated: (t: Task) => void }) => (
    <div data-testid="task-form" />
  ),
}));

vi.mock('../components/TaskCard', () => ({
  TaskCard: ({ task }: { task: Task }) => (
    <div data-testid="task-card" />
  ),
}));

vi.mock('../components/LoadMoreButton', () => ({
  LoadMoreButton: () => <div data-testid="load-more-button" />,
}));

const baseHookReturn = {
  visibleTasks: [] as Task[],
  hasMore: false,
  loading: false,
  error: null,
  completeError: null,
  refetch: vi.fn(),
  addTask: vi.fn(),
  completeTask: vi.fn(),
  loadMore: vi.fn(),
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('render test - renders the SmileyIcon svg at the bottom of the page', () => {
    vi.spyOn(useUpcomingTasksModule, 'useUpcomingTasks').mockReturnValue({
      ...baseHookReturn,
    });

    render(<HomePage />);

    const svg = screen.getByRole('img', { name: 'Smiley face icon' });
    expect(svg).toBeInTheDocument();
  });

  it('interaction test - SmileyIcon has no click handler or interactive role', () => {
    vi.spyOn(useUpcomingTasksModule, 'useUpcomingTasks').mockReturnValue({
      ...baseHookReturn,
    });

    render(<HomePage />);

    const svg = screen.getByRole('img', { name: 'Smiley face icon' });
    expect(svg).not.toHaveAttribute('onClick');
    expect(svg).not.toHaveAttribute('tabindex');
  });

  it('edge case - renders the SmileyIcon even when there are no tasks', () => {
    vi.spyOn(useUpcomingTasksModule, 'useUpcomingTasks').mockReturnValue({
      ...baseHookReturn,
      visibleTasks: [],
    });

    render(<HomePage />);

    const svg = screen.getByRole('img', { name: 'Smiley face icon' });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '15');
    expect(svg).toHaveAttribute('height', '15');
    expect(svg).toHaveAttribute('fill', '#FACC15');
  });
});
