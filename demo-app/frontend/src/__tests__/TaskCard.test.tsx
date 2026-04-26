import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskCard } from '../components/TaskCard';
import type { Task } from '../types';

const baseTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'A test description',
  completed: false,
  createdAt: '2024-01-15T10:00:00.000Z',
};

describe('TaskCard', () => {
  it('renders task title and description', () => {
    render(<TaskCard task={baseTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('A test description')).toBeInTheDocument();
  });

  it('shows completed badge when task is completed', () => {
    render(<TaskCard task={{ ...baseTask, completed: true }} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders without crashing when description is absent', () => {
    const taskWithoutDescription: Task = { ...baseTask, description: undefined };
    render(<TaskCard task={taskWithoutDescription} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
  });
});
