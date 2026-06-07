import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for OrderView component
 * Path: domains/sale/views/OrderView.tsx
 */
export class OrderViewPage {
    readonly page: Page;
    readonly title: Locator;
    readonly orderSummary: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Détails de la commande"]');
        this.orderSummary = page.locator('OrderSummary');
        this.backButton = page.locator('role=button[name="Retour aux commandes"]');
    }

    /**
     * Verify that the page is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.orderSummary).toBeVisible();
        await expect(this.backButton).toBeVisible();
    }

    /**
     * Click the back button
     */
    async clickBack() {
        await this.backButton.click();
    }

    /**
     * Verify order summary contains expected data
     */
    async verifyOrderSummaryContains(text: string) {
        await expect(this.orderSummary).toContainText(text);
    }
}
