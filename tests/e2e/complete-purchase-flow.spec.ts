import { test, expect } from '@playwright/test';
import { loginAsStandardUser, addDynamicProductsToCart, completePurchaseFlow } from '../../src/utils/e2eWorkflows';

test.describe('End-to-End Shopping Tests', { tag: ['@e2e', '@regression'] }, () => {
  test('Complete Purchase Flow with Dynamic Products', async ({ page }) => {
    // Login as standard user
    const { inventoryPage } = await loginAsStandardUser(page);

    // Add random products to cart dynamically
    await addDynamicProductsToCart(inventoryPage, 2);

    // Complete the purchase flow with random customer data
    await completePurchaseFlow(inventoryPage);

    // Additional verification - back to products button
    await page.locator('[data-test="back-to-products"]').click();
    await expect(inventoryPage.productsHeader).toBeVisible();
  });

  test('Complete Purchase Flow with Specific Customer', async ({ page }) => {
    // Login as standard user
    const { inventoryPage } = await loginAsStandardUser(page);

    // Add random products to cart
    await addDynamicProductsToCart(inventoryPage, 3);

    // Use specific customer data
    const customerInfo = {
      firstName: 'Test',
      lastName: 'User',
      postalCode: '54321'
    };
    await completePurchaseFlow(inventoryPage, customerInfo);

    // Verify completion
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  });
});