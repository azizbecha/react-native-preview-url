import { isValidHttpUrl } from '../utils/isValidHttpUrl';

const DEFAULT_BASE_URL = 'https://azizbecha-link-preview-api.vercel.app';
export const DEFAULT_TIMEOUT = 3000;
export const MIN_TIMEOUT = 1000;
export const MAX_TIMEOUT = 30000;

let configuredBaseUrl = DEFAULT_BASE_URL;

export const setBaseUrl = (url: string): void => {
  if (typeof url !== 'string' || !isValidHttpUrl(url)) {
    throw new TypeError(
      `setBaseUrl: expected an http(s) URL, got ${JSON.stringify(url)}`
    );
  }
  configuredBaseUrl = url.replace(/\/+$/, '');
};

export const getBaseUrl = (): string => {
  return configuredBaseUrl;
};
