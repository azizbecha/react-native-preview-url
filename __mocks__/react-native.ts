import { vi } from 'vitest';

export const Animated = {
  View: ({ children }: any) => children,
  Value: vi.fn(),
};

export const Image = ({ source, style, onError, accessibilityLabel }: any) =>
  null;

export const Linking = {
  openURL: vi.fn().mockResolvedValue(undefined),
};

export const StyleSheet = {
  create: (styles: Record<string, any>) => styles,
  flatten: (styles: any) => styles,
  hairlineWidth: 1,
};

export const Text = ({ children }: any) => children;

export const TouchableOpacity = ({ children, onPress }: any) => children;

export const View = ({ children }: any) => children;

export { useEffect, useState } from 'react';
