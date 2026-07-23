import { describe, expect, it } from 'vitest';
import { selectPreviewImage } from '../src/selectPreviewImage';

describe('selectPreviewImage', () => {
  it('selects the largest valid HTTPS image', () => {
    expect(
      selectPreviewImage([
        { url: 'http://example.com/insecure.png', width: 2000, height: 2000 },
        { url: 'https://example.com/small.png', width: 400, height: 300 },
        { url: 'https://example.com/large.png', width: 1600, height: 900 },
      ])
    ).toEqual({
      url: 'https://example.com/large.png',
      width: 1600,
      height: 900,
    });
  });

  it('uses the first valid HTTPS image when dimensions are unavailable', () => {
    expect(
      selectPreviewImage([
        { url: 'https://example.com/first.png' },
        { url: 'https://example.com/second.png' },
      ])
    ).toEqual({ url: 'https://example.com/first.png' });
  });
});
