import { test, expect } from '@playwright/test';

test.describe('Evaluator Dashboard Role Tests', () => {
  async function loginAsEvaluator(page: import('@playwright/test').Page) {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /ارزیابی متربیان/ }).click();
    await page.waitForURL(/\/evaluator/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  }

  test('evaluator can login and see dashboard without 401 errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('response', res => {
      if (res.status() === 401) consoleErrors.push(`401: ${res.url()}`);
    });
    await loginAsEvaluator(page);
    await page.waitForTimeout(3000);
    const criticalErrors = consoleErrors.filter(e => e.includes('401') || e.includes('Unauthorized'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('evaluator lands on /evaluator route', async ({ page }) => {
    await loginAsEvaluator(page);
    await expect(page).toHaveURL(/\/evaluator/);
  });
});
