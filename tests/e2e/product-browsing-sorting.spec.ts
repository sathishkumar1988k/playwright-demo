import { test, expect } from '@playwright/test';
import {
  loginAsStandardUser,
  verifyProductElements,
  testProductSorting,
  viewProductDetailAndReturn
} from '../../src/utils/e2eWorkflows';

test.describe('End-to-End Shopping Tests', { tag: ['@e2e', '@regression'] }, () => {
  test('Product Browsing and Sorting with Dynamic Products', async ({ page }) => {
    // Login as standard user
    const { inventoryPage } = await loginAsStandardUser(page);

    // Verify all products are displayed with required elements (dynamic count)
    await verifyProductElements(inventoryPage);

    // Test different sorting options (random selection)
    await testProductSorting(inventoryPage);

    // Test product detail navigation using first available product
    await viewProductDetailAndReturn(
      inventoryPage,
      '[data-test="item-4-title-link"]',
      'Sauce Labs Backpack'
    );
  });
});