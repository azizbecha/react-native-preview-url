// Bun test setup - must be run before any tests
import { mock } from 'bun:test';

// Mock react-native before any tests load
mock.module('react-native', () => ({
  Animated: {
    View: ({ children }: any) => children,
    Value: () => {},
  },
  Image: () => null,
  Linking: {
    openURL: () => Promise.resolve(),
  },
  StyleSheet: {
    create: (styles: Record<string, any>) => styles,
    flatten: (styles: any) => styles,
    hairlineWidth: 1,
  },
  Text: ({ children }: any) => children,
  TouchableOpacity: ({ children }: any) => children,
  View: ({ children }: any) => children,
}));

// Mock console.error
const originalError = console.error;
console.error = () => {};

// Cleanup
process.on('exit', () => {
  console.error = originalError;
});
