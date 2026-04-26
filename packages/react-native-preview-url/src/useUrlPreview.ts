import { useState, useEffect } from 'react';
import {
  getBaseUrl,
  DEFAULT_TIMEOUT,
  MAX_TIMEOUT,
  MIN_TIMEOUT,
} from './constants';
import { clamp } from './utils/clamp';
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
} from './cache';

const TIMEOUT_ERROR_MESSAGE = 'Request timed out';
const TIMEOUT_BUFFER_MS = 500;

export const useUrlPreview = (
  url: string,
  timeout: number = DEFAULT_TIMEOUT
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LinkPreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    const cached = getCached(url);
    if (cached) {
      setError(null);
      setData(cached);
      setLoading(false);
      return;
    }

    const cachedError = getCachedError(url);
    if (cachedError) {
      setError(cachedError);
      setData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const finalTimeout = clamp(timeout, MIN_TIMEOUT, MAX_TIMEOUT);

    const ensureInFlight = (): Promise<LinkPreviewResponse> => {
      const existing = getInFlight(url);
      if (existing) return existing;

      const controller = new AbortController();
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, finalTimeout + TIMEOUT_BUFFER_MS);

      const fetchPromise = (async () => {
        try {
          const res = await fetch(
            `${getBaseUrl()}/get?url=${encodeURIComponent(url)}&timeout=${finalTimeout}`,
            { signal: controller.signal }
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

          return (await res.json()) as LinkPreviewResponse;
        } catch (err: unknown) {
          if (timedOut) {
            throw new Error(TIMEOUT_ERROR_MESSAGE);
          }
          throw err;
        } finally {
          clearTimeout(timer);
        }
      })();

      setInFlight(url, fetchPromise);
      fetchPromise
        .then((value) => {
          setCached(url, value);
        })
        .catch((err: unknown) => {
          if (err instanceof Error && err.message !== TIMEOUT_ERROR_MESSAGE) {
            setCachedError(url, err.message);
          }
        })
        .finally(() => {
          clearInFlight(url);
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
  }, [url, timeout]);

  return { loading, data, error };
};
