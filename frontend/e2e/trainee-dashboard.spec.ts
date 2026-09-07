import { test, expect } from '@playwright/test';

test.describe('Trainee Dashboard — Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    // ✅ ورود به عنوان متربی: نقش → loginAs → /dashboard
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /داشبورد روزانه/ }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  });

  test('۱. بدون خطای 401 برای متربی', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('response', res => {
      if (res.status() === 401) consoleErrors.push(`401: ${res.url()}`);
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(3000);

    const has401Errors = consoleErrors.some(e => e.includes('401'));
    expect(has401Errors).toBe(false);
  });

  test('۲. داشبورد متربی نمایش داده می‌شود', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /داشبورد متربی/ })).toBeVisible();
    await expect(page.getByText(/خوش آمدید/)).toBeVisible();
  });

  test('۳. دکمه ضبط صدا غیرفعال است (تا انتخاب تکلیف)', async ({ page }) => {
    await page.goto('/dashboard');
    const recordBtn = page.locator('.record-btn');
    await expect(recordBtn.first()).toBeVisible();
    await expect(recordBtn.first()).toBeDisabled();
  });

  test('۴. دروس فعال نمایش داده می‌شوند', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /دروس فعال/ })).toBeVisible();
    const lessonBtns = page.locator('.lesson-btn');
    await expect(lessonBtns.first()).toBeVisible();
    expect(await lessonBtns.count()).toBeGreaterThan(0);
  });

  test('۵. منوی همبرگری موبایل باز می‌شود', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('button', { name: /منو/ }).click();
    await expect(page.locator('.nav-menu, .sidebar')).toBeVisible();
  });

  test('۶. شاخص‌های کلیدی (KPI) نمایش داده می‌شوند', async ({ page }) => {
    await page.goto('/dashboard');
    const kpiCards = page.locator('.kpi-card');
    await expect(kpiCards.first()).toBeVisible();
    const count = await kpiCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('۷. لینک‌های navbar فعال هستند', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('button', { name: /منو/ })).toBeVisible();
    await page.getByRole('button', { name: /منو/ }).click();
    await expect(page.getByRole('link', { name: /نشاط پلاس/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /داشبورد/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /پروفایل/ })).toBeVisible();
  });

  test('۸. بخش مراحل آموزش مجازی نمایش داده می‌شود', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText(/مراحل آموزش مجازی/).first()).toBeVisible();
  });
});
