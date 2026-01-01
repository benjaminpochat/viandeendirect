import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('text=Bienvenue');
  }
  
  async navigate() {
    await this.page.goto('/');
  }
  
  async isLoaded() {
    await this.welcomeMessage.waitFor();
    return this.welcomeMessage.isVisible();
  }
}