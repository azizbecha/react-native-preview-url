import { describe, expect, it } from 'vitest';
import { validateLinkPreviewResponse } from '../src/validateLinkPreviewResponse';

describe('validateLinkPreviewResponse', () => {
  it('accepts a valid response', () => {
    expect(
      validateLinkPreviewResponse({
        url: 'https://example.com',
        title: 'Example',
        images: [{ url: 'https://example.com/image.png', width: 800 }],
        favicons: ['https://example.com/favicon.ico'],
      })
    ).toEqual({
      url: 'https://example.com',
      title: 'Example',
      description: undefined,
      images: [
        { url: 'https://example.com/image.png', width: 800, height: undefined },
      ],
      favicons: ['https://example.com/favicon.ico'],
      mediaType: undefined,
      contentType: undefined,
      siteName: undefined,
    });
  });

  it('rejects a response without a safe canonical URL', () => {
    expect(() => validateLinkPreviewResponse({ url: 'not-a-url' })).toThrow(
      'Invalid link preview response: "url" must be a valid http(s) URL'
    );
  });

  it('rejects malformed image metadata', () => {
    expect(() =>
      validateLinkPreviewResponse({
        url: 'https://example.com',
        images: [{ url: 'https://example.com/image.png', width: 0 }],
      })
    ).toThrow(
      'Invalid link preview response: "images[0].width" must be a positive finite number'
    );
  });
});
