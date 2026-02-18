import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUrlPreview } from '../src/useUrlPreview';
import { setBaseUrl } from '../src/constants';

describe('useUrlPreview hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setBaseUrl('https://azizbecha-link-preview-api.vercel.app');
  });

  it('should be defined', () => {
    expect(useUrlPreview).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof useUrlPreview).toBe('function');
  });
});
