import { createMDX } from 'fumadocs-mdx/next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(__dirname, '..');

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Pin Turbopack's workspace root so multi-lockfile detection doesn't pick
  // up an unrelated package-lock.json elsewhere on disk.
  turbopack: {
    root: monorepoRoot,
  },
};

export default withMDX(config);
