// spec: specs/saucedemo-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { MenuPage } from '../../src/pages/MenuPage';

test.describe('Authentication Tests', { tag: ['@auth', '@regression'] }, () => {
  test('Valid User Login and Logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const menuPage = new MenuPage(page);

    // Get credentials from environment variables
    const username = process.env.STANDARD_USERNAME || 'standard_user';
    const password = process.env.PASSWORD || 'secret_sauce';
    const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com/';

    // Navigate to SauceDemo and login with standard_user credentials from .env
    await loginPage.navigate();
    await loginPage.login(username, password);

    // Verify successful login redirect
    await expect(inventoryPage.productsHeader).toBeVisible();
    await expect(page).toHaveURL(`${baseUrl}inventory.html`);
    await expect(page).toHaveTitle('Swag Labs');
    
    // Verify user is on inventory page with products visible
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // Perform logout
    await inventoryPage.openMenu();
    await menuPage.logout();

    // Verify successful logout redirect to login page
    await expect(loginPage.usernameField).toBeVisible();
    await expect(loginPage.passwordField).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL(baseUrl);
    
    // Verify user cannot access protected pages after logout
    await page.goto(`${baseUrl}inventory.html`);
    await expect(page).toHaveURL(baseUrl);
    await expect(page.getByText('Epic sadface')).toBeVisible();
  });
});