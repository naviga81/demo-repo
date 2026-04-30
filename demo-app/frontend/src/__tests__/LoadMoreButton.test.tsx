import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoadMoreButton } from '../components/LoadMoreButton';

describe('LoadMoreButton', () => {
  it('render test - renders the button when visible is true', () => {
    const onClick = vi.fn();
    render(<LoadMoreButton onClick={onClick} visible={true} />);

    expect(
      screen.getByRole('button', { name: 'Load more upcoming tasks' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Load More')).toBeInTheDocument();
  });

  it('interaction test - calls onClick when the button is clicked', async () => {
    const onClick = vi.fn();
    render(<LoadMoreButton onClick={onClick} visible={true} />);

    const button = screen.getByRole('button', { name: 'Load more upcoming tasks' });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('edge case - renders nothing when visible is false', () => {
    const onClick = vi.fn();
    render(<LoadMoreButton onClick={onClick} visible={false} />);

    expect(
      screen.queryByRole('button', { name: 'Load more upcoming tasks' }),
    ).not.toBeInTheDocument();
  });
});
