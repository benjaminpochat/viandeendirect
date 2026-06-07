import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for CustomersList component
 * Path: domains/customer/views/CustomersList.tsx
 */
export class CustomersListPage {
    readonly page: Page;
    readonly title: Locator;
    readonly dataGrid: Locator;
    readonly nameColumn: Locator;
    readonly phoneColumn: Locator;
    readonly emailColumn: Locator;
    readonly quickFilter: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Clients"]');
        this.dataGrid = page.locator('role=grid');
        this.nameColumn = page.locator('text="Nom"');
        this.phoneColumn = page.locator('text="Téléphone"');
        this.emailColumn = page.locator('text="Email"');
        this.quickFilter = page.locator('role=searchbox');
    }

    /**
     * Verify that the page is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.dataGrid).toBeVisible();
    }

    /**
     * Verify column headers are visible
     */
    async verifyColumnHeaders() {
        await expect(this.nameColumn).toBeVisible();
        await expect(this.phoneColumn).toBeVisible();
        await expect(this.emailColumn).toBeVisible();
    }

    /**
     * Search for a customer by name
     */
    async searchCustomer(name: string) {
        await this.quickFilter.fill(name);
        await this.quickFilter.press('Enter');
    }

    /**
     * Get all visible rows in the grid
     */
    async getVisibleRows() {
        return await this.page.locator('[role="row"]').all();
    }

    /**
     * Verify a specific customer is in the list
     */
    async verifyCustomerExists(customerName: string) {
        await expect(this.page.locator(`text="${customerName}"`)).toBeVisible();
    }

    /**
     * Clear the search filter
     */
    async clearSearch() {
        await this.quickFilter.clear();
    }
}
