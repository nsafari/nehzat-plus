import { test, expect, } from '@playwright/test';

test.describe('Parent Dashboard Role Tests', () => {
  test('parent can login and see dashboard without 401 errors', async ({ page }) => {
    // Login as parent
    await page.goto('http://localhost:4200/auth/login');
    // Click parent role button - using text matching
    await page.click('button:has-text("والدین پیگیری پیشرفت")');
    
    // Wait for dashboard navigation
    await page.waitForURL('**/dashboard');
    
    // Should not have console errors about 401
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to check key sections
    await page.click('text:تکالیف');
    await page.waitForLoadState('networkidle');
    
    // Expect no critical 401 errors related to parent role
    const criticalErrors = consoleErrors.filter(e => 
      e.includes('401') || e.includes('Unauthorized')
    );
    expect(criticalErrors).toHaveLength(0);
    
    // Parent should see appropriate content
    await expect(page.locator('text:پیگیری پیشرفت')).toBeVisible();
  });

  test('parent dashboard shows Persian messages for restricted sections', async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.click('button:has-text("والدین پیگیری پیشرفت")');
    await page.waitForURL('**/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for role-restricted messages
    const restrictedMessages = page.locator('.role-empty-state');
    const count = await restrictedMessages.count();
    
    // Should display appropriate messages
    expect(count).toBeGreaterThan(0);
    
    // Verify the message content includes Persian text
    const firstMessage = await restrictedMessages.first().textContent();
    expect(firstMessage).toContain('مختص');
  });
});