import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for CustomerOrderForm component
 * Path: domains/sale/views/CustomerOrderForm.tsx
 */
export class CustomerOrderFormPage {
    readonly page: Page;
    readonly title: Locator;
    readonly stepper: Locator;
    
    // Step 1: Set Items
    readonly packagesList: Locator;
    readonly itemsValidationButton: Locator;
    
    // Step 2: Authentication
    readonly authenticationStepLabel: Locator;
    readonly continueWithAccountButton: Locator;
    readonly logoutButton: Locator;
    readonly loginButton: Locator;
    readonly registerButton: Locator;
    
    // Step 3: Confirmation
    readonly conditionsCheckbox: Locator;
    readonly approveConditionsButton: Locator;
    
    // Step 4: Payment
    readonly paymentStep: Locator;
    readonly payButton: Locator;
    
    // Common
    readonly abandonButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading');
        this.stepper = page.locator('role=region[name="stepper"]');
        
        // Step 1
        this.packagesList = page.locator('.packages-list');
        this.itemsValidationButton = page.locator('role=button[name=/Valider la commande/]');
        
        // Step 2
        this.authenticationStepLabel = page.locator('text=/Votre commande est au nom de/');
        this.continueWithAccountButton = page.locator('role=button[name="Continuer avec ce compte"]');
        this.logoutButton = page.locator('role=button[name="Se déconnecter et changer de compte"]');
        this.loginButton = page.locator('role=button[name="Se connecter"]');
        this.registerButton = page.locator('role=button[name="Créer un compte"]');
        
        // Step 3
        this.conditionsCheckbox = page.locator('role=checkbox');
        this.approveConditionsButton = page.locator('role=button[name="Valider les conditions"]');
        
        // Step 4
        this.paymentStep = page.locator('text="Payez votre commande"');
        this.payButton = page.locator('role=button[name="Payer ma commande"]');
        
        // Common
        this.abandonButton = page.locator('role=button[name="Abandonner"]');
    }

    /**
     * Verify that the form is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.stepper).toBeVisible();
    }

    /**
     * Verify step 1 (Set Items) is visible
     */
    async verifySetItemsStepVisible() {
        await expect(this.packagesList).toBeVisible();
        await expect(this.itemsValidationButton).toBeVisible();
    }

    /**
     * Select a package by index
     */
    async selectPackage(index: number, quantity: number = 1) {
        const selectors = await this.page.locator('PackageSelector').all();
        await selectors[index].locator('[role="spinbutton"]').fill(String(quantity));
    }

    /**
     * Click items validation button
     */
    async clickItemsValidation() {
        await this.itemsValidationButton.click();
    }

    /**
     * Verify authentication step is visible
     */
    async verifyAuthenticationStepVisible() {
        await expect(this.authenticationStepLabel).toBeVisible();
    }

    /**
     * Click continue with account button
     */
    async clickContinueWithAccount() {
        await this.continueWithAccountButton.click();
    }

    /**
     * Click login button
     */
    async clickLogin() {
        await this.loginButton.click();
    }

    /**
     * Click register button
     */
    async clickRegister() {
        await this.registerButton.click();
    }

    /**
     * Click logout button
     */
    async clickLogout() {
        await this.logoutButton.click();
    }

    /**
     * Check the conditions checkbox
     */
    async checkConditions() {
        await this.conditionsCheckbox.check();
    }

    /**
     * Click approve conditions button
     */
    async clickApproveConditions() {
        await this.approveConditionsButton.click();
    }

    /**
     * Verify payment step is visible
     */
    async verifyPaymentStepVisible() {
        await expect(this.paymentStep).toBeVisible();
        await expect(this.payButton).toBeVisible();
    }

    /**
     * Click pay button
     */
    async clickPay() {
        await this.payButton.click();
    }

    /**
     * Click abandon button
     */
    async clickAbandon() {
        await this.abandonButton.click();
    }

    /**
     * Complete the entire order form
     */
    async completeForm(packageSelections: Array<{index: number, quantity: number}>) {
        // Step 1: Select packages
        for (const selection of packageSelections) {
            await this.selectPackage(selection.index, selection.quantity);
        }
        await this.clickItemsValidation();
        
        // Step 2: Authentication (assuming already logged in)
        await this.clickContinueWithAccount();
        
        // Step 3: Conditions
        await this.checkConditions();
        await this.clickApproveConditions();
        
        // Step 4: Payment
        // Note: Actual payment would redirect to Stripe
    }

    /**
     * Get total amount from validation button
     */
    async getTotalAmount() {
        const text = await this.itemsValidationButton.textContent();
        const match = text?.match(/Valider la commande pour (\d+) €TTC/);
        return match ? parseInt(match[1]) : 0;
    }
}
