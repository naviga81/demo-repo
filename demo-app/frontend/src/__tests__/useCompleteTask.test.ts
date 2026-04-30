import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useCompleteTask } from '../hooks/useCompleteTask';

describe('useCompleteTask', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('success case - returns true when the PATCH request succeeds', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
    });

    const { result } = renderHook(() => useCompleteTask());

    let returnValue: boolean;
    await act(async () => {
      returnValue = await result.current.completeTask('42');
    });

    expect(returnValue!).toBe(true);
    expect(result.current.completeError).toBeNull();
  });

  it('error case - returns false and sets completeError when fetch response is not ok', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useCompleteTask());

    let returnValue: boolean;
    await act(async () => {
      returnValue = await result.current.completeTask('99');
    });

    expect(returnValue!).toBe(false);
    expect(result.current.completeError).toBe('Request failed with status 404');
  });

  it('loading state - completeError is null before any call is made', () => {
    const { result } = renderHook(() => useCompleteTask());

    expect(result.current.completeError).toBeNull();
    expect(typeof result.current.completeTask).toBe('function');
  });
});
