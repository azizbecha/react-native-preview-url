import { describe, expect, it } from 'vitest';
import { normalizeTimeout } from '../src/normalizeTimeout';

describe('normalizeTimeout', () => {
  it('clamps finite values to the supported range', () => {
    expect(normalizeTimeout(50)).toBe(1000);
    expect(normalizeTimeout(45_000)).toBe(30_000);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects non-finite timeout %s',
    (timeout) => {
      expect(() => normalizeTimeout(timeout)).toThrow(
        'timeout must be a finite number'
      );
    }
  );
});
