import type { LinkPreviewResponse } from './types';
import { getBaseUrl } from './constants';

export interface CacheOptions {
  maxSize?: number;
  ttl?: number;
  errorTtl?: number;
  enabled?: boolean;
}

type CacheEntry =
  | { ok: true; data: LinkPreviewResponse; expiresAt: number }
  | { ok: false; error: string; expiresAt: number };

const DEFAULT_MAX_SIZE = 50;
const DEFAULT_TTL = 5 * 60 * 1000;
const DEFAULT_ERROR_TTL = 30 * 1000;

let maxSize = DEFAULT_MAX_SIZE;
let ttl = DEFAULT_TTL;
let errorTtl = DEFAULT_ERROR_TTL;
let enabled = true;

let entries = new Map<string, CacheEntry>();
let inFlight = new Map<string, Promise<LinkPreviewResponse>>();

const makeKey = (url: string): string => `${getBaseUrl()}::${url}`;

export const configureCache = (options: CacheOptions): void => {
  if (options.maxSize !== undefined) maxSize = options.maxSize;
  if (options.ttl !== undefined) ttl = options.ttl;
  if (options.errorTtl !== undefined) errorTtl = options.errorTtl;
  if (options.enabled !== undefined) enabled = options.enabled;
  entries = new Map();
  inFlight = new Map();
};

export const clearCache = (): void => {
  entries.clear();
};

export const invalidateUrl = (url: string): void => {
  entries.delete(makeKey(url));
};

const evictExcess = (): void => {
  while (entries.size > maxSize) {
    const oldest = entries.keys().next().value;
    if (oldest === undefined) break;
    entries.delete(oldest);
  }
};

const readEntry = (key: string): CacheEntry | undefined => {
  if (!enabled) return undefined;
  const entry = entries.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    entries.delete(key);
    return undefined;
  }
  entries.delete(key);
  entries.set(key, entry);
  return entry;
};

export const getCached = (url: string): LinkPreviewResponse | undefined => {
  const entry = readEntry(makeKey(url));
  return entry && entry.ok ? entry.data : undefined;
};

export const getCachedError = (url: string): string | undefined => {
  const entry = readEntry(makeKey(url));
  return entry && !entry.ok ? entry.error : undefined;
};

export const setCached = (url: string, data: LinkPreviewResponse): void => {
  if (!enabled) return;
  const key = makeKey(url);
  if (entries.has(key)) entries.delete(key);
  entries.set(key, { ok: true, data, expiresAt: Date.now() + ttl });
  evictExcess();
};

export const setCachedError = (url: string, error: string): void => {
  if (!enabled) return;
  const key = makeKey(url);
  if (entries.has(key)) entries.delete(key);
  entries.set(key, { ok: false, error, expiresAt: Date.now() + errorTtl });
  evictExcess();
};

export const getInFlight = (
  url: string
): Promise<LinkPreviewResponse> | undefined => {
  return inFlight.get(makeKey(url));
};

export const setInFlight = (
  url: string,
  promise: Promise<LinkPreviewResponse>
): void => {
  inFlight.set(makeKey(url), promise);
};

export const clearInFlight = (url: string): void => {
  inFlight.delete(makeKey(url));
};
