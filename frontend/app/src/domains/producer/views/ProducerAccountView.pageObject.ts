import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for ProducerAccountView component
 * Path: domains/producer/views/ProducerAccountView.tsx
 */
export class ProducerAccountViewPage {
    readonly page: Page;
    readonly title: Locator;
    readonly paymentConfigTitle: Locator;
    readonly farmPresentationTitle: Locator;
    readonly farmNameField: Locator;
    readonly websiteUrlField: Locator;
    readonly slideShowUrlField: Locator;
    readonly stripeAccountInfo: Locator;
    readonly createStripeAccountButton: Locator;
    readonly stripeDashboardButton: Locator;
    readonly editStripeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Gestion du compte"]');
        this.paymentConfigTitle = page.locator('text="Configuration des paiements"');
        this.farmPresentationTitle = page.locator('text="Présentation de la ferme"');
        
        // Editable fields
        this.farmNameField = page.locator('[name="nom de l\'exploitation agricole"]');
        this.websiteUrlField = page.locator('[name="adresse du site web"]');
        this.slideShowUrlField = page.locator('[name="adresse du diaporama"]');
        
        // Stripe elements
        this.stripeAccountInfo = page.locator('text=/Votre numéro de compte Stripe/');
        this.createStripeAccountButton = page.locator('role=button[name="Créer un compte de paiement Stripe"]');
        this.stripeDashboardButton = page.locator('role=button[name="Consultez vos encaissements sur Stripe"]');
        this.editStripeButton = page.locator('role=button[name="Modifiez votre RIB et vos informations réglementaires sur Stripe"]');
    }

    /**
     * Verify that the page is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.paymentConfigTitle).toBeVisible();
        await expect(this.farmPresentationTitle).toBeVisible();
    }

    /**
     * Verify payment configuration section is visible
     */
    async verifyPaymentConfigVisible() {
        await expect(this.paymentConfigTitle).toBeVisible();
    }

    /**
     * Verify farm presentation section is visible
     */
    async verifyFarmPresentationVisible() {
        await expect(this.farmPresentationTitle).toBeVisible();
    }

    /**
     * Verify Stripe account is displayed
     */
    async verifyStripeAccountDisplayed() {
        await expect(this.stripeAccountInfo).toBeVisible();
    }

    /**
     * Verify Stripe account creation button is visible
     */
    async verifyStripeAccountCreationButtonVisible() {
        await expect(this.createStripeAccountButton).toBeVisible();
    }

    /**
     * Click create Stripe account button
     */
    async clickCreateStripeAccount() {
        await this.createStripeAccountButton.click();
    }

    /**
     * Verify Stripe dashboard button is visible
     */
    async verifyStripeDashboardButtonVisible() {
        await expect(this.stripeDashboardButton).toBeVisible();
    }

    /**
     * Click Stripe dashboard button
     */
    async clickStripeDashboard() {
        await this.stripeDashboardButton.click();
    }

    /**
     * Verify edit Stripe button is visible
     */
    async verifyEditStripeButtonVisible() {
        await expect(this.editStripeButton).toBeVisible();
    }

    /**
     * Click edit Stripe button
     */
    async clickEditStripe() {
        await this.editStripeButton.click();
    }

    /**
     * Update farm name
     */
    async updateFarmName(newName: string) {
        await this.farmNameField.click();
        await this.farmNameField.fill(newName);
        await this.farmNameField.press('Enter');
    }

    /**
     * Update website URL
     */
    async updateWebsiteUrl(newUrl: string) {
        await this.websiteUrlField.click();
        await this.websiteUrlField.fill(newUrl);
        await this.websiteUrlField.press('Enter');
    }

    /**
     * Update slideshow URL
     */
    async updateSlideShowUrl(newUrl: string) {
        await this.slideShowUrlField.click();
        await this.slideShowUrlField.fill(newUrl);
        await this.slideShowUrlField.press('Enter');
    }
}
