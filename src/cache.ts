import type { LinkPreviewResponse } from './types';

export interface CacheOptions {
  maxSize?: number;
  ttl?: number;
  enabled?: boolean;
}

interface CacheEntry {
  data: LinkPreviewResponse;
  expiresAt: number;
}

const DEFAULT_MAX_SIZE = 50;
const DEFAULT_TTL = 5 * 60 * 1000;

let maxSize = DEFAULT_MAX_SIZE;
let ttl = DEFAULT_TTL;
let enabled = true;

let entries = new Map<string, CacheEntry>();
let inFlight = new Map<string, Promise<LinkPreviewResponse>>();

export const configureCache = (options: CacheOptions): void => {
  if (options.maxSize !== undefined) maxSize = options.maxSize;
  if (options.ttl !== undefined) ttl = options.ttl;
  if (options.enabled !== undefined) enabled = options.enabled;
  entries = new Map();
  inFlight = new Map();
};

export const clearCache = (): void => {
  entries.clear();
};

export const invalidateUrl = (url: string): void => {
  entries.delete(url);
};

export const getCached = (url: string): LinkPreviewResponse | undefined => {
  if (!enabled) return undefined;
  const entry = entries.get(url);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    entries.delete(url);
    return undefined;
  }
  entries.delete(url);
  entries.set(url, entry);
  return entry.data;
};

export const setCached = (url: string, data: LinkPreviewResponse): void => {
  if (!enabled) return;
  if (entries.has(url)) entries.delete(url);
  entries.set(url, { data, expiresAt: Date.now() + ttl });
  while (entries.size > maxSize) {
    const oldest = entries.keys().next().value;
    if (oldest === undefined) break;
    entries.delete(oldest);
  }
};

export const getInFlight = (
  url: string
): Promise<LinkPreviewResponse> | undefined => {
  return inFlight.get(url);
};

export const setInFlight = (
  url: string,
  promise: Promise<LinkPreviewResponse>
): void => {
  inFlight.set(url, promise);
};

export const clearInFlight = (url: string): void => {
  inFlight.delete(url);
};
