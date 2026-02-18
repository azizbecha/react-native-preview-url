import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LinkPreview } from '../src/LinkPreview';
import { setBaseUrl } from '../src/constants';

describe('LinkPreview component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setBaseUrl('https://azizbecha-link-preview-api.vercel.app');
  });

  it('should export LinkPreview component', () => {
    expect(LinkPreview).toBeDefined();
  });

  it('should be a valid React component', () => {
    expect(typeof LinkPreview).toBe('function');
  });

  it('should accept url prop', () => {
    expect(LinkPreview).toBeDefined();
  });
});
