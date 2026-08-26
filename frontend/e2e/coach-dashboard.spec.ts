import { test, expect, } from '@playwright/test';

test.describe('Coach Dashboard Role Tests', () => {
  test('coach can login and see dashboard without 401 errors', async ({ page }) => {
    // Login as coach
    await page.goto('http://localhost:4200/auth/login');
    // Click coach role button
    await page.click('button:has-text("مربی مدیریت متربیان")');
    
    // Wait for dashboard navigation
    await page.waitForURL('**/dashboard');
    
    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to coaching section
    await page.click('text:مدیریت متربیان');
    await page.waitForLoadState('networkidle');
    
    // Expect no critical 401 errors
    const criticalErrors = consoleErrors.filter(e => 
      e.includes('401') || e.includes('Unauthorized')
    );
    expect(criticalErrors).toHaveLength(0);
    
    // Coach should see coaching-related content
    await expect(page.locator('text:مدیریت متربیان')).toBeVisible();
  });

  test('coach dashboard shows appropriate content', async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.click('button:has-text("مربی مدیریت متربیان")');
    await page.waitForURL('**/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for coach-specific content
    const coachContent = page.locator('text:مدیریت');
    const count = await coachContent.count();
    
    // Should have some coach-related content
    expect(count).toBeGreaterThan(0);
  });
});