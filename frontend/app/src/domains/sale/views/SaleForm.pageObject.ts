import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for SaleForm component
 * Path: domains/sale/views/SaleForm.tsx
 */
export class SaleFormPage {
    readonly page: Page;
    readonly title: Locator;
    readonly stepper: Locator;
    readonly selectProductionStep: Locator;
    readonly deliveryAddressStep: Locator;
    readonly deliveryDateStep: Locator;
    readonly accessTypeStep: Locator;
    readonly confirmationStep: Locator;
    readonly stepButtons: Locator;
    readonly stepContents: Locator;

    // Step 1: Select Production
    readonly productionSelector: Locator;

    // Step 2: Delivery Address
    readonly addressAutocomplete: Locator;
    readonly addressNameField: Locator;
    readonly addressLine1Field: Locator;
    readonly addressLine2Field: Locator;
    readonly zipCodeField: Locator;
    readonly cityField: Locator;

    // Step 3: Delivery Date
    readonly datePicker: Locator;
    readonly startTimePicker: Locator;
    readonly stopTimePicker: Locator;

    // Step 4: Access Type
    readonly accessTypeSwitch: Locator;
    readonly privateAccessField: Locator;

    // Common buttons
    readonly validateButton: Locator;
    readonly abandonButton: Locator;
    readonly nextButton: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Nouvelle vente"]');
        this.stepper = page.locator('role=region[name="stepper"]');
        
        // Steps
        this.selectProductionStep = page.locator('text="Choisir une production"');
        this.deliveryAddressStep = page.locator('text="Définir le lieu de livraison"');
        this.deliveryDateStep = page.locator('text=/Définir la date et l\'heure de livraison/');
        this.accessTypeStep = page.locator('text="Définir le type d\'accès"');
        this.confirmationStep = page.locator('text="Validation"');
        
        // Step 1 elements
        this.productionSelector = page.locator('SaleProductionSelector');
        
        // Step 2 elements
        this.addressAutocomplete = page.locator('role=combobox');
        this.addressNameField = page.locator('[name="name"]');
        this.addressLine1Field = page.locator('[name="line1"]');
        this.addressLine2Field = page.locator('[name="line2"]');
        this.zipCodeField = page.locator('[name="zipCode"]');
        this.cityField = page.locator('[name="city"]');
        
        // Step 3 elements
        this.datePicker = page.locator('[name="date"]');
        this.startTimePicker = page.locator('[name="startTime"]');
        this.stopTimePicker = page.locator('[name="stopTime"]');
        
        // Step 4 elements
        this.accessTypeSwitch = page.locator('role=switch');
        this.privateAccessField = page.locator('[name="privateAccessCode"]');
        
        // Common buttons
        this.validateButton = page.locator('role=button[name="Valider"]').first();
        this.abandonButton = page.locator('role=button[name="Abandonner"]').first();
    }

    /**
     * Verify that the form is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.stepper).toBeVisible();
    }

    /**
     * Verify step 1 (Select Production) is active
     */
    async verifySelectProductionStepActive() {
        await expect(this.selectProductionStep).toBeVisible();
    }

    /**
     * Select a production by index
     */
    async selectProduction(index: number = 0) {
        const productions = await this.productionSelector.locator('[role="option"]').all();
        await productions[index].click();
    }

    /**
     * Fill delivery address
     */
    async fillDeliveryAddress(address: {
        name: string;
        line1: string;
        line2?: string;
        zipCode: string;
        city: string;
    }) {
        if (address.name) {
            await this.addressNameField.fill(address.name);
        }
        await this.addressLine1Field.fill(address.line1);
        if (address.line2) {
            await this.addressLine2Field.fill(address.line2);
        }
        await this.zipCodeField.fill(address.zipCode);
        await this.cityField.fill(address.city);
    }

    /**
     * Fill delivery date and time
     */
    async fillDeliveryDateTime(date: string, startTime: string, stopTime: string) {
        await this.datePicker.fill(date);
        await this.startTimePicker.fill(startTime);
        await this.stopTimePicker.fill(stopTime);
    }

    /**
     * Set access type
     */
    async setPrivateAccess(isPrivate: boolean, accessCode?: string) {
        if (isPrivate !== await this.accessTypeSwitch.isChecked()) {
            await this.accessTypeSwitch.click();
        }
        if (isPrivate && accessCode) {
            await this.privateAccessField.fill(accessCode);
        }
    }

    /**
     * Click validate button
     */
    async clickValidate() {
        await this.validateButton.click();
    }

    /**
     * Click abandon button
     */
    async clickAbandon() {
        await this.abandonButton.click();
    }

    /**
     * Submit step 1 (select production)
     */
    async submitSelectProduction(index: number = 0) {
        await this.selectProduction(index);
        await this.clickValidate();
    }

    /**
     * Submit step 2 (delivery address)
     */
    async submitDeliveryAddress(address: {
        name: string;
        line1: string;
        line2?: string;
        zipCode: string;
        city: string;
    }) {
        await this.fillDeliveryAddress(address);
        await this.clickValidate();
    }

    /**
     * Submit step 3 (delivery date)
     */
    async submitDeliveryDate(date: string, startTime: string, stopTime: string) {
        await this.fillDeliveryDateTime(date, startTime, stopTime);
        await this.clickValidate();
    }

    /**
     * Submit step 4 (access type)
     */
    async submitAccessType(isPrivate: boolean, accessCode?: string) {
        await this.setPrivateAccess(isPrivate, accessCode);
        await this.clickValidate();
    }

    /**
     * Complete the entire sale form
     */
    async completeForm(productionIndex: number, address: {
        name: string;
        line1: string;
        line2?: string;
        zipCode: string;
        city: string;
    }, date: string, startTime: string, stopTime: string, isPrivate: boolean = false, accessCode?: string) {
        await this.submitSelectProduction(productionIndex);
        await this.submitDeliveryAddress(address);
        await this.submitDeliveryDate(date, startTime, stopTime);
        await this.submitAccessType(isPrivate, accessCode);
        await this.clickValidate();
    }

    /**
     * Verify step is completed
     */
    async verifyStepCompleted(stepIndex: number) {
        const steps = await this.page.locator('[role="tab"]').all();
        await expect(steps[stepIndex]).toHaveAttribute('aria-selected', 'true');
    }
}
