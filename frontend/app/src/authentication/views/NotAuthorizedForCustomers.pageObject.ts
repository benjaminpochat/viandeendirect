import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for NotAuthorizedForCustomers component
 * Path: authentication/views/NotAuthorizedForCustomers.tsx
 */
export class NotAuthorizedForCustomersPage {
    readonly page: Page;
    readonly appBar: Locator;
    readonly toolbar: Locator;
    readonly title: Locator;
    readonly errorMessage1: Locator;
    readonly errorMessage2: Locator;
    readonly errorMessage3: Locator;
    readonly logoutButton: Locator;
    readonly accessCustomerSpaceButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.appBar = page.locator('role=region[name="Viande en direct"]');
        this.toolbar = page.locator('role=toolbar');
        this.title = page.locator('role=heading[name="Viande en direct"]');
        this.errorMessage1 = page.locator('text="Vous êtes dans l\'espace producteur de viandeendirect.eu"');
        this.errorMessage2 = page.locator('text="Votre compte est un compte client."');
        this.errorMessage3 = page.locator('text="Il est impossible d\'accéder à l\'espace producteur avec un compte client"');
        this.logoutButton = page.locator('role=button[name="Se déconnecter"]');
        this.accessCustomerSpaceButton = page.locator('role=button[name="Accéder à l\'espace client"]');
    }

    /**
     * Verify that all expected elements are visible
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.errorMessage1).toBeVisible();
        await expect(this.errorMessage2).toBeVisible();
        await expect(this.errorMessage3).toBeVisible();
        await expect(this.logoutButton).toBeVisible();
        await expect(this.accessCustomerSpaceButton).toBeVisible();
    }

    /**
     * Click the logout button
     */
    async clickLogout() {
        await this.logoutButton.click();
    }

    /**
     * Click the access customer space button
     */
    async clickAccessCustomerSpace() {
        await this.accessCustomerSpaceButton.click();
    }

    /**
     * Verify error messages are displayed
     */
    async verifyErrorMessages() {
        await expect(this.errorMessage1).toHaveText('Vous êtes dans l espace producteur de viandeendirect.eu');
        await expect(this.errorMessage2).toHaveText('Votre compte est un compte client.');
        await expect(this.errorMessage3).toHaveText('Il est impossible d accéder à l espace producteur avec un compte client');
    }
}
