import { createMDX } from 'fumadocs-mdx/next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(__dirname, '..');

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Compile RN sources for the web. Without this, Next's default
  // ignore-node_modules transform skips RN's flow/JSX-ish helpers and breaks.
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-preview-url',
  ],
  turbopack: {
    // Pin workspace root so multi-lockfile detection doesn't latch onto
    // an unrelated package-lock.json elsewhere on disk.
    root: monorepoRoot,
    resolveAlias: {
      // Render the React Native lib via react-native-web in the browser.
      'react-native': 'react-native-web',
    },
    resolveExtensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
    ],
  },
  webpack: (cfg) => {
    cfg.resolve.alias = {
      ...cfg.resolve.alias,
      'react-native$': 'react-native-web',
    };
    cfg.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      ...cfg.resolve.extensions,
    ];
    return cfg;
  },
};

export default withMDX(config);
