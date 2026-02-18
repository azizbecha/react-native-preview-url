# Testing Guide

## ✅ Recommended: Use Vitest with npm

```bash
npm test              # Run all tests
npm test:watch      # Watch mode
npm test:ui         # Interactive UI
npm test:coverage   # Coverage report
```

**Status:** ✅ All 42 tests passing

---

## ❌ Not Recommended: `bun test`

**Bun's native test runner is incompatible with this project** because:

1. **React Native Flow Syntax Issue**: Bun cannot parse Flow type syntax (`typeof`) used in React Native
2. **No Vitest Config Support**: Bun doesn't use `vitest.config.ts` for module resolution
3. **Mock Configuration Mismatch**: Bun's module aliasing doesn't work the same way as Vitest

### Error when running `bun test`:
```
error: Unexpected typeof
  at /node_modules/react-native/index.js:28:8
  import typeof * as ReactNativePublicAPI from './index.js.flow';
```

### Solution:
Use `npm test` (which uses Vitest) instead of `bun test`.

---

## Test Configuration

- **Test Runner**: Vitest v1.6.1
- **Environment**: jsdom
- **Mocking**: Manual mocks in `__mocks__/react-native.ts`
- **Setup**: `vitest.setup.ts`
- **Config**: `vitest.config.ts`

## Files

- `tests/` - All test files
- `__mocks__/react-native.ts` - React Native mock module
- `vitest.config.ts` - Vitest configuration with alias for mocks
- `vitest.setup.ts` - Global test setup (mocks, cleanup)
- `bunfig.toml` - Bun configuration (documents incompatibility)
