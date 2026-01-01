import { Page, Locator } from '@playwright/test';

export class SalePage {
  readonly page: Page;
  readonly orderTitle: Locator;
  readonly packageSelector: PackageSelector;
  readonly orderStepper: OrderStepper;
  
  constructor(page: Page) {
    this.page = page;
    this.orderTitle = page.locator('h6:has-text("Votre commande pour la vente")');
    this.packageSelector = new PackageSelector(page);
    this.orderStepper = new OrderStepper(page);
  }
  
  async navigate(saleId: string) {
    await this.page.goto(`/sales/${saleId}`);
  }
  
  async isLoaded() {
    await this.orderTitle.waitFor();
    return this.orderTitle.isVisible();
  }
  
  async getCurrentSaleId(): Promise<string> {
    const url = this.page.url();
    return url.split('/').pop() || '1';
  }
}

export class PackageSelector {
  readonly page: Page;
  readonly packageItems: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.packageItems = page.locator('.packages-list > div');
  }
  
  async getPackageCount(): Promise<number> {
    return this.packageItems.count();
  }
  
  async getPackageName(index: number): Promise<string> {
    const packageItem = this.packageItems.nth(index);
    return packageItem.locator('.package-name').innerText();
  }
  
  async getPackagePrice(index: number): Promise<string> {
    const packageItem = this.packageItems.nth(index);
    return packageItem.locator('.package-price').innerText();
  }
  
  async incrementQuantity(index: number) {
    const packageItem = this.packageItems.nth(index);
    await packageItem.locator('button:has-text("+")').click();
  }
  
  async decrementQuantity(index: number) {
    const packageItem = this.packageItems.nth(index);
    await packageItem.locator('button:has-text("-")').click();
  }
  
  async getQuantityDisplay(index: number): Promise<string> {
    const packageItem = this.packageItems.nth(index);
    return packageItem.locator('.quantity-display').innerText();
  }
}

export class OrderStepper {
  readonly page: Page;
  readonly stepper: Locator;
  readonly stepButtons: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.stepper = page.locator('.MuiStepper-root');
    this.stepButtons = page.locator('.MuiStepButton-root');
  }
  
  async getStepCount(): Promise<number> {
    return this.stepButtons.count();
  }
  
  async isStepActive(stepIndex: number): Promise<boolean> {
    const step = this.stepButtons.nth(stepIndex);
    const classes = await step.getAttribute('class');
    return classes?.includes('Mui-active') || false;
  }
  
  async getStepLabel(stepIndex: number): Promise<string> {
    const step = this.stepButtons.nth(stepIndex);
    return step.innerText();
  }
}