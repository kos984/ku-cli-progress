/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    "prettier/prettier": [
      "error",
      {
        usePrettierrc: true,
        filePath: '.prettierrc.json'
      },
    ],
    complexity: [
      'error',
      {
        max: 20,
      },
    ],
    'max-classes-per-file': ['error', 1],
    'no-eval': 'error',
    'no-console': 'error',
    'no-var': 'error',
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/'],
      },
    ],
    'max-lines-per-function': [
      'error',
      { max: 25, skipBlankLines: true, skipComments: true },
    ],
    'max-statements': ['error', 20],
    'no-param-reassign': [
      2,
      {
        props: true,
      },
    ],
  },
  root: true,
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        'max-len': 'off',
        'max-lines-per-function': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
    {
      files: ['*.example.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
