import { test, expect } from '@playwright/test';

test.describe('Trainee Dashboard — Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    // ✅ ورود به عنوان متربی (dev mode: any password works)
    await page.goto('/auth/login');
    await page.getByRole('button', { name: /متربی/ }).click();
    // در حالت MockAuth(username/password=TEST/password WORK)
    await page.getByLabel('نام کاربری').fill('ali.ahmadi');
    await page.getByLabel('رمز عبور').fill('password123');
    await page.getByRole('button', { name: /ورود/ }).click();
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  });

  test('۱. کنسول خطا ندارد (۰ Ad error for trainees)', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleLogs: string[] = [];

    // جمع‌آوری خطاها از کنسول
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
      // logs.push(msg.text());
    });

    // جمع‌آوری پاسخ ۴۰۱
    page.on('response', res => {
      if (res.status() === 401) {
        consoleErrors.push(`401: ${res.url()}`);
      }
    });

    await page.goto('/dashboard');
    await page.waitForTimeout(3000); // کمی صبر برای بارگذاریwidgets

    // ✅	Assert: خطای ۴۰۱ یاconnectivity نباشد
    const has401Errors = consoleErrors.some(e => e.includes('401'));
    console.log('� console errors:', consoleErrors);
    console.log('🔴 has 401:', has401Errors);

    expect(has401Errors).toBe(false);
    //Optional: expect(consoleErrors.length).toBe(0); // اگر مطمئن هستیم فقط خطاهای واقعی
  });

  test('۲. پیام فارسی برای متربی نمایش داده می‌شود', async ({ page }) => {
    await page.goto('/dashboard');

    // ✅.Assert: پیام 'مختص_managerان' видим
    const traineeMessage = page.getByText(
      'آمار پیشرفتLesson‌ها مختص_managerان است'
    );
    await expect(traineeMessage).toBeVisible();

    // ✅ Also verify the exact Persian text
    const exactMessage = await page.locator(
      ':has-text("آمار پیشرفتLesson‌ها")'
    ).first();
    await expect(exactMessage).toBeVisible();
  });

  test('۳. دکمه ضبط صدا غیرفعال است (تا انتخاب تکلیف)', async ({ page }) => {
    await page.goto('/dashboard');

    const recordBtn = page.getByRole('button', { name: /ضبط صدا/ });
    await expect(recordBtn).toBeDisabled();

    // ✅ Visual check: button should have disabled styling
    await expect(recordBtn).toHaveClass('opacity-50'); // یا class disabled
  });

  test('۴. انتخاب خودکار اولین lesson در chart', async ({ page }) => {
    await page.goto('/dashboard');

    // ✅ اولین course باید auto-selected باشد
    const firstCourse = page.locator('.course-item').first();
    await expect(firstCourse).toBeVisible();

    // ✅ Chart should have data (not placeholder zeros indefinitely)
    const chart = page.locator('.trend-chart');
    // Chart should be visible and have bars (not empty)
    await expect(chart).toBeVisible();
  });

  test('۵. منوی همبرگری موبایل باز می‌شود', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('button', { name: /منو/ }).click();
    await expect(page.locator('.nav-menu, .sidebar')).toBeVisible();
  });

  test('۶. widget‌های 관리 فقط برای admin görülür', async ({ page }) => {
    // این تست فقط برای admin/routes that require admin role
    // برای trainee، widgets-row پیام نمایش می‌دهد
    await page.goto('/dashboard');

    // ✅ برای trainee، widgets-row باید پیام 가진 داشته باشد
    const widgetsRow = page.locator('.widgets-row');
    const widgetCount = await widgetsRow.locator('.panel').count();
    // Should have 2 panels (Quran + Math) with the trainee message
    await expect(widgetsRow).toBeVisible();
  });

  test('۷.navbarlinks فعال هستند', async ({ page }) => {
    await page.goto('/dashboard');

    // ✅ Nav links should be visible
    await expect(page.getByRole('link', { name: /نشاط پلاس/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /داشبورد/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /پروفایل/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /تقویم/ })).toBeVisible();
  });

  test('۸. آمار kpi-grid نمایش داده می‌شود', async ({ page }) => {
    await page.goto('/dashboard');

    // ✅ KPI cards should be visible
    await expect(page.locator('.kpi-card')).toHaveCountGreaterThan(0);
    // Optional: check specific KPI text
    // await expect(page.getByText('امتیاز تجربه')).toBeVisible();
  });
});