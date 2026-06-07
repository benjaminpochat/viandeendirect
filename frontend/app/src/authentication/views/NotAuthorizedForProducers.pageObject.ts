import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for NotAuthorizedForProducers component
 * Path: authentication/views/NotAuthorizedForProducers.tsx
 */
export class NotAuthorizedForProducersPage {
    readonly page: Page;
    readonly appBar: Locator;
    readonly toolbar: Locator;
    readonly title: Locator;
    readonly errorMessage1: Locator;
    readonly errorMessage2: Locator;
    readonly errorMessage3: Locator;
    readonly logoutButton: Locator;
    readonly accessProducerSpaceButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.appBar = page.locator('role=region[name="Viande en direct"]');
        this.toolbar = page.locator('role=toolbar');
        this.title = page.locator('role=heading[name="Viande en direct"]');
        this.errorMessage1 = page.locator('text="Vous êtes dans l\'espace client de viandeendirect.eu"');
        this.errorMessage2 = page.locator('text="Votre compte est un compte producteur."');
        this.errorMessage3 = page.locator('text="Il est impossible d\'utiliser un compte producteur pour s\'identifier à l\'espace client."');
        this.logoutButton = page.locator('role=button[name="Se déconnecter"]');
        this.accessProducerSpaceButton = page.locator('role=button[name="Accéder à l\'espace producteur"]');
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
        await expect(this.accessProducerSpaceButton).toBeVisible();
    }

    /**
     * Click the logout button
     */
    async clickLogout() {
        await this.logoutButton.click();
    }

    /**
     * Click the access producer space button
     */
    async clickAccessProducerSpace() {
        await this.accessProducerSpaceButton.click();
    }

    /**
     * Verify error messages are displayed
     */
    async verifyErrorMessages() {
        await expect(this.errorMessage1).toHaveText('Vous êtes dans l espace client de viandeendirect.eu');
        await expect(this.errorMessage2).toHaveText('Votre compte est un compte producteur.');
        await expect(this.errorMessage3).toHaveText('Il est impossible d utiliser un compte producteur pour s identifier à l espace client.');
    }
}
