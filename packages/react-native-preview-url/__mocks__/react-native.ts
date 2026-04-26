import React from 'react';
import { vi } from 'vitest';

class AnimatedValue {
  value: number;
  constructor(value: number) {
    this.value = value;
  }
  interpolate(_config: { inputRange: number[]; outputRange: unknown[] }) {
    return this;
  }
  setValue(v: number) {
    this.value = v;
  }
}

const animation = { start: vi.fn() };

export const Animated = {
  View: ({ children, style, ...rest }: any) =>
    React.createElement('div', { style, ...rest }, children),
  Value: AnimatedValue,
  loop: (_anim: unknown) => animation,
  sequence: (_arr: unknown) => animation,
  timing: (_val: unknown, _config: unknown) => animation,
};

export const Image = ({ source, style, onError, accessibilityLabel }: any) =>
  React.createElement('img', {
    'src':
      typeof source === 'object' && source && 'uri' in source ? source.uri : '',
    'aria-label': accessibilityLabel,
    'onError': onError ? () => onError({ nativeEvent: {} }) : undefined,
    'data-testid': 'rn-image',
    style,
  });

export const Linking = {
  openURL: vi.fn().mockResolvedValue(undefined),
};

export const StyleSheet = {
  create: (styles: Record<string, unknown>) => styles,
  flatten: (styles: unknown) => styles,
  hairlineWidth: 1,
};

export const Text = ({ children, style, numberOfLines, ...rest }: any) =>
  React.createElement(
    'span',
    { style, 'data-number-of-lines': numberOfLines, ...rest },
    children
  );

export const TouchableOpacity = ({
  children,
  onPress,
  style,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
}: any) =>
  React.createElement(
    'button',
    {
      'onClick': onPress,
      style,
      'aria-label': accessibilityLabel,
      'data-accessibility-role': accessibilityRole,
      'data-accessibility-hint': accessibilityHint,
      'data-testid': 'rn-touchable',
    },
    children
  );

export const View = ({
  children,
  style,
  accessible,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  ...rest
}: any) =>
  React.createElement(
    'div',
    {
      style,
      'aria-label': accessibilityLabel,
      'role': accessibilityRole,
      'aria-busy': accessibilityState?.busy ? 'true' : undefined,
      'data-accessible': accessible ? 'true' : undefined,
      ...rest,
    },
    children
  );
