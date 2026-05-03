import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ActivityFeed } from '../components/ActivityFeed';
import type { ActivityEntry } from '../types';

const makeEntry = (id: string, description: string, createdAt: string): ActivityEntry => ({
  id,
  taskId: 'task-1',
  description,
  createdAt,
});

describe('ActivityFeed', () => {
  it('render test - renders a list of activity entries with descriptions', () => {
    const entries: ActivityEntry[] = [
      makeEntry('a1', 'Task created', '2024-01-10T09:00:00.000Z'),
      makeEntry('a2', 'Comment added', '2024-01-11T10:00:00.000Z'),
    ];

    render(<ActivityFeed entries={entries} fetchLoading={false} fetchError={null} />);

    expect(screen.getByText('Task created')).toBeInTheDocument();
    expect(screen.getByText('Comment added')).toBeInTheDocument();
  });

  it('interaction test - renders the loading message when fetchLoading is true', () => {
    render(<ActivityFeed entries={[]} fetchLoading={true} fetchError={null} />);

    expect(screen.getByText('Loading activity...')).toBeInTheDocument();
  });

  it('edge case - renders the empty message when entries array is empty and not loading', () => {
    render(<ActivityFeed entries={[]} fetchLoading={false} fetchError={null} />);

    expect(screen.getByText('No activity recorded yet.')).toBeInTheDocument();
  });

  it('edge case - renders the error message when fetchError is provided', () => {
    render(<ActivityFeed entries={[]} fetchLoading={false} fetchError="some error" />);

    expect(screen.getByText('Failed to load activity. Please try again.')).toBeInTheDocument();
  });
});
