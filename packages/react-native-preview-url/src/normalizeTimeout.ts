import { MAX_TIMEOUT, MIN_TIMEOUT } from './constants';
import { clamp } from './utils/clamp';

export const normalizeTimeout = (timeout: number): number => {
  if (!Number.isFinite(timeout)) {
    throw new TypeError('timeout must be a finite number');
  }
  return clamp(timeout, MIN_TIMEOUT, MAX_TIMEOUT);
};
