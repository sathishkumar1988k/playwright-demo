import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { 
  Customer, 
  getRandomCustomer, 
  getDefaultCustomer, 
  getRandomProductsFromPage, 
  getFirstProductsFromPage,
  getProductCountFromPage,
  getRandomSortOptions 
} from './productSelector';

/**
 * E2E workflow utility functions for common test scenarios with dynamic product handling
 */

// Common login workflow
export async function loginAsStandardUser(page: Page): Promise<{
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
}> {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  
  const username = process.env.STANDARD_USERNAME || 'standard_user';
  const password = process.env.PASSWORD || 'secret_sauce';
  
  await loginPage.navigate();
  await loginPage.login(username, password);
  await expect(inventoryPage.productsHeader).toBeVisible();
  
  return { loginPage, inventoryPage };
}
// Add first available product from page
export async function addFirstAvailableProduct(inventoryPage: InventoryPage): Promise<void> {
  const firstProducts = await getFirstProductsFromPage(inventoryPage.page, 1);
  if (firstProducts.length > 0) {
    await inventoryPage.addToCart(firstProducts[0]);
  }
}
// Add multiple products to cart
export async function addProductsToCart(inventoryPage: InventoryPage, productDataTests: string[]): Promise<void> {
  for (const productDataTest of productDataTests) {
    await inventoryPage.addToCart(productDataTest);
  }
}

// Remove multiple products from cart
export async function removeProductsFromInventory(inventoryPage: InventoryPage, productDataTests: string[]): Promise<void> {
  for (const productDataTest of productDataTests) {
    await inventoryPage.removeFromCart(productDataTest);
  }
}

// Verify cart badge count
export async function verifyCartBadgeCount(inventoryPage: InventoryPage, expectedCount: string): Promise<void> {
  if (expectedCount === '0') {
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  } else {
    await expect(inventoryPage.cartBadge).toHaveText(expectedCount);
  }
}

// Complete purchase workflow
export async function completePurchaseFlow(
  inventoryPage: InventoryPage,
  customerInfo?: Customer
): Promise<void> {
  const cartPage = new CartPage(inventoryPage.page);
  const checkoutPage = new CheckoutPage(inventoryPage.page);
  
  // Use provided customer info or get random customer data
  const customer = customerInfo || getRandomCustomer();
  
  // Navigate to cart
  await inventoryPage.goToCart();
  await expect(cartPage.cartHeader).toBeVisible();
  
  // Proceed to checkout
  await cartPage.proceedToCheckout();
  await expect(checkoutPage.checkoutHeader).toBeVisible();
  
  // Fill checkout information
  await checkoutPage.fillCheckoutInformation(
    customer.firstName,
    customer.lastName,
    customer.postalCode
  );
  
  // Continue to overview and finish
  await checkoutPage.continueToOverview();
  await checkoutPage.finishOrder();
  
  // Verify order completion
  await expect(checkoutPage.thankYouMessage).toBeVisible();
  await expect(inventoryPage.page).toHaveURL(/checkout-complete\.html/);
}

// Add dynamic products to cart from page
export async function addDynamicProductsToCart(
  inventoryPage: InventoryPage, 
  count: number = 3
): Promise<string[]> {
  const productDataTests = await getRandomProductsFromPage(inventoryPage.page, count);
  
  for (const dataTest of productDataTests) {
    await inventoryPage.addToCart(dataTest);
  }
  
  return productDataTests;
}

// Dynamic shopping cart workflow using live page products
export async function dynamicShoppingCartWorkflow(
  inventoryPage: InventoryPage,
  productCount: number = 3
): Promise<void> {
  const cartPage = new CartPage(inventoryPage.page);
  const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com/';
  
  // Add dynamic products from page
  const addedProducts = await addDynamicProductsToCart(inventoryPage, productCount);
  await verifyCartBadgeCount(inventoryPage, addedProducts.length.toString());
  
  // Remove products one by one and verify count
  let currentCount = addedProducts.length;
  for (const productDataTest of addedProducts) {
    await inventoryPage.removeFromCart(productDataTest);
    currentCount--;
    if (currentCount > 0) {
      await verifyCartBadgeCount(inventoryPage, currentCount.toString());
    } else {
      await verifyCartBadgeCount(inventoryPage, '0');
    }
  }
  
  // Test cart navigation
  if (currentCount === 0 && addedProducts.length > 0) {
    // Add one item back for cart navigation test
    await inventoryPage.addToCart(addedProducts[0]);
  }
  
  await inventoryPage.goToCart();
  await expect(inventoryPage.page).toHaveURL(`${baseUrl}cart.html`);
  
  await cartPage.continueShopping();
  await expect(inventoryPage.page).toHaveURL(`${baseUrl}inventory.html`);
}

// Product sorting workflow using dynamic sort options
export async function testProductSorting(inventoryPage: InventoryPage, sortOptions?: string[]): Promise<void> {
  const optionsToTest = sortOptions || getRandomSortOptions(3);
  
  for (const option of optionsToTest) {
    await inventoryPage.sortBy(option);
    await expect(inventoryPage.productSort).toHaveValue(option);
  }
}

// Verify product elements are present dynamically
export async function verifyProductElements(inventoryPage: InventoryPage, expectedCount?: number): Promise<void> {
  const actualProductCount = await getProductCountFromPage(inventoryPage.page);
  
  if (expectedCount) {
    expect(actualProductCount).toBe(expectedCount);
  } else {
    expect(actualProductCount).toBeGreaterThan(0);
  }
  
  await expect(inventoryPage.inventoryItems).toHaveCount(actualProductCount);
  await expect(inventoryPage.page.locator('.inventory_item_name')).toHaveCount(actualProductCount);
  await expect(inventoryPage.page.locator('.inventory_item_desc')).toHaveCount(actualProductCount);
  await expect(inventoryPage.page.locator('.inventory_item_price')).toHaveCount(actualProductCount);
}

// Navigate to product detail and back
export async function viewProductDetailAndReturn(
  inventoryPage: InventoryPage,
  productTitleSelector: string,
  expectedProductName: string
): Promise<void> {
  const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com/';
  
  // Click on product
  await inventoryPage.page.locator(productTitleSelector).click();
  await expect(inventoryPage.page).toHaveURL(/.*inventory-item\.html\?id=\d+/);
  await expect(inventoryPage.page.getByText(expectedProductName)).toBeVisible();
  
  // Navigate back
  await inventoryPage.page.locator('[data-test="back-to-products"]').click();
  await expect(inventoryPage.page).toHaveURL(`${baseUrl}inventory.html`);
}

// Shopping cart management workflow
export async function manageShoppingCart(
  inventoryPage: InventoryPage,
  productsToAdd: string[],
  productsToRemove: string[]
): Promise<void> {
  const cartPage = new CartPage(inventoryPage.page);
  const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com/';
  
  // Add products
  await addProductsToCart(inventoryPage, productsToAdd);
  await verifyCartBadgeCount(inventoryPage, productsToAdd.length.toString());
  
  // Remove products one by one and verify count
  let currentCount = productsToAdd.length;
  for (const productToRemove of productsToRemove) {
    await inventoryPage.removeFromCart(productToRemove);
    currentCount--;
    if (currentCount > 0) {
      await verifyCartBadgeCount(inventoryPage, currentCount.toString());
    } else {
      await verifyCartBadgeCount(inventoryPage, '0');
    }
  }
  
  // Test cart navigation
  if (currentCount === 0) {
    // Add one item back for cart navigation test
    await inventoryPage.addToCart(productsToAdd[0]);
  }
  
  await inventoryPage.goToCart();
  await expect(inventoryPage.page).toHaveURL(`${baseUrl}cart.html`);
  
  await cartPage.continueShopping();
  await expect(inventoryPage.page).toHaveURL(`${baseUrl}inventory.html`);
}