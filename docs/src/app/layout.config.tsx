import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-semibold tracking-tight">
          react-native-preview-url
        </span>
      ),
    },
    links: [
      {
        text: 'Docs',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'GitHub',
        url: 'https://github.com/azizbecha/react-native-preview-url',
        external: true,
      },
      {
        text: 'npm',
        url: 'https://www.npmjs.com/package/react-native-preview-url',
        external: true,
      },
    ],
  };
}
