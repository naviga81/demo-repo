import { render, screen } from '@testing-library/react';
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

describe('TaskForm', () => {
  beforeEach(() => {
    mocks.useAssignableUsers.mockReturnValue({ users: [], loading: false, error: null });
    mocks.createTask.mockReset();
  });

  it('render test - renders the Add Task and Reset buttons', () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Add new task' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset form fields' })).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('interaction test - clicking Reset button opens the confirmation dialog', async () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Reset form fields' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Do you want to reset the screen?')).toBeInTheDocument();
  });

  it('interaction test - confirming the reset dialog clears field values and closes the dialog', async () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);

    // Type something in the title field
    const titleInput = screen.getByRole('textbox', { name: /title/i });
    await userEvent.type(titleInput, 'My Task');
    expect(titleInput).toHaveValue('My Task');

    // Click Reset to open dialog
    await userEvent.click(screen.getByRole('button', { name: 'Reset form fields' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Confirm reset
    await userEvent.click(screen.getByRole('button', { name: 'Confirm reset' }));

    // Dialog should be gone and title field should be cleared
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(titleInput).toHaveValue('');
  });

  it('interaction test - cancelling the reset dialog keeps field values intact and closes the dialog', async () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    await userEvent.type(titleInput, 'Keep This');
    expect(titleInput).toHaveValue('Keep This');

    // Click Reset to open dialog
    await userEvent.click(screen.getByRole('button', { name: 'Reset form fields' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Cancel reset
    await userEvent.click(screen.getByRole('button', { name: 'Cancel reset' }));

    // Dialog should be gone but title should be unchanged
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(titleInput).toHaveValue('Keep This');
  });

  it('edge case - clicking Reset alone does not clear fields without confirmation', async () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);

    const titleInput = screen.getByRole('textbox', { name: /title/i });
    await userEvent.type(titleInput, 'Do Not Clear');

    // Click Reset — this opens dialog but does NOT reset yet
    await userEvent.click(screen.getByRole('button', { name: 'Reset form fields' }));

    // Field value should still be intact while dialog is open
    expect(titleInput).toHaveValue('Do Not Clear');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
