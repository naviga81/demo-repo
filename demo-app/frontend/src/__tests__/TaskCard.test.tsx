import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskCard } from '../components/TaskCard';
import type { Task } from '../types';

const baseTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'A test description',
  completed: false,
  createdAt: '2024-01-15T14:00:00.000Z',
};

const completedTask: Task = {
  ...baseTask,
  id: '2',
  completed: true,
};

describe('TaskCard', () => {
  it('render test - renders a pending task with Mark Complete button', () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);
    render(<TaskCard task={baseTask} onComplete={onComplete} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Mark task as complete: Test Task/i }),
    ).toBeInTheDocument();
  });

  it('interaction test - clicking Mark Complete calls onComplete with the task id', async () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);
    render(<TaskCard task={baseTask} onComplete={onComplete} />);

    const button = screen.getByRole('button', { name: /Mark task as complete: Test Task/i });
    await userEvent.click(button);

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('1');
  });

  it('edge case - completed task renders Completed badge and no Mark Complete button', () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);
    render(<TaskCard task={completedTask} onComplete={onComplete} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Mark task as complete/i }),
    ).not.toBeInTheDocument();
  });
});
