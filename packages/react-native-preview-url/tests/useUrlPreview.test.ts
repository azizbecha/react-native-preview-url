import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useUrlPreview } from '../src/useUrlPreview';
import { setBaseUrl } from '../src/constants';
import { configureCache, invalidateUrl, clearCache } from '../src/cache';
import type { LinkPreviewResponse } from '../src/types';

const mockResponse = (url: string): LinkPreviewResponse => ({
  url,
  title: `Title for ${url}`,
  description: 'Mock description',
});

const okFetch = (body: unknown) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as unknown as Response);

const errorFetch = (status: number, body: unknown) =>
  Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response);

describe('useUrlPreview hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setBaseUrl('https://azizbecha-link-preview-api.vercel.app');
    configureCache({
      maxSize: 50,
      ttl: 5 * 60 * 1000,
      errorTtl: 30 * 1000,
      enabled: true,
    });
    clearCache();
  });

  it('should be defined', () => {
    expect(useUrlPreview).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof useUrlPreview).toBe('function');
  });

  describe('cache integration', () => {
    it('second mount with same URL does not call fetch', async () => {
      const fetchMock = vi
        .fn()
        .mockImplementation(() => okFetch(mockResponse('https://example.com')));
      vi.stubGlobal('fetch', fetchMock);

      const first = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(first.result.current.loading).toBe(false));
      expect(first.result.current.data?.url).toBe('https://example.com');
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const second = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() =>
        expect(second.result.current.data?.url).toBe('https://example.com')
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('two concurrent mounts with same URL share a single fetch', async () => {
      let resolveFetch: (value: Response) => void = () => {};
      const fetchMock = vi.fn().mockImplementation(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve;
          })
      );
      vi.stubGlobal('fetch', fetchMock);

      const a = renderHook(() => useUrlPreview('https://example.com'));
      const b = renderHook(() => useUrlPreview('https://example.com'));

      expect(fetchMock).toHaveBeenCalledTimes(1);

      resolveFetch({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse('https://example.com')),
      } as unknown as Response);

      await waitFor(() => expect(a.result.current.data).not.toBeNull());
      await waitFor(() => expect(b.result.current.data).not.toBeNull());
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('invalidateUrl forces a refetch on next mount', async () => {
      const fetchMock = vi
        .fn()
        .mockImplementation(() => okFetch(mockResponse('https://example.com')));
      vi.stubGlobal('fetch', fetchMock);

      const first = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(first.result.current.data).not.toBeNull());
      expect(fetchMock).toHaveBeenCalledTimes(1);

      invalidateUrl('https://example.com');

      const second = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(second.result.current.data).not.toBeNull());
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('disabling the cache makes every mount fetch', async () => {
      configureCache({ enabled: false });
      const fetchMock = vi
        .fn()
        .mockImplementation(() => okFetch(mockResponse('https://example.com')));
      vi.stubGlobal('fetch', fetchMock);

      const first = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(first.result.current.data).not.toBeNull());

      const second = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(second.result.current.data).not.toBeNull());

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('validation', () => {
    it('reports an error for empty URL without calling fetch', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      const { result } = renderHook(() => useUrlPreview(''));
      await waitFor(() => expect(result.current.error).toBe('URL is required'));
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('reports an error for invalid URL without calling fetch', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      const { result } = renderHook(() => useUrlPreview('not a url'));
      await waitFor(() =>
        expect(result.current.error).toBe('Invalid URL format')
      );
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('timeout', () => {
    it('surfaces a timeout error when the fetch never settles', async () => {
      vi.useFakeTimers();
      const fetchMock = vi
        .fn()
        .mockImplementation((_url: string, init?: { signal?: AbortSignal }) => {
          return new Promise<Response>((_, reject) => {
            init?.signal?.addEventListener('abort', () => {
              const err = new Error('aborted');
              err.name = 'AbortError';
              reject(err);
            });
          });
        });
      vi.stubGlobal('fetch', fetchMock);

      const { result } = renderHook(() =>
        useUrlPreview('https://hangs.example.com', 1000)
      );

      expect(result.current.loading).toBe(true);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1600);
      });

      expect(result.current.error).toBe('Request timed out');
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
    });

    it('passes the AbortSignal to fetch', async () => {
      const fetchMock = vi
        .fn()
        .mockImplementation(() => okFetch(mockResponse('https://example.com')));
      vi.stubGlobal('fetch', fetchMock);

      renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(fetchMock).toHaveBeenCalled());

      const init = fetchMock.mock.calls[0]?.[1] as { signal?: AbortSignal };
      expect(init?.signal).toBeInstanceOf(AbortSignal);
    });

    it('does not cache timeout errors', async () => {
      vi.useFakeTimers();
      const fetchMock = vi
        .fn()
        .mockImplementationOnce(
          (_url: string, init?: { signal?: AbortSignal }) => {
            return new Promise<Response>((_, reject) => {
              init?.signal?.addEventListener('abort', () => {
                const err = new Error('aborted');
                err.name = 'AbortError';
                reject(err);
              });
            });
          }
        )
        .mockImplementation(() =>
          okFetch(mockResponse('https://hangs.example.com'))
        );
      vi.stubGlobal('fetch', fetchMock);

      const first = renderHook(() =>
        useUrlPreview('https://hangs.example.com', 1000)
      );

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1600);
      });

      expect(first.result.current.error).toBe('Request timed out');

      vi.useRealTimers();

      const second = renderHook(() =>
        useUrlPreview('https://hangs.example.com', 1000)
      );
      await waitFor(() => expect(second.result.current.data).not.toBeNull());
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('URL change race', () => {
    it('ignores response from a stale URL when the prop changes mid-flight', async () => {
      const resolvers: Record<string, (value: Response) => void> = {};
      const fetchMock = vi.fn().mockImplementation((url: string) => {
        return new Promise<Response>((resolve) => {
          resolvers[url] = resolve;
        });
      });
      vi.stubGlobal('fetch', fetchMock);

      const { result, rerender } = renderHook(
        ({ url }: { url: string }) => useUrlPreview(url),
        { initialProps: { url: 'https://a.example.com' } }
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);

      rerender({ url: 'https://b.example.com' });

      expect(fetchMock).toHaveBeenCalledTimes(2);

      const aKey = Object.keys(resolvers).find((k) =>
        k.includes('a.example.com')
      );
      const bKey = Object.keys(resolvers).find((k) =>
        k.includes('b.example.com')
      );
      expect(aKey).toBeDefined();
      expect(bKey).toBeDefined();

      await act(async () => {
        resolvers[aKey!]?.({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockResponse('https://a.example.com')),
        } as unknown as Response);
        resolvers[bKey!]?.({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockResponse('https://b.example.com')),
        } as unknown as Response);
      });

      await waitFor(() =>
        expect(result.current.data?.url).toBe('https://b.example.com')
      );
      expect(result.current.data?.url).not.toBe('https://a.example.com');
    });
  });

  describe('error caching', () => {
    it('caches non-timeout errors and reuses them on the next mount', async () => {
      const fetchMock = vi
        .fn()
        .mockImplementationOnce(() => errorFetch(500, { error: 'oops' }))
        .mockImplementation(() => okFetch(mockResponse('https://example.com')));
      vi.stubGlobal('fetch', fetchMock);

      const first = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(first.result.current.error).toBe('oops'));
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const second = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(second.result.current.error).toBe('oops'));
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('refetches once the cached error is invalidated', async () => {
      const fetchMock = vi
        .fn()
        .mockImplementationOnce(() => errorFetch(500, { error: 'oops' }))
        .mockImplementation(() => okFetch(mockResponse('https://example.com')));
      vi.stubGlobal('fetch', fetchMock);

      const first = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(first.result.current.error).toBe('oops'));

      invalidateUrl('https://example.com');

      const second = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(second.result.current.data).not.toBeNull());
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('logging', () => {
    it('does not call console.error when fetch fails', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const fetchMock = vi
        .fn()
        .mockImplementation(() => errorFetch(500, { error: 'oops' }));
      vi.stubGlobal('fetch', fetchMock);

      const { result } = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() => expect(result.current.error).toBe('oops'));

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
