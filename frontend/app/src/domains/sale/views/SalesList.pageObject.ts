import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for SalesList component
 * Path: domains/sale/views/SalesList.tsx
 */
export class SalesListPage {
    readonly page: Page;
    readonly title: Locator;
    readonly cardList: Locator;
    readonly createSaleButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Ventes"]');
        this.cardList = page.locator('.card-list');
        this.createSaleButton = page.locator('role=button[name="Créer une vente"]');
    }

    /**
     * Verify that the page is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.cardList).toBeVisible();
        await expect(this.createSaleButton).toBeVisible();
    }

    /**
     * Click the create sale button
     */
    async clickCreateSale() {
        await this.createSaleButton.click();
    }

    /**
     * Verify a specific number of sale cards are displayed
     */
    async verifySaleCardsCount(count: number) {
        const cards = await this.page.locator('SaleCard').all();
        await expect(cards).toHaveLength(count);
    }

    /**
     * Verify that the create button navigates to the creation page
     */
    async verifyCreateButtonNavigation() {
        await this.clickCreateSale();
        await expect(this.page).toHaveURL(/sales\/creation/);
    }

    /**
     * Get all sale card titles
     */
    async getSaleCardTitles() {
        return await this.page.locator('.card-list > *').allTextContents();
    }

    /**
     * Click on a specific sale card by index
     */
    async clickSaleCard(index: number) {
        const cards = await this.page.locator('SaleCard').all();
        await cards[index].click();
    }
}
