import { test, expect } from '@playwright/test';

test.describe('Coach Dashboard Role Tests', () => {
  async function loginAsCoach(page: import('@playwright/test').Page) {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /مدیریت متربیان/ }).click();
    await page.waitForURL('**/coach', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  }

  test('coach can login and see dashboard without 401 errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('response', res => {
      if (res.status() === 401) consoleErrors.push(`401: ${res.url()}`);
    });
    await loginAsCoach(page);
    await page.waitForTimeout(3000);
    const criticalErrors = consoleErrors.filter(e => e.includes('401') || e.includes('Unauthorized'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('coach lands on /coach route', async ({ page }) => {
    await loginAsCoach(page);
    await expect(page).toHaveURL(/\/coach/);
  });
});
