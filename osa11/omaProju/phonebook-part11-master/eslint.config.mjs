import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module', // Use ECMAScript modules for JS files
      ecmaVersion: 2020,   // Set ECMAScript version to 2020 for modern features
      globals: globals.browser,
    },
  },
  {
    ignores: ['dist'], // Ignore the dist folder
  },
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
