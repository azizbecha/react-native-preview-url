import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  configureCache,
  clearCache,
  invalidateUrl,
  getCached,
  setCached,
  getInFlight,
  setInFlight,
  clearInFlight,
} from '../src/cache';
import type { LinkPreviewResponse } from '../src/types';

const makeResponse = (url: string): LinkPreviewResponse => ({
  url,
  title: `Title for ${url}`,
});

describe('cache', () => {
  beforeEach(() => {
    configureCache({
      maxSize: 50,
      ttl: 5 * 60 * 1000,
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
  });

  describe('clearCache', () => {
    it('removes all entries', () => {
      setCached('a', makeResponse('a'));
      setCached('b', makeResponse('b'));
      clearCache();
      expect(getCached('a')).toBeUndefined();
      expect(getCached('b')).toBeUndefined();
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
