import babelParser from '@babel/eslint-parser';
import globals from 'globals';
import eslintPluginReact from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: Object.fromEntries(
        Object.entries(globals.browser).map(([key, value]) => [
          key.trim(),
          value,
        ])
      ),
    },
    plugins: {
      react: eslintPluginReact,
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'no-console': 0,
    },
  },
  {
    ignores: ['dist'],
  },
];
