import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for CuttingPropertiesForm component
 * Path: domains/production/views/beefProduction/forms/CuttingPropertiesForm.tsx
 */
export class CuttingPropertiesFormPage {
    readonly page: Page;
    readonly form: Locator;
    readonly cuttingDateField: Locator;
    readonly cuttingButcherField: Locator;
    readonly cuttingPlaceField: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('CuttingPropertiesForm');
        this.cuttingDateField = this.form.locator('[name="cuttingDate"]');
        this.cuttingButcherField = this.form.locator('[name="cuttingButcher"]');
        this.cuttingPlaceField = this.form.locator('[name="cuttingPlace"]');
    }

    /**
     * Verify that the form is loaded
     */
    async verifyFormLoaded() {
        await expect(this.form).toBeVisible();
        await expect(this.cuttingDateField).toBeVisible();
        await expect(this.cuttingButcherField).toBeVisible();
        await expect(this.cuttingPlaceField).toBeVisible();
    }

    /**
     * Fill all cutting properties
     */
    async fillForm(properties: {
        cuttingDate: string;
        cuttingButcher: string;
        cuttingPlace: string;
    }) {
        await this.cuttingDateField.fill(properties.cuttingDate);
        await this.cuttingButcherField.fill(properties.cuttingButcher);
        await this.cuttingPlaceField.fill(properties.cuttingPlace);
    }

    /**
     * Fill cutting date
     */
    async fillCuttingDate(date: string) {
        await this.cuttingDateField.fill(date);
    }

    /**
     * Fill cutting butcher
     */
    async fillCuttingButcher(butcher: string) {
        await this.cuttingButcherField.fill(butcher);
    }

    /**
     * Fill cutting place
     */
    async fillCuttingPlace(place: string) {
        await this.cuttingPlaceField.fill(place);
    }

    /**
     * Verify form is disabled
     */
    async verifyFormDisabled() {
        await expect(this.cuttingDateField).toBeDisabled();
        await expect(this.cuttingButcherField).toBeDisabled();
        await expect(this.cuttingPlaceField).toBeDisabled();
    }

    /**
     * Verify form is enabled
     */
    async verifyFormEnabled() {
        await expect(this.cuttingDateField).toBeEnabled();
        await expect(this.cuttingButcherField).toBeEnabled();
        await expect(this.cuttingPlaceField).toBeEnabled();
    }

    /**
     * Clear all fields
     */
    async clearForm() {
        await this.cuttingDateField.clear();
        await this.cuttingButcherField.clear();
        await this.cuttingPlaceField.clear();
    }

    /**
     * Get cutting date value
     */
    async getCuttingDate() {
        return await this.cuttingDateField.inputValue();
    }

    /**
     * Get cutting butcher value
     */
    async getCuttingButcher() {
        return await this.cuttingButcherField.inputValue();
    }

    /**
     * Get cutting place value
     */
    async getCuttingPlace() {
        return await this.cuttingPlaceField.inputValue();
    }
}
