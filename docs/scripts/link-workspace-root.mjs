#!/usr/bin/env node
/**
 * Yarn 3 doesn't symlink the workspace ROOT package into a sibling
 * workspace's node_modules. The library lives at the repo root and the docs
 * workspace imports it as `react-native-preview-url`, so we create the
 * symlink ourselves on every install. Idempotent — replaces an existing
 * symlink and is a no-op if the target already matches.
 */
import {
  existsSync,
  lstatSync,
  mkdirSync,
  symlinkSync,
  unlinkSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const docsDir = resolve(__dirname, '..');
const monorepoRoot = resolve(docsDir, '..');
const target = monorepoRoot;
const linkDir = join(docsDir, 'node_modules');
const linkPath = join(linkDir, 'react-native-preview-url');
const relativeTarget = relative(linkDir, target);

mkdirSync(linkDir, { recursive: true });

if (existsSync(linkPath) || lstatExists(linkPath)) {
  unlinkSync(linkPath);
}

symlinkSync(relativeTarget, linkPath, 'dir');
console.log(`linked ${linkPath} -> ${relativeTarget}`);

function lstatExists(p) {
  try {
    lstatSync(p);
    return true;
  } catch {
    return false;
  }
}
