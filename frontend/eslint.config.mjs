import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsEslintParser, // Use the TypeScript parser
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser, // Define global variables (like `window`, `document`, etc.)
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin, // TypeScript plugin
      react: reactPlugin, // React plugin
      'react-hooks': reactHooksPlugin, // React Hooks plugin
      tailwindcss: tailwindcssPlugin, //Tailwind CSS plugin
    },
    rules: {
      // Core ESLint rules
      quotes: ['error', 'single', { avoidEscape: true }],
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'always', children: 'never' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'off',
        { vars: 'all', args: 'none', ignoreRestSiblings: false },
      ],

      // Disable specific Next.js rules
      '@next/next/no-page-custom-font': 'off',

      // React-specific rules
      'react/no-unescaped-entities': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error', // Enforce hook rules
      'react-hooks/exhaustive-deps': 'warn', // Warn about missing dependencies in hooks

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'], // Apply these rules to TypeScript files
    languageOptions: {
      parser: tsEslintParser, // Use the TypeScript parser
    },
    rules: {
      // Additional TypeScript-specific rules can go here
    },
  },
  {
    files: ['**/*.{jsx,tsx}'], // Apply React-specific rules to JSX/TSX files
    rules: {
      // React-specific rules for JSX/TSX files
    },
  },
];
