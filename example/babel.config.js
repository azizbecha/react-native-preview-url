const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../packages/react-native-preview-url/package.json');

const root = path.resolve(
  __dirname,
  '..',
  'packages',
  'react-native-preview-url'
);

module.exports = function (api) {
  api.cache(true);

  return getConfig(
    {
      presets: ['babel-preset-expo'],
    },
    { root, pkg }
  );
};
