import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ResetConfirmationDialog } from '../components/ResetConfirmationDialog';

describe('ResetConfirmationDialog', () => {
  it('render test - renders the dialog with confirmation message and Yes/No buttons when isOpen is true', () => {
    render(
      <ResetConfirmationDialog
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Do you want to reset the screen?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm reset' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel reset' })).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('interaction test - clicking the Yes button calls onConfirm', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ResetConfirmationDialog
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Confirm reset' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('interaction test - clicking the No button calls onCancel', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ResetConfirmationDialog
        isOpen={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Cancel reset' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('edge case - renders nothing when isOpen is false', () => {
    const { container } = render(
      <ResetConfirmationDialog
        isOpen={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
