import { renderHook, waitFor, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task One',
    description: 'Description one',
    completed: false,
    createdAt: '2024-01-10T09:00:00.000Z',
  },
  {
    id: '2',
    title: 'Task Two',
    description: 'Description two',
    completed: true,
    createdAt: '2024-01-12T10:00:00.000Z',
  },
];

describe('useTasks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('success case - fetches tasks and returns them when response is ok', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.error).toBeNull();
  });

  it('error case - sets error message when fetch response is not ok', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useTasks());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.tasks).toEqual([]);
    expect(result.current.error).toContain('500');
  });

  it('loading state - exposes loading as true while fetch is in flight', async () => {
    let resolve!: (value: unknown) => void;
    const pending = new Promise((r) => { resolve = r; });
    (fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(pending);

    const { result } = renderHook(() => useTasks());

    expect(result.current.loading).toBe(true);

    resolve({ ok: true, json: async () => [] });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('completeTask - optimistically updates task to completed in local state', async () => {
    (fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: true, json: async () => mockTasks })
      .mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.completeTask('1');
    });

    const updatedTask = result.current.tasks.find((t) => t.id === '1');
    expect(updatedTask?.completed).toBe(true);
  });

  it('completeTask - reverts task state when PATCH request fails', async () => {
    (fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: true, json: async () => mockTasks })
      .mockResolvedValueOnce({ ok: false, status: 500 });

    const { result } = renderHook(() => useTasks());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.completeTask('1');
    });

    const revertedTask = result.current.tasks.find((t) => t.id === '1');
    expect(revertedTask?.completed).toBe(false);
    expect(result.current.completeError).not.toBeNull();
  });
});
