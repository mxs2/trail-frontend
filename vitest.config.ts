import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    include: ['__tests__/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
    coverage: {
      provider: 'v8',
      // Match the artifact path uploaded by CI (.github/workflows/ci.yml).
      reportsDirectory: './tests/reports/coverage',
      reporter: ['text', 'text-summary', 'lcov', 'html'],
      // Measure the layers the unit suite actually exercises. No thresholds —
      // coverage is reported as an artifact, not gated.
      include: ['services/**', 'store/**', 'components/landing/**'],
    },
  },
});
