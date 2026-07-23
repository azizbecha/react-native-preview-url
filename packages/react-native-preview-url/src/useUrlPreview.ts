import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBaseUrl, DEFAULT_TIMEOUT } from './constants';
import type { LinkPreviewResponse } from './types';
import { isValidHttpUrl } from './utils/isValidHttpUrl';
import {
  getCached,
  getCachedError,
  setCached,
  setCachedError,
  getInFlight,
  setInFlight,
  clearInFlight,
  invalidateUrl,
} from './cache';
import { validateLinkPreviewResponse } from './validateLinkPreviewResponse';
import { normalizeTimeout } from './normalizeTimeout';

const TIMEOUT_ERROR_MESSAGE = 'Request timed out';
const TIMEOUT_BUFFER_MS = 500;

export interface UseUrlPreviewOptions {
  timeout?: number;
  enabled?: boolean;
  headers?: HeadersInit;
  fetcher?: typeof fetch;
  signal?: AbortSignal;
  retry?: number;
}

export interface UseUrlPreviewResult {
  loading: boolean;
  data: LinkPreviewResponse | null;
  error: string | null;
  refresh: () => void;
}

type UseUrlPreviewArgument = number | UseUrlPreviewOptions;

const getOptions = (argument: UseUrlPreviewArgument): UseUrlPreviewOptions => {
  if (typeof argument === 'number') return { timeout: argument };
  if (!argument || typeof argument !== 'object' || Array.isArray(argument)) {
    throw new TypeError(
      'useUrlPreview expects a timeout number or options object'
    );
  }
  return argument;
};

const getRetryCount = (retry: number | undefined): number => {
  if (retry === undefined) return 0;
  if (!Number.isSafeInteger(retry) || retry < 0) {
    throw new RangeError('retry must be a non-negative safe integer');
  }
  return retry;
};

const getRequestHeaders = (
  requestHeaders: HeadersInit | undefined
): Record<string, string> => {
  const headers = new Headers(requestHeaders);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  const result: Record<string, string> = {};
  headers.forEach((value, name) => {
    result[name] = value;
  });
  return result;
};

const getHeadersKey = (headers: HeadersInit | undefined): string =>
  JSON.stringify(
    Object.entries(getRequestHeaders(headers)).sort(([left], [right]) =>
      left.localeCompare(right)
    )
  );

const getRequestHeadersFromKey = (key: string): Record<string, string> =>
  Object.fromEntries(JSON.parse(key) as Array<[string, string]>);

export const useUrlPreview = (
  url: string,
  argument: UseUrlPreviewArgument = DEFAULT_TIMEOUT
): UseUrlPreviewResult => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LinkPreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const options = getOptions(argument);
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const requestEnabled = options.enabled ?? true;
  if (typeof requestEnabled !== 'boolean') {
    throw new TypeError('enabled must be a boolean');
  }
  const retryCount = getRetryCount(options.retry);
  const requestFetcher = options.fetcher ?? fetch;
  const hasCustomFetcher = options.fetcher !== undefined;
  const hasCustomHeaders = options.headers !== undefined;
  const requestSignal = options.signal;
  const headersKey = getHeadersKey(options.headers);
  const requestHeaders = useMemo(
    () => getRequestHeadersFromKey(headersKey),
    [headersKey]
  );
  const canShareRequest =
    !hasCustomFetcher && !hasCustomHeaders && requestSignal === undefined;
  const refresh = useCallback(() => {
    invalidateUrl(url, getBaseUrl());
    setRefreshVersion((version) => version + 1);
  }, [url]);

  useEffect(() => {
    const baseUrl = getBaseUrl();

    if (!requestEnabled) {
      setError(null);
      setData(null);
      setLoading(false);
      return;
    }

    if (!url) {
      setError('URL is required');
      setData(null);
      setLoading(false);
      return;
    }

    if (!isValidHttpUrl(url)) {
      setError('Invalid URL format');
      setData(null);
      setLoading(false);
      return;
    }

    if (canShareRequest) {
      const cached = getCached(url, baseUrl);
      if (cached) {
        setError(null);
        setData(cached);
        setLoading(false);
        return;
      }

      const cachedError = getCachedError(url, baseUrl);
      if (cachedError) {
        setError(cachedError);
        setData(null);
        setLoading(false);
        return;
      }
    }

    let cancelled = false;
    const finalTimeout = normalizeTimeout(timeout);

    const ensureInFlight = (): Promise<LinkPreviewResponse> => {
      if (canShareRequest) {
        const existing = getInFlight(url, baseUrl);
        if (existing) return existing;
      }

      const controller = new AbortController();
      let timedOut = false;
      const abortFromCaller = () => controller.abort();
      requestSignal?.addEventListener('abort', abortFromCaller, { once: true });
      if (requestSignal?.aborted) controller.abort();
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, finalTimeout + TIMEOUT_BUFFER_MS);

      const fetchPromise = (async () => {
        try {
          for (let attempt = 0; attempt <= retryCount; attempt += 1) {
            try {
              const res = await requestFetcher(
                `${baseUrl}/get?url=${encodeURIComponent(url)}&timeout=${finalTimeout}`,
                {
                  headers: requestHeaders,
                  signal: controller.signal,
                }
              );

              if (!res.ok) {
                let errMsg = `Error ${res.status}`;
                try {
                  const errJson = (await res.json()) as { error?: string };
                  if (errJson?.error) errMsg = errJson.error;
                } catch (_) {
                  // body wasn't JSON; keep status-based message
                }
                throw new Error(errMsg);
              }

              return validateLinkPreviewResponse(await res.json());
            } catch (err: unknown) {
              if (timedOut || attempt === retryCount) throw err;
            }
          }
          throw new Error('Request failed');
        } catch (err: unknown) {
          if (timedOut) {
            throw new Error(TIMEOUT_ERROR_MESSAGE);
          }
          throw err;
        } finally {
          clearTimeout(timer);
          requestSignal?.removeEventListener('abort', abortFromCaller);
        }
      })();

      if (canShareRequest) setInFlight(url, fetchPromise, baseUrl);
      fetchPromise
        .then((value) => {
          if (canShareRequest) setCached(url, value, baseUrl);
        })
        .catch((err: unknown) => {
          if (
            canShareRequest &&
            err instanceof Error &&
            err.message !== TIMEOUT_ERROR_MESSAGE
          ) {
            setCachedError(url, err.message, baseUrl);
          }
        })
        .finally(() => {
          if (canShareRequest) clearInFlight(url, baseUrl);
        });

      return fetchPromise;
    };

    setLoading(true);
    setError(null);

    ensureInFlight()
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg =
          err instanceof Error
            ? err.message || 'Unknown error'
            : 'Unknown error';
        setError(msg);
        setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    url,
    timeout,
    requestEnabled,
    retryCount,
    requestFetcher,
    requestHeaders,
    requestSignal,
    canShareRequest,
    refreshVersion,
  ]);

  return { loading, data, error, refresh };
};
