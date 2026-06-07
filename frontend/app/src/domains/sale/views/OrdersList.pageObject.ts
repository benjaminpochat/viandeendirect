import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for OrdersList component
 * Path: domains/sale/views/OrdersList.tsx
 */
export class OrdersListPage {
    readonly page: Page;
    readonly title: Locator;
    readonly dataGrid: Locator;
    readonly referenceColumn: Locator;
    readonly customerNameColumn: Locator;
    readonly statusColumn: Locator;
    readonly actionsColumn: Locator;
    readonly hideFailedOrdersSwitch: Locator;
    readonly hideFailedOrdersLabel: Locator;
    readonly createOrderButton: Locator;
    readonly backToSalesButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading');
        this.dataGrid = page.locator('role=grid');
        this.referenceColumn = page.locator('text="Référence"');
        this.customerNameColumn = page.locator('text="Nom du client"');
        this.statusColumn = page.locator('text="Statut"');
        this.actionsColumn = page.locator('text="Détails"');
        this.hideFailedOrdersSwitch = page.locator('role=switch');
        this.hideFailedOrdersLabel = page.locator('text="Masquer les commandes échouées"');
        this.createOrderButton = page.locator('role=button[name="Saisir une commande"]');
        this.backToSalesButton = page.locator('role=button[name="Retour aux ventes"]');
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
        await expect(this.referenceColumn).toBeVisible();
        await expect(this.customerNameColumn).toBeVisible();
        await expect(this.statusColumn).toBeVisible();
        await expect(this.actionsColumn).toBeVisible();
    }

    /**
     * Toggle hide failed orders
     */
    async toggleHideFailedOrders() {
        await this.hideFailedOrdersSwitch.click();
    }

    /**
     * Click the create order button
     */
    async clickCreateOrder() {
        await this.createOrderButton.click();
    }

    /**
     * Click the back to sales button
     */
    async clickBackToSales() {
        await this.backToSalesButton.click();
    }

    /**
     * Click details button for a specific order
     */
    async clickOrderDetails(orderId: string) {
        const row = this.page.locator(`[role="row"][data-id="${orderId}"]`);
        await row.locator('role=button[name="Détails"]').click();
    }

    /**
     * Verify a specific order is in the list
     */
    async verifyOrderExists(customerName: string) {
        await expect(this.page.locator(`text="${customerName}"`)).toBeVisible();
    }

    /**
     * Get all visible rows in the grid
     */
    async getVisibleRows() {
        return await this.page.locator('[role="row"]').all();
    }

    /**
     * Search for an order
     */
    async searchOrder(query: string) {
        await this.page.locator('role=searchbox').fill(query);
    }
}
