import { test, expect } from '@playwright/test';
import { signInViaUi } from '../../setup/playwright.setup';

test.describe('Trails — browse & search', () => {
  // Sign in through the real form so the store holds an in-memory user — this
  // avoids the persist-rehydration race that a cold `goto('/dashboard')` with a
  // pre-seeded session is subject to (the guard can briefly see no user and
  // redirect to /signin before hydration settles).
  test.beforeEach(async ({ page }) => {
    await signInViaUi(page);
  });

  test('lists the student trails on the dashboard', async ({ page }) => {
    await expect(page.getByText('Em andamento', { exact: true })).toBeVisible();
    await expect(page.getByText('React Fundamentals').first()).toBeVisible();
  });

  test('opens a trail from the dashboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir' }).first().click();
    await expect(page).toHaveURL(/\/trilha\//);
  });
});
