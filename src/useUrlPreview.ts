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

    const controller = new AbortController();
    const finalTimeout = clamp(timeout, MIN_TIMEOUT, MAX_TIMEOUT);

    const fetchPreview = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${getBaseUrl()}/get?url=${encodeURIComponent(url)}&timeout=${finalTimeout}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          let errMsg = `Error ${res.status}`;
          try {
            const errJson = await res.json();
            errMsg = errJson.error || errMsg;
          } catch (_) {}
          throw new Error(errMsg);
        }

        const json = await res.json();
        setData(json);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error(err);
          setError(err.message || 'Unknown error');
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();

    return () => {
      controller.abort();
    };
  }, [url, timeout]);

  return { loading, data, error };
};
