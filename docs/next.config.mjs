import { createMDX } from 'fumadocs-mdx/next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const monorepoRoot = path.resolve(__dirname, '..');

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Silence the "multiple lockfiles detected" warning by pinning the workspace
  // root explicitly. This repo's lockfile is the source of truth.
  turbopack: {
    root: monorepoRoot,
    resolveAlias: {
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
  // Compile RN + the library as if they were source — they ship ESM with JSX-ish
  // helpers that Next's default ignore-node_modules transform skips.
  transpilePackages: [
    'react-native',
    'react-native-web',
    'react-native-preview-url',
  ],
  // Production webpack build: alias the bare `react-native` specifier to web,
  // and point `react-native-preview-url` at the local workspace's compiled
  // entrypoint (yarn 3 doesn't symlink the root workspace package).
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
