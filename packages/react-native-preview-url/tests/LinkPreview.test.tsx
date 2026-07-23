import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { Linking } from 'react-native';
import { LinkPreview } from '../src/LinkPreview';
import { setBaseUrl } from '../src/constants';
import { configureCache, clearCache, invalidateUrl } from '../src/cache';
import type { LinkPreviewResponse } from '../src/types';

const okFetch = (body: unknown) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  } as unknown as Response);

const errorFetch = (status: number, body: unknown) =>
  Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response);

const richResponse: LinkPreviewResponse = {
  url: 'https://example.com/page',
  title: 'Example Page Title',
  description: 'Example page description.',
  images: [{ url: 'https://example.com/image.png', width: 800, height: 600 }],
};

describe('LinkPreview component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setBaseUrl('https://azizbecha-link-preview-api.vercel.app');
    configureCache({
      maxSize: 50,
      ttl: 5 * 60 * 1000,
      errorTtl: 30 * 1000,
      enabled: true,
    });
    clearCache();
  });

  it('renders the loader while loading', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise(() => {}))
    );

    render(<LinkPreview url="https://example.com" />);

    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('renders a custom loaderComponent override while loading', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => new Promise(() => {}))
    );

    render(
      <LinkPreview
        url="https://example.com"
        loaderComponent={<span data-testid="custom-loader">loading</span>}
      />
    );

    expect(screen.getByTestId('custom-loader')).toBeTruthy();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('renders title, description, and domain after data resolves', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => okFetch(richResponse))
    );

    render(<LinkPreview url="https://example.com/page" />);

    await waitFor(() => screen.getByText('Example Page Title'));
    expect(screen.getByText('Example Page Title')).toBeTruthy();
    expect(screen.getByText('Example page description.')).toBeTruthy();
    expect(screen.getByText('example.com')).toBeTruthy();
  });

  it('uses a domain fallback for incomplete accessibility metadata', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(() => okFetch({ url: 'https://example.com/page' }))
    );

    render(<LinkPreview url="https://example.com/page" />);

    await waitFor(() => screen.getByTestId('rn-touchable'));
    expect(screen.getByTestId('rn-touchable').getAttribute('aria-label')).toBe(
      'Link preview for example.com'
    );
    expect(
      screen.getByTestId('rn-touchable').getAttribute('data-accessibility-hint')
    ).toBe('Opens example.com');
  });

  it('hides the URL line when showUrl is false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => okFetch(richResponse))
    );

    render(<LinkPreview url="https://example.com/page" showUrl={false} />);

    await waitFor(() => screen.getByText('Example Page Title'));
    expect(screen.queryByText('example.com')).toBeNull();
  });

  it('does not render the image when hideImage is true', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => okFetch(richResponse))
    );

    render(<LinkPreview url="https://example.com/page" hideImage />);

    await waitFor(() => screen.getByText('Example Page Title'));
    expect(screen.queryByTestId('rn-image')).toBeNull();
  });

  it('renders nothing when visible is false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => okFetch(richResponse))
    );

    const { container } = render(
      <LinkPreview url="https://example.com/page" visible={false} />
    );

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeNull());
    expect(container.querySelector('[data-testid="rn-touchable"]')).toBeNull();
  });

  it('calls onSuccess with the resolved data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => okFetch(richResponse))
    );
    const onSuccess = vi.fn();

    render(
      <LinkPreview url="https://example.com/page" onSuccess={onSuccess} />
    );

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(richResponse));
  });

  it('calls onError when the fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => errorFetch(500, { error: 'oops' }))
    );
    const onError = vi.fn();

    render(<LinkPreview url="https://example.com/page" onError={onError} />);

    await waitFor(() => expect(onError).toHaveBeenCalledWith('oops'));
  });

  it('calls onPress with the resolved data when pressed and skips Linking.openURL', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => okFetch(richResponse))
    );
    const onPress = vi.fn();
    const linkingMock = Linking.openURL as unknown as ReturnType<typeof vi.fn>;
    linkingMock.mockClear();

    render(<LinkPreview url="https://example.com/page" onPress={onPress} />);

    await waitFor(() => screen.getByTestId('rn-touchable'));
    fireEvent.click(screen.getByTestId('rn-touchable'));

    expect(onPress).toHaveBeenCalledWith(richResponse);
    expect(linkingMock).not.toHaveBeenCalled();
  });

  it('falls back to Linking.openURL when onPress is not provided', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => okFetch(richResponse))
    );
    const linkingMock = Linking.openURL as unknown as ReturnType<typeof vi.fn>;
    linkingMock.mockClear();

    render(<LinkPreview url="https://example.com/page" />);

    await waitFor(() => screen.getByTestId('rn-touchable'));
    fireEvent.click(screen.getByTestId('rn-touchable'));

    await waitFor(() =>
      expect(linkingMock).toHaveBeenCalledWith('https://example.com/page')
    );
  });

  it('reports a failed default navigation without rejecting', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => okFetch(richResponse))
    );
    const navigationError = new Error('Cannot open URL');
    const onPressError = vi.fn();
    const linkingMock = Linking.openURL as unknown as ReturnType<typeof vi.fn>;
    linkingMock.mockRejectedValueOnce(navigationError);

    render(
      <LinkPreview url="https://example.com/page" onPressError={onPressError} />
    );

    await waitFor(() => screen.getByTestId('rn-touchable'));
    fireEvent.click(screen.getByTestId('rn-touchable'));

    await waitFor(() =>
      expect(onPressError).toHaveBeenCalledWith(navigationError)
    );
  });

  it('falls back to fallbackImage source when the image errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => okFetch(richResponse))
    );

    render(
      <LinkPreview
        url="https://example.com/page"
        fallbackImage={{ uri: 'https://fallback.example.com/img.png' }}
      />
    );

    await waitFor(() => screen.getByTestId('rn-image'));
    const img = screen.getByTestId('rn-image') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('https://example.com/image.png');

    fireEvent.error(img);

    await waitFor(() => {
      const after = screen.getByTestId('rn-image') as HTMLImageElement;
      expect(after.getAttribute('src')).toBe(
        'https://fallback.example.com/img.png'
      );
    });
  });

  it('renders fallbackImage when the response has no images', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(() =>
          okFetch({ ...richResponse, images: undefined })
        )
    );

    render(
      <LinkPreview
        url="https://example.com/page"
        fallbackImage={{ uri: 'https://fallback.example.com/img.png' }}
      />
    );

    await waitFor(() => screen.getByTestId('rn-image'));
    expect(
      (screen.getByTestId('rn-image') as HTMLImageElement).getAttribute('src')
    ).toBe('https://fallback.example.com/img.png');
  });

  it('resets imageError state when the URL prop changes', async () => {
    const responseA: LinkPreviewResponse = {
      ...richResponse,
      url: 'https://a.example.com/page',
      images: [{ url: 'https://a.example.com/img.png' }],
    };
    const responseB: LinkPreviewResponse = {
      ...richResponse,
      url: 'https://b.example.com/page',
      images: [{ url: 'https://b.example.com/img.png' }],
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('a.example.com')) return okFetch(responseA);
        return okFetch(responseB);
      })
    );

    const { rerender } = render(
      <LinkPreview
        url="https://a.example.com/page"
        fallbackImage={{ uri: 'https://fallback.example.com/img.png' }}
      />
    );

    await waitFor(() => screen.getByTestId('rn-image'));
    fireEvent.error(screen.getByTestId('rn-image'));

    await waitFor(() => {
      const img = screen.getByTestId('rn-image') as HTMLImageElement;
      expect(img.getAttribute('src')).toBe(
        'https://fallback.example.com/img.png'
      );
    });

    rerender(
      <LinkPreview
        url="https://b.example.com/page"
        fallbackImage={{ uri: 'https://fallback.example.com/img.png' }}
      />
    );

    await waitFor(() => {
      const img = screen.getByTestId('rn-image') as HTMLImageElement;
      expect(img.getAttribute('src')).toBe('https://b.example.com/img.png');
    });
  });

  it('resets imageError state when a refreshed response selects a new image', async () => {
    const responseA: LinkPreviewResponse = {
      ...richResponse,
      images: [{ url: 'https://example.com/first.png' }],
    };
    const responseB: LinkPreviewResponse = {
      ...richResponse,
      images: [{ url: 'https://example.com/second.png' }],
    };
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => okFetch(responseA))
      .mockImplementationOnce(() => okFetch(responseB));
    vi.stubGlobal('fetch', fetchMock);

    const { rerender } = render(
      <LinkPreview
        url="https://example.com/page"
        fallbackImage={{ uri: 'https://fallback.example.com/img.png' }}
      />
    );

    await waitFor(() => screen.getByTestId('rn-image'));
    fireEvent.error(screen.getByTestId('rn-image'));

    await waitFor(() => {
      expect((screen.getByTestId('rn-image') as HTMLImageElement).src).toBe(
        'https://fallback.example.com/img.png'
      );
    });

    invalidateUrl('https://example.com/page');
    rerender(
      <LinkPreview
        url="https://example.com/page"
        timeout={4000}
        fallbackImage={{ uri: 'https://fallback.example.com/img.png' }}
      />
    );

    await waitFor(() => {
      expect((screen.getByTestId('rn-image') as HTMLImageElement).src).toBe(
        'https://example.com/second.png'
      );
    });
  });

  it('cleans up between tests', () => {
    cleanup();
    expect(true).toBe(true);
  });
});
