import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly postalCodeField: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly backHomeButton: Locator;
  readonly checkoutHeader: Locator;
  readonly orderCompleteHeader: Locator;
  readonly thankYouMessage: Locator;
  readonly totalPrice: Locator;
  readonly tax: Locator;
  readonly subtotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameField = page.locator('[data-test="firstName"]');
    this.lastNameField = page.locator('[data-test="lastName"]');
    this.postalCodeField = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.checkoutHeader = page.getByText('Checkout: Your Information');
    this.orderCompleteHeader = page.getByText('Checkout: Complete!');
    this.thankYouMessage = page.getByText('Thank you for your order!');
    this.totalPrice = page.locator('.summary_total_label');
    this.tax = page.locator('.summary_tax_label'); 
    this.subtotal = page.locator('.summary_subtotal_label');
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.postalCodeField.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async backToHome() {
    await this.backHomeButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getTotalAmount(): Promise<string> {
    return await this.totalPrice.textContent() || '';
  }

  async getTaxAmount(): Promise<string> {
    return await this.tax.textContent() || '';
  }

  async getSubtotalAmount(): Promise<string> {
    return await this.subtotal.textContent() || '';
  }
}