const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
});

config.resolver.unstable_enablePackageExports = true;

// react-native-monorepo-config@0.1.x adds the monorepo root to its packages list
// when the root package.json has a `name`, then blocks `<root>/node_modules/<peer>`
// for every peer dep. That blocks the *canonical* react/react-native installs at
// the workspace root, breaking `react/jsx-runtime` resolution. Replace blockList
// with one that only blocks duplicates nested inside the example workspace.
config.resolver.blockList = new RegExp(
  '^' +
    escapeRegExp(path.join(__dirname, 'node_modules')) +
    '\\/(react|react-native|@types\\/react)\\/.*$'
);

module.exports = config;
