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
  setCached,
  getInFlight,
  setInFlight,
  clearInFlight,
} from './cache';

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
      return;
    }

    if (!isValidHttpUrl(url)) {
      setError('Invalid URL format');
      setData(null);
      return;
    }

    const cached = getCached(url);
    if (cached) {
      setError(null);
      setData(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const finalTimeout = clamp(timeout, MIN_TIMEOUT, MAX_TIMEOUT);

    const runFetch = async (): Promise<LinkPreviewResponse> => {
      const res = await fetch(
        `${getBaseUrl()}/get?url=${encodeURIComponent(url)}&timeout=${finalTimeout}`
      );

      if (!res.ok) {
        let errMsg = `Error ${res.status}`;
        try {
          const errJson = await res.json();
          errMsg = errJson.error || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
      }

      return (await res.json()) as LinkPreviewResponse;
    };

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        let promise = getInFlight(url);
        if (!promise) {
          promise = runFetch();
          setInFlight(url, promise);
          promise
            .then((value) => {
              setCached(url, value);
            })
            .catch(() => {})
            .finally(() => {
              clearInFlight(url);
            });
        }

        const json = await promise;
        if (cancelled) return;
        setData(json);
      } catch (err: unknown) {
        if (cancelled) return;
        if (err instanceof Error) {
          console.error(err);
          setError(err.message || 'Unknown error');
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [url, timeout]);

  return { loading, data, error };
};
