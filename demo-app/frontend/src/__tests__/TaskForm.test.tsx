import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TaskForm } from '../components/TaskForm';
import * as useCreateTaskModule from '../hooks/useCreateTask';
import type { Task } from '../types';

const mockTask: Task = {
  id: '10',
  title: 'New Task',
  description: '',
  completed: false,
  createdAt: '2024-06-01T10:00:00.000Z',
};

describe('TaskForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('render test - renders the form heading with pencil icon and all form fields without crashing', () => {
    const onTaskCreated = vi.fn();
    render(<TaskForm onTaskCreated={onTaskCreated} />);

    expect(screen.getByText('Add a New Task')).toBeInTheDocument();
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('aria-label', 'decorative pencil icon');
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add new task' })).toBeInTheDocument();
  });

  it('interaction test - submitting with a valid title calls onTaskCreated and resets the form', async () => {
    const onTaskCreated = vi.fn();
    vi.spyOn(useCreateTaskModule, 'createTask').mockResolvedValueOnce(mockTask);

    render(<TaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i);
    await userEvent.type(titleInput, 'New Task');

    const submitButton = screen.getByRole('button', { name: 'Add new task' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(onTaskCreated).toHaveBeenCalledTimes(1);
      expect(onTaskCreated).toHaveBeenCalledWith(mockTask);
    });

    expect((titleInput as HTMLInputElement).value).toBe('');
  });

  it('edge case - submitting with an empty title shows a validation error and does not call onTaskCreated', async () => {
    const onTaskCreated = vi.fn();
    render(<TaskForm onTaskCreated={onTaskCreated} />);

    const submitButton = screen.getByRole('button', { name: 'Add new task' });
    await userEvent.click(submitButton);

    expect(screen.getByRole('alert')).toHaveTextContent('Title is required.');
    expect(onTaskCreated).not.toHaveBeenCalled();
  });
});
