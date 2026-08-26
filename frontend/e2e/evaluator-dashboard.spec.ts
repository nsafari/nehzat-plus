import { test, expect, } from '@playwright/test';

test.describe('Evaluator Dashboard Role Tests', () => {
  test('evaluator can login and see dashboard without 401 errors', async ({ page }) => {
    // Login as evaluator
    await page.goto('http://localhost:4200/auth/login');
    // Click evaluator role button
    await page.click('button:has-text("ارزیابی متربیان")');
    
    // Wait for dashboard navigation
    await page.waitForURL('**/dashboard');
    
    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate to evaluation section
    await page.click('text:امتحانات');
    await page.waitForLoadState('networkidle');
    
    // Expect no critical 401 errors
    const criticalErrors = consoleErrors.filter(e => 
      e.includes('401') || e.includes('Unauthorized')
    );
    expect(criticalErrors).toHaveLength(0);
    
    // Evaluator should see evaluation-related content
    await expect(page.locator('text:امتحانات')).toBeVisible();
  });

  test('evaluator dashboard shows appropriate content', async ({ page }) => {
    await page.goto('http://localhost:4200/auth/login');
    await page.click('button:has-text("ارزیابی متربیان")');
    await page.waitForURL('**/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for evaluator-specific content
    const evaluatorContent = page.locator('text:اردشةvaluerelated');
    const count = await evaluatorContent.count();
    
    // Should have some evaluator-related content
    expect(count).toBeGreaterThan(0);
  });
});