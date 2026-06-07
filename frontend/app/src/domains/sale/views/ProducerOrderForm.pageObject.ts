import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for ProducerOrderForm component
 * Path: domains/sale/views/ProducerOrderForm.tsx
 */
export class ProducerOrderFormPage {
    readonly page: Page;
    readonly title: Locator;
    readonly stepper: Locator;
    
    // Step 1: Set Items
    readonly packagesList: Locator;
    readonly itemsValidationButton: Locator;
    
    // Step 2: Set Customer
    readonly customerSelector: Locator;
    
    // Step 3: Confirmation
    readonly orderSummary: Locator;
    readonly validateOrderButton: Locator;
    
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
        this.customerSelector = page.locator('CustomerSelector');
        
        // Step 3
        this.orderSummary = page.locator('OrderSummary');
        this.validateOrderButton = page.locator('role=button[name="Valider la commande"]');
        
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
     * Verify customer selector is visible
     */
    async verifyCustomerSelectorVisible() {
        await expect(this.customerSelector).toBeVisible();
    }

    /**
     * Select a customer by index
     */
    async selectCustomer(index: number = 0) {
        const options = await this.customerSelector.locator('[role="option"]').all();
        await options[index].click();
    }

    /**
     * Verify order summary is visible
     */
    async verifyOrderSummaryVisible() {
        await expect(this.orderSummary).toBeVisible();
    }

    /**
     * Click validate order button
     */
    async clickValidateOrder() {
        await this.validateOrderButton.click();
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
    async completeForm(packageSelections: Array<{index: number, quantity: number}>, customerIndex: number = 0) {
        // Step 1: Select packages
        for (const selection of packageSelections) {
            await this.selectPackage(selection.index, selection.quantity);
        }
        await this.clickItemsValidation();
        
        // Step 2: Select customer
        await this.selectCustomer(customerIndex);
        
        // Step 3: Confirmation
        await this.clickValidateOrder();
    }

    /**
     * Get total amount from validation button
     */
    async getTotalAmount() {
        const text = await this.itemsValidationButton.textContent();
        const match = text?.match(/Valider la commande pour (\d+) €TTC/);
        return match ? parseInt(match[1]) : 0;
    }

    /**
     * Verify validation button is disabled when no items selected
     */
    async verifyValidationButtonDisabled() {
        await expect(this.itemsValidationButton).toBeDisabled();
    }

    /**
     * Verify validation button is enabled
     */
    async verifyValidationButtonEnabled() {
        await expect(this.itemsValidationButton).toBeEnabled();
    }
}
