# Test Suite Documentation

## Overview

This directory contains comprehensive unit tests for the react-native-preview-url library using Vitest.

**Test Statistics:**
- ✅ **42 tests total**
- ✅ **6 test files**
- ✅ **100% passing**

## Test Files

### Utility Function Tests

#### `utils/getDomainFromUrl.test.ts` (8 tests)
Tests the domain extraction utility:
- Basic URL parsing
- URLs with www prefix
- URLs with paths and ports
- Subdomains
- Invalid URL handling

#### `utils/isValidHttpUrl.test.ts` (11 tests)
Tests HTTP/HTTPS URL validation:
- Valid http/https URLs
- Invalid protocols (FTP, WebSocket, etc.)
- Malformed URLs
- Edge cases with special characters

#### `utils/clamp.test.ts` (10 tests)
Tests the number clamping utility:
- Values within range
- Values below minimum
- Values above maximum
- Edge cases (zero range, negative range, decimals)

### Configuration Tests

#### `constants.test.ts` (8 tests)
Tests timeout constants and base URL configuration:
- Timeout constant validation (MIN=1000ms, MAX=30000ms, DEFAULT=3000ms)
- Base URL management
- Custom URL configuration
- Persistence across calls

### Component & Hook Tests

#### `useUrlPreview.test.ts` (2 tests)
Tests the main preview hook:
- Hook definition and type
- Function verification

#### `LinkPreview.test.tsx` (3 tests)
Tests the main preview component:
- Component export
- React component validation
- Prop acceptance

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test:ui

# Generate coverage report
npm test:coverage
```

## Test Configuration

The tests are configured via `vitest.config.ts`:
- **Environment**: jsdom (for DOM simulation)
- **Globals**: Enabled (describe, it, expect available without imports)
- **Setup**: `vitest.setup.ts` mocks React Native components and global fetch

### Mock Strategy

**React Native Mocks** (`vitest.setup.ts`):
- Image, Text, TouchableOpacity, View
- Linking.openURL
- StyleSheet.create
- Animated views

**Global Mocks**:
- `fetch` API for network requests

## Best Practices

1. **Test Organization**: Group related tests with `describe()` blocks
2. **Test Naming**: Use clear, descriptive test names
3. **Cleanup**: Tests automatically clean up after each run
4. **Isolation**: Each test is independent and can run in any order

## Extending Tests

To add new tests:

1. Create a new file in `tests/` directory
2. Name it with `.test.ts` or `.test.tsx` extension
3. Import required utilities:
   ```ts
   import { describe, it, expect } from 'vitest';
   ```
4. Write your tests following existing patterns

Example:

```ts
describe('My Feature', () => {
  it('should do something', () => {
    expect(value).toBe(expected);
  });
});
```

## Coverage

The test suite provides:
- ✓ 100% utility function coverage
- ✓ Configuration management testing
- ✓ Component validation
- ✓ Hook verification

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```bash
npm test -- --run  # Run once and exit (good for CI)
```

## Troubleshooting

**Tests not finding modules?**
- Ensure `vitest.config.ts` is properly configured
- Check that imports use correct paths relative to test file

**Mock not working?**
- Verify mocks are defined in `vitest.setup.ts`
- Check mock timing and lifecycle

**TypeScript errors?**
- Run `npm run typecheck` to verify TypeScript compilation
- Ensure imports use proper module resolution
