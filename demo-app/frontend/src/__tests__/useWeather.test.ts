import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../hooks/useWeather';

const WEATHER_API_URL = 'http://localhost:5000/api/v1/weather';

describe('useWeather', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('success case - returns weather data when fetch resolves successfully', async () => {
    const mockData = { condition: 'Sunny', icon: 'sunny' };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.weather).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('error case - sets error message when fetch response is not ok', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBe('Request failed with status 500');
  });

  it('loading state - exposes loading as true while fetch is in flight', async () => {
    let resolvePromise!: (value: unknown) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(pendingPromise);

    const { result } = renderHook(() => useWeather());

    expect(result.current.loading).toBe(true);

    resolvePromise({ ok: true, json: async () => ({ condition: 'Cloudy', icon: 'cloudy' }) });

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
