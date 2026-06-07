import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for ProductionsList component
 * Path: domains/production/views/ProductionsList.tsx
 */
export class ProductionsListPage {
    readonly page: Page;
    readonly title: Locator;
    readonly cardList: Locator;
    readonly addBeefProductionButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Productions"]');
        this.cardList = page.locator('.card-list');
        this.addBeefProductionButton = page.locator('role=button[name="Ajouter une production de colis de viande de boeuf"]');
    }

    /**
     * Verify that the page is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.cardList).toBeVisible();
        await expect(this.addBeefProductionButton).toBeVisible();
    }

    /**
     * Click the add beef production button
     */
    async clickAddBeefProduction() {
        await this.addBeefProductionButton.click();
    }

    /**
     * Verify a specific number of production cards are displayed
     */
    async verifyProductionCardsCount(count: number) {
        const cards = await this.page.locator('ProductionCard').all();
        await expect(cards).toHaveLength(count);
    }

    /**
     * Verify that the add button navigates to the creation page
     */
    async verifyAddButtonNavigation() {
        await this.clickAddBeefProduction();
        await expect(this.page).toHaveURL(/beefProduction\/creation/);
    }

    /**
     * Get all production card titles
     */
    async getProductionCardTitles() {
        return await this.page.locator('.card-list > *').allTextContents();
    }
}
