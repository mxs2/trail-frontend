import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

/**
 * E2E config. Runs the app once and exercises it across Chromium, Firefox and WebKit.
 * In CI we build + start (production-like); locally we reuse a running dev server.
 */
export default defineConfig({
  testDir: './tests/e2e',
  // setup/teardown helpers live alongside but never match the *.spec convention.
  testMatch: '**/*.spec.ts',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [['list'], ['html', { outputFolder: 'tests/reports/playwright', open: 'never' }]],

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: process.env.CI ? 'npm run build && npm run start' : 'npm run dev',
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
