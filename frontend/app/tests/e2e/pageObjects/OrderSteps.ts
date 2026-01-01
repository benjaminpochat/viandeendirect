import { Page, Locator } from '@playwright/test';

export class AuthenticationStep {
  readonly page: Page;
  readonly authenticationTitle: Locator;
  readonly continueButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.authenticationTitle = page.locator('text=Votre commande est au nom de');
    this.continueButton = page.locator('button:has-text("Continuer avec ce compte")');
  }
  
  async isLoaded(): Promise<boolean> {
    await this.authenticationTitle.waitFor();
    return this.authenticationTitle.isVisible();
  }
  
  async continueWithAccount() {
    await this.continueButton.click();
  }
}

export class ConditionsStep {
  readonly page: Page;
  readonly conditionsTitle: Locator;
  readonly conditionsCheckbox: Locator;
  readonly validateConditionsButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.conditionsTitle = page.locator('text=En validant ma commande je m\'engage à');
    this.conditionsCheckbox = page.locator('input[type="checkbox"]');
    this.validateConditionsButton = page.locator('button:has-text("Valider les conditions")');
  }
  
  async isLoaded(): Promise<boolean> {
    await this.conditionsTitle.waitFor();
    return this.conditionsTitle.isVisible();
  }
  
  async acceptConditions() {
    await this.conditionsCheckbox.check();
  }
  
  async isValidationButtonEnabled(): Promise<boolean> {
    return this.validateConditionsButton.isEnabled();
  }
  
  async validateConditions() {
    await this.validateConditionsButton.click();
  }
}

export class PaymentStep {
  readonly page: Page;
  readonly paymentTitle: Locator;
  readonly payOrderButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.paymentTitle = page.locator('text=Payez votre commande');
    this.payOrderButton = page.locator('button:has-text("Payer ma commande")');
  }
  
  async isLoaded(): Promise<boolean> {
    await this.paymentTitle.waitFor();
    return this.paymentTitle.isVisible();
  }
  
  async payOrder() {
    await this.payOrderButton.click();
  }
}

export class OrderFormActions {
  readonly page: Page;
  readonly validateItemsButton: Locator;
  readonly cancelButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.validateItemsButton = page.locator('button[type="submit"]:has-text("Valider la commande")');
    this.cancelButton = page.locator('button:has-text("Abandonner")');
  }
  
  async isValidateItemsButtonEnabled(): Promise<boolean> {
    return this.validateItemsButton.isEnabled();
  }
  
  async validateItems() {
    await this.validateItemsButton.click();
  }
  
  async cancelOrder() {
    await this.cancelButton.click();
  }
}