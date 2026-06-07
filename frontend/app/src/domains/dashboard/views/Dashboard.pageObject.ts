import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for Dashboard component
 * Path: domains/dashboard/views/Dashboard.tsx
 */
export class DashboardPage {
    readonly page: Page;
    readonly title: Locator;
    readonly dashboardContainer: Locator;
    readonly dashboardAccount: Locator;
    readonly dashboardPayments: Locator;
    readonly dashboardProductions: Locator;
    readonly dashboardSales: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Tableau de bord"]');
        this.dashboardContainer = page.locator('.dashboard-container');
        this.dashboardAccount = page.locator('.dashboard-item').filter({ hasText: 'DashboardAccount' }).first();
        this.dashboardPayments = page.locator('.dashboard-item').filter({ hasText: 'DashboardPayments' }).first();
        this.dashboardProductions = page.locator('.dashboard-item').filter({ hasText: 'DashboardProductions' }).first();
        this.dashboardSales = page.locator('.dashboard-item').filter({ hasText: 'DashboardSales' }).first();
    }

    /**
     * Verify that the dashboard is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.dashboardContainer).toBeVisible();
    }

    /**
     * Verify all dashboard sections are visible
     */
    async verifyAllSectionsVisible() {
        await expect(this.dashboardAccount).toBeVisible();
        await expect(this.dashboardPayments).toBeVisible();
        await expect(this.dashboardProductions).toBeVisible();
        await expect(this.dashboardSales).toBeVisible();
    }

    /**
     * Click on Productions section
     */
    async clickProductions() {
        await this.dashboardProductions.click();
    }

    /**
     * Click on Sales section
     */
    async clickSales() {
        await this.dashboardSales.click();
    }

    /**
     * Click on Account section
     */
    async clickAccount() {
        await this.dashboardAccount.click();
    }

    /**
     * Click on Payments section
     */
    async clickPayments() {
        await this.dashboardPayments.click();
    }
}
