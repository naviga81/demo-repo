import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useWeather } from '../hooks/useWeather';

describe('useWeather', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('success case - returns weather data including temperature_f when fetch succeeds', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ condition: 'Sunny', icon: 'sunny', temperature_f: 85 }),
    });

    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.weather).toEqual({ condition: 'Sunny', icon: 'sunny', temperature_f: 85 });
    expect(result.current.error).toBeNull();
  });

  it('error case - sets error and returns null weather when fetch response is not ok', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.weather).toBeNull();
    expect(result.current.error).toContain('503');
  });

  it('loading state - exposes loading as true while fetch is in flight', async () => {
    let resolve!: (value: unknown) => void;
    const pending = new Promise((r) => { resolve = r; });
    (fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(pending);

    const { result } = renderHook(() => useWeather());

    expect(result.current.loading).toBe(true);

    resolve({ ok: true, json: async () => ({ condition: 'Cloudy', icon: 'cloudy', temperature_f: 65 }) });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
