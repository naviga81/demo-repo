import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useAssignableUsers } from '../hooks/useAssignableUsers';

vi.mock('../utils/constants', () => ({
  USERS_URL: '/api/v1/users',
}));

describe('useAssignableUsers', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('success case - returns user names when fetch succeeds', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] }),
    });

    const { result } = renderHook(() => useAssignableUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toEqual(['Alice', 'Bob']);
    expect(result.current.error).toBeNull();
  });

  it('error case - sets error message when fetch response is not ok', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useAssignableUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe('Request failed with status 500');
  });

  it('loading state - loading is true on initial render before fetch completes', async () => {
    let resolve!: (value: unknown) => void;
    const pending = new Promise((r) => { resolve = r; });
    (fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(pending);

    const { result } = renderHook(() => useAssignableUsers());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve({ ok: true, json: async () => ({ users: [] }) });
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
