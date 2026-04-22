import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
  // Global ignores — must be the first block with no other properties.
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      // Plain CDN-based JSX, not part of the Next.js app.
      'design-reference/**',
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
