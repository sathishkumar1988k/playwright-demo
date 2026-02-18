import testData from '../../testData/testData.json';
import { Page, Locator } from '@playwright/test';

/**
 * Dynamic product and data selection utilities that work with live page content
 */

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

// Get available products dynamically from the page
export async function getAvailableProductsFromPage(page: Page): Promise<string[]> {
  const addToCartButtons = await page.locator('[data-test*="add-to-cart-"]').all();
  const productDataTests: string[] = [];
  
  for (const button of addToCartButtons) {
    const dataTest = await button.getAttribute('data-test');
    if (dataTest) {
      productDataTests.push(dataTest);
    }
  }
  
  return productDataTests;
}

// Get random products from the page
export async function getRandomProductsFromPage(page: Page, count: number): Promise<string[]> {
  const availableProducts = await getAvailableProductsFromPage(page);
  const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, availableProducts.length));
}

// Get first N products from the page
export async function getFirstProductsFromPage(page: Page, count: number): Promise<string[]> {
  const availableProducts = await getAvailableProductsFromPage(page);
  return availableProducts.slice(0, Math.min(count, availableProducts.length));
}

// Check if products exist on the page
export async function verifyProductsExistOnPage(page: Page, productDataTests: string[]): Promise<boolean> {
  for (const dataTest of productDataTests) {
    const exists = await page.locator(`[data-test="${dataTest}"]`).isVisible();
    if (!exists) return false;
  }
  return true;
}

// Get product count from page
export async function getProductCountFromPage(page: Page): Promise<number> {
  return await page.locator('.inventory_item').count();
}

// Get random customer data
export function getRandomCustomer(): Customer {
  const customers = testData.checkout.customers;
  const randomIndex = Math.floor(Math.random() * customers.length);
  return customers[randomIndex];
}

// Get first customer (default)
export function getDefaultCustomer(): Customer {
  return testData.checkout.customers[0];
}

// Get all sort options
export function getSortOptions(): string[] {
  return testData.sortOptions;
}

// Get random sort option
export function getRandomSortOption(): string {
  const options = getSortOptions();
  return options[Math.floor(Math.random() * options.length)];
}

// Get multiple random sort options  
export function getRandomSortOptions(count: number = 3): string[] {
  const options = getSortOptions();
  const shuffled = [...options].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, options.length));
}