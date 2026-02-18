import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly productSort: Locator;
  readonly productsHeader: Locator;
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.productSort = page.locator('[data-test="product-sort-container"]');
    this.productsHeader = page.getByText('Products');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('.inventory_item');
  }

  async addToCart(productDataTest: string) {
    await this.page.locator(`[data-test="${productDataTest}"]`).click();
  }

  async removeFromCart(productDataTest: string) {
    const removeSelector = productDataTest.replace('add-to-cart-', 'remove-');
    await this.page.locator(`[data-test="${removeSelector}"]`).click();
  }

  async getCartItemCount(): Promise<string> {
    return await this.cartBadge.textContent() || '0';
  }

  async sortBy(sortOption: string) {
    await this.productSort.selectOption(sortOption);
  }

  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async clickProduct(productName: string) {
    await this.page.getByText(productName).first().click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async openMenu() {
    await this.menuButton.click();
  }
}