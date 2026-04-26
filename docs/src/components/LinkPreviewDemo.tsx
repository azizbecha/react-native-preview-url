'use client';

import { LinkPreview } from 'react-native-preview-url';
import type { ComponentProps } from 'react';

type LinkPreviewProps = ComponentProps<typeof LinkPreview>;

export function LinkPreviewDemo({
  url = 'https://github.com',
  ...rest
}: LinkPreviewProps) {
  return (
    <div className="not-prose my-6 flex justify-center">
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm"
        style={{
          // The library uses StyleSheet from react-native; on web that resolves
          // to inline styles. The wrapper just provides a phone-ish frame so
          // the component has a sensible width to render into.
          padding: 12,
        }}
      >
        <LinkPreview url={url} {...rest} />
      </div>
    </div>
  );
}
