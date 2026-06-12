import { test, expect } from '@playwright/test';
import { seedAuth } from '../../setup/playwright.setup';

test.describe('Trails — browse & search', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page);
  });

  test('lists the student trails on the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('Em andamento', { exact: true })).toBeVisible();
    await expect(page.getByText('React Fundamentals').first()).toBeVisible();
  });

  test('opens a trail from the dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Abrir' }).first().click();
    await expect(page).toHaveURL(/\/trilha\//);
  });
});
