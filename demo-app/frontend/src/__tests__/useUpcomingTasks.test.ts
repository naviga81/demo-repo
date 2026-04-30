import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useUpcomingTasks } from '../hooks/useUpcomingTasks';
import type { Task } from '../types';

const makeTask = (id: string, completedAt?: string): Task => ({
  id,
  title: `Task ${id}`,
  description: '',
  completed: !!completedAt,
  createdAt: `2024-01-${id.padStart(2, '0')}T10:00:00.000Z`,
  ...(completedAt ? { completedAt } : {}),
} as Task);

const pendingTasks: Task[] = Array.from({ length: 6 }, (_, i) =>
  makeTask(String(i + 1)),
);

describe('useUpcomingTasks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('success case - returns only the first 4 upcoming tasks on initial load', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => pendingTasks,
    });

    const { result } = renderHook(() => useUpcomingTasks());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.visibleTasks).toHaveLength(4);
    expect(result.current.hasMore).toBe(true);
  });

  it('error case - exposes error string and empty visibleTasks when fetch fails', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useUpcomingTasks());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.visibleTasks).toHaveLength(0);
  });

  it('loading state - exposes loading as true while fetch is in flight', async () => {
    let resolve!: (v: unknown) => void;
    const pending = new Promise((r) => { resolve = r; });
    (fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(pending);

    const { result } = renderHook(() => useUpcomingTasks());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve({ ok: true, json: async () => [] });
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.loading).toBe(false);
  });

  it('loadMore - appends next 4 tasks when called once', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => pendingTasks,
    });

    const { result } = renderHook(() => useUpcomingTasks());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.visibleTasks).toHaveLength(6);
    expect(result.current.hasMore).toBe(false);
  });

  it('hasMore - is false when all tasks are already visible', async () => {
    const fewTasks = pendingTasks.slice(0, 3);
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => fewTasks,
    });

    const { result } = renderHook(() => useUpcomingTasks());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.hasMore).toBe(false);
    expect(result.current.visibleTasks).toHaveLength(3);
  });
});
