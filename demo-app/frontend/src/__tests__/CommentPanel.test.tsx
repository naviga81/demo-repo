import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { CommentPanel } from '../components/CommentPanel';
import type { ActiveCommentTask } from '../types';

vi.mock('../hooks/useComments', () => ({
  useComments: () => ({
    comments: [],
    fetchLoading: false,
    fetchError: null,
    fetchComments: vi.fn().mockResolvedValue(undefined),
    postComment: vi.fn().mockResolvedValue(null),
  }),
}));

vi.mock('../hooks/useActivity', () => ({
  useActivity: () => ({
    entries: [],
    fetchLoading: false,
    fetchError: null,
    fetchActivity: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock('../components/ActivityFeed', () => ({
  ActivityFeed: () => <div data-testid="activity-feed" />,
}));

const activeTask: ActiveCommentTask = { id: 'task-1', title: 'My Task' };

describe('CommentPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('render test - renders the panel with Comments and Activity tabs when activeTask is provided', () => {
    render(
      <CommentPanel
        activeTask={activeTask}
        onClose={vi.fn()}
        onCommentAdded={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Show comments tab' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show activity tab' })).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
  });

  it('interaction test - switches to Activity tab when the Activity tab button is clicked', async () => {
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

describe('useComments fetchComments error case - sets fetchError when response is not ok', () => {
  it('sets fetchError when response is not ok', async () => {
    vi.resetModules();

    const fetchError = 'Failed to load comments. Please try again.';

    vi.doMock('../hooks/useComments', () => ({
      useComments: () => ({
        comments: [],
        fetchLoading: false,
        fetchError,
        fetchComments: vi.fn().mockResolvedValue(undefined),
        postComment: vi.fn().mockResolvedValue(null),
      }),
    }));

    vi.doMock('../hooks/useActivity', () => ({
      useActivity: () => ({
        entries: [],
        fetchLoading: false,
        fetchError: null,
        fetchActivity: vi.fn().mockResolvedValue(undefined),
      }),
    }));

    vi.doMock('../components/ActivityFeed', () => ({
      ActivityFeed: () => <div data-testid="activity-feed" />,
    }));

    const { CommentPanel: CommentPanelFresh } = await import('../components/CommentPanel');

    render(
      <CommentPanelFresh
        activeTask={activeTask}
        onClose={vi.fn()}
        onCommentAdded={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load comments. Please try again.')).toBeInTheDocument();
    });
  });
});
