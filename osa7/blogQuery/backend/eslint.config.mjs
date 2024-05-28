import globals from 'globals';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  { ignores: ['dist'] },
  {
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'no-console': 0,
      'no-unused-vars': 'warn',
    },
  },
];
