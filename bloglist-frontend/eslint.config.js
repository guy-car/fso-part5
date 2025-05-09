import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import vitestGlobals from 'eslint-plugin-vitest-globals'

export default [
  {
    ignores: ['dist', 'node_modules', 'vite.config.js']
  },
  // Instead of using vitestGlobals.configs.recommended directly,
  // we'll integrate its rules in our main config
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      // Merge both globals sources
      globals: {
        ...globals.browser,
        ...vitestGlobals.environments.env.globals
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.2' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      // Add vitest-globals plugin here
      'vitest-globals': vitestGlobals
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      // Add vitest-globals recommended rules here if available
      // Sometimes plugin.configs structure might differ, so let's be cautious
      ...(vitestGlobals.configs?.recommended?.rules || {}),
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 0,
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-console': 0,
      'no-unused-vars': 0
    },
  },
]