import { describe, it, expect } from 'vitest';
import { clamp } from '../../src/utils/clamp';

describe('clamp', () => {
  describe('values within range', () => {
    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should return value at min boundary', () => {
      expect(clamp(0, 0, 10)).toBe(0);
    });

    it('should return value at max boundary', () => {
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('values below minimum', () => {
    it('should clamp to minimum', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should clamp negative to positive minimum', () => {
      expect(clamp(-100, 10, 20)).toBe(10);
    });
  });

  describe('values above maximum', () => {
    it('should clamp to maximum', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should clamp large value to maximum', () => {
      expect(clamp(1000, 0, 100)).toBe(100);
    });
  });

  describe('edge cases', () => {
    it('should handle zero range', () => {
      expect(clamp(5, 5, 5)).toBe(5);
    });

    it('should handle negative range', () => {
      expect(clamp(0, -10, -5)).toBe(-5);
    });

    it('should handle decimal values', () => {
      expect(clamp(2.5, 0, 5)).toBe(2.5);
      expect(clamp(10.5, 0, 5)).toBe(5);
    });
  });
});
