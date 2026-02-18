import { afterEach, vi } from 'vitest';

// Mock console.error to suppress error logs during tests
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock react-native with manual mock
vi.mock('react-native');

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Mock global fetch
global.fetch = vi.fn();
