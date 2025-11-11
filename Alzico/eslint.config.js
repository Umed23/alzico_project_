const { defineConfig } = require('eslint/config');
const reactNative = require('@react-native/eslint-config/flat');

module.exports = defineConfig([
  ...reactNative,
  {
    ignores: ['dist/*'],
  },
]);
