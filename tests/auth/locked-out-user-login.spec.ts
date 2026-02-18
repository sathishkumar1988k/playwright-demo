// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', { tag: ['@auth', '@regression'] }, () => {
  test('Locked Out User Login', async ({ page }) => {
    // Get credentials from environment variables
    const username = process.env.LOCKED_OUT_USERNAME || 'locked_out_user';
    const password = process.env.PASSWORD || 'secret_sauce';
    const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com/';
    
    // Navigate to SauceDemo and attempt login with locked_out_user credentials
    await page.goto(baseUrl);
    await page.locator('[data-test="username"]').fill(username);
    await page.locator('[data-test="password"]').fill(password);
    await page.locator('[data-test="login-button"]').click();

    // Verify locked out error message
    await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
  });
});