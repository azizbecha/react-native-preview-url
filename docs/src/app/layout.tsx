import './global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';

export const metadata = {
  title: {
    default: 'react-native-preview-url',
    template: '%s — react-native-preview-url',
  },
  description:
    'Rich URL link previews for React Native. Documentation, API reference, and live demos.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
