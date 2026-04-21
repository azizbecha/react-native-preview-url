import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUrlPreview } from '../src/useUrlPreview';
import { setBaseUrl } from '../src/constants';
import {
  configureCache,
  invalidateUrl,
  clearCache,
} from '../src/cache';
import type { LinkPreviewResponse } from '../src/types';

const mockResponse = (url: string): LinkPreviewResponse => ({
  url,
  title: 'Mock title',
  description: 'Mock description',
});

const okFetch = (body: unknown) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as unknown as Response);

describe('useUrlPreview hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setBaseUrl('https://azizbecha-link-preview-api.vercel.app');
    configureCache({
      maxSize: 50,
      ttl: 5 * 60 * 1000,
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
      await waitFor(() =>
        expect(first.result.current.loading).toBe(false)
      );
      expect(first.result.current.data?.title).toBe('Mock title');
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const second = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() =>
        expect(second.result.current.data?.title).toBe('Mock title')
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
      await waitFor(() =>
        expect(first.result.current.data).not.toBeNull()
      );
      expect(fetchMock).toHaveBeenCalledTimes(1);

      invalidateUrl('https://example.com');

      const second = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() =>
        expect(second.result.current.data).not.toBeNull()
      );
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('disabling the cache makes every mount fetch', async () => {
      configureCache({ enabled: false });
      const fetchMock = vi
        .fn()
        .mockImplementation(() => okFetch(mockResponse('https://example.com')));
      vi.stubGlobal('fetch', fetchMock);

      const first = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() =>
        expect(first.result.current.data).not.toBeNull()
      );

      const second = renderHook(() => useUrlPreview('https://example.com'));
      await waitFor(() =>
        expect(second.result.current.data).not.toBeNull()
      );

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('validation', () => {
    it('reports an error for empty URL without calling fetch', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      const { result } = renderHook(() => useUrlPreview(''));
      await waitFor(() =>
        expect(result.current.error).toBe('URL is required')
      );
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
});
