import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CommentPanel } from '../components/CommentPanel';
import type { ActiveCommentTask } from '../types';

// vi.hoisted creates these BEFORE vi.mock factories run, giving stable function references.
// Without this, each useComments() call returns a new vi.fn(), which changes the reference
// on every render, re-fires the useEffect([activeTask, fetchComments, fetchActivity]),
// and resets activeTab back to TAB_COMMENTS — making tab-switch tests impossible.
const mocks = vi.hoisted(() => ({
  fetchComments: vi.fn().mockResolvedValue(undefined),
  postComment: vi.fn().mockResolvedValue(null),
  fetchActivity: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../hooks/useComments', () => ({
  useComments: () => ({
    comments: [],
    fetchLoading: false,
    fetchError: null,
    fetchComments: mocks.fetchComments,
    postComment: mocks.postComment,
  }),
}));

vi.mock('../hooks/useActivity', () => ({
  useActivity: () => ({
    entries: [],
    fetchLoading: false,
    fetchError: null,
    fetchActivity: mocks.fetchActivity,
  }),
}));

vi.mock('../components/ActivityFeed', () => ({
  ActivityFeed: () => <div data-testid="activity-feed" />,
}));

const activeTask: ActiveCommentTask = { id: 'task-1', title: 'Test Task' };

describe('CommentPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('render test - renders the panel with Comments and Activity tabs visible', () => {
    render(
      <CommentPanel
        activeTask={activeTask}
        onClose={vi.fn()}
        onCommentAdded={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Show comments tab' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show activity tab' })).toBeInTheDocument();
  });

  it('interaction test - clicking the Activity tab renders the ActivityFeed component', async () => {
    render(
      <CommentPanel
        activeTask={activeTask}
        onClose={vi.fn()}
        onCommentAdded={vi.fn()}
      />
    );

    const activityTab = screen.getByRole('button', { name: 'Show activity tab' });
    await userEvent.click(activityTab);

    await waitFor(() => {
      expect(screen.getByTestId('activity-feed')).toBeInTheDocument();
    });
  });

  it('edge case - renders nothing when activeTask is null', () => {
    const { container } = render(
      <CommentPanel
        activeTask={null}
        onClose={vi.fn()}
        onCommentAdded={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
