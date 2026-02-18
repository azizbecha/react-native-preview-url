import { describe, it, expect, afterEach } from 'vitest';
import {
  DEFAULT_TIMEOUT,
  MIN_TIMEOUT,
  MAX_TIMEOUT,
  setBaseUrl,
  getBaseUrl,
} from '../src/constants';

describe('constants and configuration', () => {
  const originalBaseUrl = getBaseUrl();

  afterEach(() => {
    setBaseUrl(originalBaseUrl);
  });

  describe('timeout constants', () => {
    it('should have valid MIN_TIMEOUT', () => {
      expect(MIN_TIMEOUT).toBe(1000);
    });

    it('should have valid MAX_TIMEOUT', () => {
      expect(MAX_TIMEOUT).toBe(30000);
    });

    it('should have valid DEFAULT_TIMEOUT', () => {
      expect(DEFAULT_TIMEOUT).toBe(3000);
    });

    it('DEFAULT_TIMEOUT should be between MIN and MAX', () => {
      expect(DEFAULT_TIMEOUT).toBeGreaterThanOrEqual(MIN_TIMEOUT);
      expect(DEFAULT_TIMEOUT).toBeLessThanOrEqual(MAX_TIMEOUT);
    });
  });

  describe('base URL management', () => {
    it('should have default base URL', () => {
      const baseUrl = getBaseUrl();
      expect(baseUrl).toBeDefined();
      expect(baseUrl.length).toBeGreaterThan(0);
    });

    it('should allow setting custom base URL', () => {
      const customUrl = 'https://custom-api.com';
      setBaseUrl(customUrl);
      expect(getBaseUrl()).toBe(customUrl);
    });

    it('should use HTTPS by default', () => {
      const baseUrl = getBaseUrl();
      expect(baseUrl).toMatch(/^https:\/\//);
    });

    it('should persist custom base URL across calls', () => {
      const customUrl = 'https://my-api.example.com';
      setBaseUrl(customUrl);
      expect(getBaseUrl()).toBe(customUrl);
      expect(getBaseUrl()).toBe(customUrl); // Call again to verify persistence
    });
  });
});
