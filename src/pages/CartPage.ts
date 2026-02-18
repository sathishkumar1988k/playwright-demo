import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;
  readonly cartHeader: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.removeButtons = page.locator('[data-test*="remove-"]');
    this.cartHeader = page.getByText('Your Cart');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async removeItem(productDataTest: string) {
    const removeSelector = productDataTest.replace('add-to-cart-', 'remove-');
    await this.page.locator(`[data-test="${removeSelector}"]`).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async getItemName(index: number): Promise<string> {
    return await this.cartItems.nth(index).locator('.inventory_item_name').textContent() || '';
  }

  async getItemPrice(index: number): Promise<string> {
    return await this.cartItems.nth(index).locator('.inventory_item_price').textContent() || '';
  }
}