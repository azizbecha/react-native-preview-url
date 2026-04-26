import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  configureCache,
  clearCache,
  invalidateUrl,
  getCached,
  getCachedError,
  setCached,
  setCachedError,
  getInFlight,
  setInFlight,
  clearInFlight,
} from '../src/cache';
import { setBaseUrl } from '../src/constants';
import type { LinkPreviewResponse } from '../src/types';

const makeResponse = (url: string): LinkPreviewResponse => ({
  url,
  title: `Title for ${url}`,
});

const DEFAULT_BASE = 'https://azizbecha-link-preview-api.vercel.app';

describe('cache', () => {
  beforeEach(() => {
    setBaseUrl(DEFAULT_BASE);
    configureCache({
      maxSize: 50,
      ttl: 5 * 60 * 1000,
      errorTtl: 30 * 1000,
      enabled: true,
    });
  });

  describe('set/get basics', () => {
    it('returns undefined on miss', () => {
      expect(getCached('https://example.com')).toBeUndefined();
    });

    it('stores and retrieves a value', () => {
      const data = makeResponse('https://example.com');
      setCached('https://example.com', data);
      expect(getCached('https://example.com')).toEqual(data);
    });

    it('overwrites an existing entry on set', () => {
      const first = makeResponse('https://example.com');
      const second = { ...first, title: 'Updated' };
      setCached('https://example.com', first);
      setCached('https://example.com', second);
      expect(getCached('https://example.com')?.title).toBe('Updated');
    });
  });

  describe('enabled flag', () => {
    it('getCached returns undefined when disabled', () => {
      setCached('https://example.com', makeResponse('https://example.com'));
      configureCache({ enabled: false });
      setCached('https://example.com', makeResponse('https://example.com'));
      expect(getCached('https://example.com')).toBeUndefined();
    });

    it('setCached is a no-op when disabled', () => {
      configureCache({ enabled: false });
      setCached('https://example.com', makeResponse('https://example.com'));
      configureCache({ enabled: true });
      expect(getCached('https://example.com')).toBeUndefined();
    });
  });

  describe('TTL', () => {
    it('returns value before expiry', () => {
      vi.useFakeTimers();
      configureCache({ ttl: 1000 });
      setCached('https://example.com', makeResponse('https://example.com'));
      vi.advanceTimersByTime(500);
      expect(getCached('https://example.com')).toBeDefined();
      vi.useRealTimers();
    });

    it('returns undefined after expiry and evicts the entry', () => {
      vi.useFakeTimers();
      configureCache({ ttl: 1000 });
      setCached('https://example.com', makeResponse('https://example.com'));
      vi.advanceTimersByTime(1001);
      expect(getCached('https://example.com')).toBeUndefined();
      expect(getCached('https://example.com')).toBeUndefined();
      vi.useRealTimers();
    });
  });

  describe('LRU eviction', () => {
    it('evicts the oldest entry when maxSize is exceeded', () => {
      configureCache({ maxSize: 3 });
      setCached('a', makeResponse('a'));
      setCached('b', makeResponse('b'));
      setCached('c', makeResponse('c'));
      setCached('d', makeResponse('d'));
      expect(getCached('a')).toBeUndefined();
      expect(getCached('b')).toBeDefined();
      expect(getCached('c')).toBeDefined();
      expect(getCached('d')).toBeDefined();
    });

    it('bumps an entry to most-recent on read', () => {
      configureCache({ maxSize: 3 });
      setCached('a', makeResponse('a'));
      setCached('b', makeResponse('b'));
      setCached('c', makeResponse('c'));
      getCached('a');
      setCached('d', makeResponse('d'));
      expect(getCached('a')).toBeDefined();
      expect(getCached('b')).toBeUndefined();
    });

    it('error entries share maxSize with success entries', () => {
      configureCache({ maxSize: 2 });
      setCached('a', makeResponse('a'));
      setCachedError('b', 'boom');
      setCached('c', makeResponse('c'));
      expect(getCached('a')).toBeUndefined();
      expect(getCachedError('b')).toBe('boom');
      expect(getCached('c')).toBeDefined();
    });
  });

  describe('clearCache', () => {
    it('removes all entries (success and error)', () => {
      setCached('a', makeResponse('a'));
      setCachedError('b', 'boom');
      clearCache();
      expect(getCached('a')).toBeUndefined();
      expect(getCachedError('b')).toBeUndefined();
    });
  });

  describe('invalidateUrl', () => {
    it('removes only the specified entry', () => {
      setCached('a', makeResponse('a'));
      setCached('b', makeResponse('b'));
      invalidateUrl('a');
      expect(getCached('a')).toBeUndefined();
      expect(getCached('b')).toBeDefined();
    });

    it('invalidates a cached error for the URL', () => {
      setCachedError('a', 'boom');
      invalidateUrl('a');
      expect(getCachedError('a')).toBeUndefined();
    });
  });

  describe('error caching', () => {
    it('stores and retrieves an error message', () => {
      setCachedError('https://example.com', 'Server error');
      expect(getCachedError('https://example.com')).toBe('Server error');
    });

    it('expires errors after errorTtl', () => {
      vi.useFakeTimers();
      configureCache({ errorTtl: 1000 });
      setCachedError('https://example.com', 'boom');
      vi.advanceTimersByTime(500);
      expect(getCachedError('https://example.com')).toBe('boom');
      vi.advanceTimersByTime(600);
      expect(getCachedError('https://example.com')).toBeUndefined();
      vi.useRealTimers();
    });

    it('uses errorTtl independently from success ttl', () => {
      vi.useFakeTimers();
      configureCache({ ttl: 60_000, errorTtl: 1000 });
      setCached('a', makeResponse('a'));
      setCachedError('b', 'boom');
      vi.advanceTimersByTime(1500);
      expect(getCached('a')).toBeDefined();
      expect(getCachedError('b')).toBeUndefined();
      vi.useRealTimers();
    });

    it('getCached returns undefined for an error entry, getCachedError returns undefined for a success entry', () => {
      setCached('a', makeResponse('a'));
      setCachedError('b', 'boom');
      expect(getCachedError('a')).toBeUndefined();
      expect(getCached('b')).toBeUndefined();
    });
  });

  describe('base-URL-scoped keys', () => {
    it('treats the same URL under different base URLs as different entries', () => {
      setBaseUrl('https://api1.example.com');
      setCached('https://example.com', makeResponse('one'));

      setBaseUrl('https://api2.example.com');
      expect(getCached('https://example.com')).toBeUndefined();

      setCached('https://example.com', makeResponse('two'));
      expect(getCached('https://example.com')?.url).toBe('two');

      setBaseUrl('https://api1.example.com');
      expect(getCached('https://example.com')?.url).toBe('one');
    });

    it('invalidateUrl only affects the current base URL', () => {
      setBaseUrl('https://api1.example.com');
      setCached('https://example.com', makeResponse('one'));
      setBaseUrl('https://api2.example.com');
      setCached('https://example.com', makeResponse('two'));

      invalidateUrl('https://example.com');
      expect(getCached('https://example.com')).toBeUndefined();

      setBaseUrl('https://api1.example.com');
      expect(getCached('https://example.com')?.url).toBe('one');
    });
  });

  describe('in-flight dedup', () => {
    it('returns undefined when no request is in flight', () => {
      expect(getInFlight('https://example.com')).toBeUndefined();
    });

    it('tracks and returns an in-flight promise', async () => {
      const p = Promise.resolve(makeResponse('https://example.com'));
      setInFlight('https://example.com', p);
      expect(getInFlight('https://example.com')).toBe(p);
      await p;
    });

    it('clears an in-flight promise', () => {
      const p = Promise.resolve(makeResponse('https://example.com'));
      setInFlight('https://example.com', p);
      clearInFlight('https://example.com');
      expect(getInFlight('https://example.com')).toBeUndefined();
    });

    it('scopes in-flight tracking by base URL', () => {
      const p = Promise.resolve(makeResponse('a'));
      setBaseUrl('https://api1.example.com');
      setInFlight('a', p);
      setBaseUrl('https://api2.example.com');
      expect(getInFlight('a')).toBeUndefined();
      setBaseUrl('https://api1.example.com');
      expect(getInFlight('a')).toBe(p);
    });
  });

  describe('configureCache side effects', () => {
    it('drops existing entries when reconfigured', () => {
      setCached('a', makeResponse('a'));
      configureCache({ ttl: 10000 });
      expect(getCached('a')).toBeUndefined();
    });

    it('drops in-flight tracking when reconfigured', () => {
      setInFlight('a', Promise.resolve(makeResponse('a')));
      configureCache({});
      expect(getInFlight('a')).toBeUndefined();
    });
  });
});
