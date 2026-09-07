import { test, expect } from '@playwright/test';

test.describe('Parent Dashboard Role Tests', () => {
  async function loginAsParent(page: import('@playwright/test').Page) {
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /پیگیری پیشرفت/ }).click();
    await page.waitForURL('**/parent', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  }

  test('parent can login and see dashboard without 401 errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('response', res => {
      if (res.status() === 401) consoleErrors.push(`401: ${res.url()}`);
    });
    await loginAsParent(page);
    await page.waitForTimeout(3000);
    const criticalErrors = consoleErrors.filter(e => e.includes('401') || e.includes('Unauthorized'));
    expect(criticalErrors).toHaveLength(0);
  });

  test('parent lands on /parent route', async ({ page }) => {
    await loginAsParent(page);
    await expect(page).toHaveURL(/\/parent/);
  });
});
