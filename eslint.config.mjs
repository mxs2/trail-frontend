import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';

const eslintConfig = [
  // Global ignores — must be the first block with no other properties.
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'tests/reports/**',
      // Plain CDN-based JSX, not part of the Next.js app.
      'design-reference/**',
    ],
  },
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Honour the _param convention for intentionally unused function arguments.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // ── Jest unit + integration suites ──────────────────────────────────────────
  {
    files: ['tests/unit/**/*.{ts,tsx}', 'tests/integration/**/*.{ts,tsx}'],
    ...jest.configs['flat/recommended'],
  },
  {
    files: ['tests/unit/**/*.{ts,tsx}', 'tests/integration/**/*.{ts,tsx}'],
    ...jestDom.configs['flat/recommended'],
  },
  {
    files: ['tests/unit/**/*.{ts,tsx}', 'tests/integration/**/*.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      // Enforce the enterprise testing conventions requested in the test plan.
      'testing-library/no-node-access': 'error',
      'testing-library/prefer-user-event': 'error',
      'jest/no-disabled-tests': 'warn',
      'jest/consistent-test-it': ['error', { fn: 'it' }],
    },
  },

  // ── Shared test helpers (no test bodies, so skip jest's test-only rules) ─────
  {
    files: [
      'tests/utils/**/*.{ts,tsx}',
      'tests/mocks/**/*.{ts,tsx}',
      'tests/fixtures/**/*.{ts,tsx}',
    ],
    ...jest.configs['flat/recommended'],
    rules: {
      'jest/no-export': 'off',
      'jest/require-top-level-describe': 'off',
    },
  },
];

export default eslintConfig;
