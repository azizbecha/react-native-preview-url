import { describe, it, expect } from 'vitest';
import { isValidHttpUrl } from '../../src/utils/isValidHttpUrl';

describe('isValidHttpUrl', () => {
  describe('valid HTTP URLs', () => {
    it('should validate https URL', () => {
      expect(isValidHttpUrl('https://example.com')).toBe(true);
    });

    it('should validate http URL', () => {
      expect(isValidHttpUrl('http://example.com')).toBe(true);
    });

    it('should validate URL with path', () => {
      expect(isValidHttpUrl('https://example.com/path/to/page')).toBe(true);
    });

    it('should validate URL with query string', () => {
      expect(isValidHttpUrl('https://example.com?param=value')).toBe(true);
    });

    it('should validate URL with port', () => {
      expect(isValidHttpUrl('https://example.com:8080')).toBe(true);
    });
  });

  describe('invalid URLs', () => {
    it('should reject FTP URL', () => {
      expect(isValidHttpUrl('ftp://example.com')).toBe(false);
    });

    it('should reject relative URL', () => {
      expect(isValidHttpUrl('/path/to/page')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidHttpUrl('')).toBe(false);
    });

    it('should reject malformed URL', () => {
      expect(isValidHttpUrl('not a url')).toBe(false);
    });

    it('should reject URL without protocol', () => {
      expect(isValidHttpUrl('example.com')).toBe(false);
    });

    it('should reject WebSocket URL', () => {
      expect(isValidHttpUrl('ws://example.com')).toBe(false);
    });
  });
});
