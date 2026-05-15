import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { TaskForm } from '../components/TaskForm';

const mocks = vi.hoisted(() => ({
  createTask: vi.fn(),
  useAssignableUsers: vi.fn(),
}));

vi.mock('../hooks/useCreateTask', () => ({
  createTask: mocks.createTask,
}));

vi.mock('../hooks/useAssignableUsers', () => ({
  useAssignableUsers: mocks.useAssignableUsers,
}));

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  completed: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  priority: 'medium' as const,
};

describe('TaskForm', () => {
  beforeEach(() => {
    mocks.useAssignableUsers.mockReturnValue({ users: [], loading: false, error: null });
    mocks.createTask.mockResolvedValue(mockTask);
  });

  it('render test - renders the Remarks label, input, and placeholder text', () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);

    expect(screen.getByLabelText('Remarks')).toBeInTheDocument();
    const remarksInput = screen.getByLabelText('Remarks');
    expect(remarksInput).toHaveAttribute('placeholder', 'Optional remarks (max 50 characters)');
  });

  it('interaction test - typing into the Remarks field updates its value', async () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);

    const remarksInput = screen.getByLabelText('Remarks');
    await userEvent.type(remarksInput, 'My remark');

    expect(remarksInput).toHaveValue('My remark');
  });

  it('edge case - Remarks input enforces a maxLength of 50 characters', () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);

    const remarksInput = screen.getByLabelText('Remarks');
    expect(remarksInput).toHaveAttribute('maxLength', '50');
  });

  it('edge case - form can be submitted without entering a Remarks value', async () => {
    const onTaskCreated = vi.fn();
    render(<TaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i);
    await userEvent.type(titleInput, 'My Task');

    const submitButton = screen.getByRole('button', { name: 'Add new task' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(onTaskCreated).toHaveBeenCalledTimes(1);
    });
  });

  it('edge case - Remarks field is cleared after successful form submission', async () => {
    const onTaskCreated = vi.fn();
    render(<TaskForm onTaskCreated={onTaskCreated} />);

    const titleInput = screen.getByLabelText(/Title/i);
    await userEvent.type(titleInput, 'My Task');

    const remarksInput = screen.getByLabelText('Remarks');
    await userEvent.type(remarksInput, 'Some remark');
    expect(remarksInput).toHaveValue('Some remark');

    const submitButton = screen.getByRole('button', { name: 'Add new task' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(remarksInput).toHaveValue('');
    });
  });
});
