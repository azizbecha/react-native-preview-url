import { describe, it, expect } from 'vitest';
import { getDomainFromUrl } from '../../src/utils/getDomainFromUrl';

describe('getDomainFromUrl', () => {
  it('should extract domain from basic URL', () => {
    expect(getDomainFromUrl('https://example.com')).toBe('example.com');
  });

  it('should extract domain from URL with www', () => {
    expect(getDomainFromUrl('https://www.example.com')).toBe('www.example.com');
  });

  it('should extract domain from URL with path', () => {
    expect(getDomainFromUrl('https://example.com/path/to/page')).toBe(
      'example.com'
    );
  });

  it('should extract domain from URL with port', () => {
    expect(getDomainFromUrl('https://example.com:8080')).toBe('example.com');
  });

  it('should extract domain from URL with subdomain', () => {
    expect(getDomainFromUrl('https://sub.example.com')).toBe('sub.example.com');
  });

  it('should handle invalid URL gracefully', () => {
    expect(getDomainFromUrl('not-a-url')).toBe('');
  });

  it('should handle empty string', () => {
    expect(getDomainFromUrl('')).toBe('');
  });

  it('should extract domain from github.com URL', () => {
    expect(getDomainFromUrl('https://github.com/azizbecha')).toBe('github.com');
  });

  it('should ignore credentials when extracting the hostname', () => {
    expect(getDomainFromUrl('https://user:password@example.com/path')).toBe(
      'example.com'
    );
  });

  it('should support IPv6 hostnames', () => {
    expect(getDomainFromUrl('https://[2001:db8::1]:8080/path')).toBe(
      '[2001:db8::1]'
    );
  });
});
