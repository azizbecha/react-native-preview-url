import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: [
      '.cache',
      '.git',
      '.idea',
      'dist',
      'example',
      'lib',
      'node_modules',
    ],
    mockReset: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/*.config.ts',
        '**/*.d.ts',
        '**/dist/**',
        'example/',
        'lib/',
        'node_modules/',
        'tests/',
      ],
    },
  },
  resolve: {
    alias: {
      'react-native': new URL('./__mocks__/react-native.ts', import.meta.url).pathname,
    },
  },
});
