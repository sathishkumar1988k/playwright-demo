import { test, expect } from '@playwright/test';
import { CartPage } from '../../src/pages/CartPage';
import { loginAsStandardUser, dynamicShoppingCartWorkflow } from '../../src/utils/e2eWorkflows';

test.describe('End-to-End Shopping Tests', { tag: ['@e2e', '@regression'] }, () => {
  test('Dynamic Shopping Cart Management', async ({ page }) => {
    // Login as standard user
    const { inventoryPage } = await loginAsStandardUser(page);

    // Execute dynamic shopping cart management workflow
    await dynamicShoppingCartWorkflow(inventoryPage, 3);
  });
});