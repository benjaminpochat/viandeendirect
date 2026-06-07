import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for SlaughterPropertiesForm component
 * Path: domains/production/views/beefProduction/forms/SlaughterPropertiesForm.tsx
 */
export class SlaughterPropertiesFormPage {
    readonly page: Page;
    readonly form: Locator;
    readonly slaughterDateField: Locator;
    readonly slaughterHouseField: Locator;
    readonly slaughterPlaceField: Locator;
    readonly warmCarcassWeightSlider: Locator;
    readonly liveWeightText: Locator;
    readonly warmCarcassWeightText: Locator;
    readonly meatWeightText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('SlaughterPropertiesForm');
        this.slaughterDateField = this.form.locator('[name="slaughterDate"]');
        this.slaughterHouseField = this.form.locator('[name="slaughterHouse"]');
        this.slaughterPlaceField = this.form.locator('[name="slaughterPlace"]');
        this.warmCarcassWeightSlider = this.form.locator('[name="warmCarcassWeight"]');
        this.liveWeightText = this.form.locator('text=/Poids de l\'animal vivant : \d+ kg/');
        this.warmCarcassWeightText = this.form.locator('text=/Poids de carcasse chaude : \d+ kg/');
        this.meatWeightText = this.form.locator('text=/Quantité de viande : \d+ kg/');
    }

    /**
     * Verify that the form is loaded
     */
    async verifyFormLoaded() {
        await expect(this.form).toBeVisible();
        await expect(this.slaughterDateField).toBeVisible();
        await expect(this.slaughterHouseField).toBeVisible();
        await expect(this.slaughterPlaceField).toBeVisible();
        await expect(this.warmCarcassWeightSlider).toBeVisible();
    }

    /**
     * Fill all slaughter properties
     */
    async fillForm(properties: {
        slaughterDate: string;
        slaughterHouse: string;
        slaughterPlace: string;
        warmCarcassWeight: number;
    }) {
        await this.slaughterDateField.fill(properties.slaughterDate);
        await this.slaughterHouseField.fill(properties.slaughterHouse);
        await this.slaughterPlaceField.fill(properties.slaughterPlace);
        await this.warmCarcassWeightSlider.fill(String(properties.warmCarcassWeight));
    }

    /**
     * Fill slaughter date
     */
    async fillSlaughterDate(date: string) {
        await this.slaughterDateField.fill(date);
    }

    /**
     * Fill slaughter house
     */
    async fillSlaughterHouse(house: string) {
        await this.slaughterHouseField.fill(house);
    }

    /**
     * Fill slaughter place
     */
    async fillSlaughterPlace(place: string) {
        await this.slaughterPlaceField.fill(place);
    }

    /**
     * Set warm carcass weight
     */
    async setWarmCarcassWeight(weight: number) {
        await this.warmCarcassWeightSlider.fill(String(weight));
    }

    /**
     * Get warm carcass weight
     */
    async getWarmCarcassWeight() {
        const text = await this.warmCarcassWeightText.textContent();
        const match = text?.match(/Poids de carcasse chaude : (\d+) kg/);
        return match ? parseInt(match[1]) : 0;
    }

    /**
     * Get meat weight
     */
    async getMeatWeight() {
        const text = await this.meatWeightText.textContent();
        const match = text?.match(/Quantité de viande : (\d+) kg/);
        return match ? parseInt(match[1]) : 0;
    }

    /**
     * Get live weight
     */
    async getLiveWeight() {
        const text = await this.liveWeightText.textContent();
        const match = text?.match(/Poids de l'animal vivant : (\d+) kg/);
        return match ? parseInt(match[1]) : 0;
    }

    /**
     * Verify form is disabled
     */
    async verifyFormDisabled() {
        await expect(this.slaughterDateField).toBeDisabled();
        await expect(this.slaughterHouseField).toBeDisabled();
        await expect(this.slaughterPlaceField).toBeDisabled();
        await expect(this.warmCarcassWeightSlider).toBeDisabled();
    }

    /**
     * Verify form is enabled
     */
    async verifyFormEnabled() {
        await expect(this.slaughterDateField).toBeEnabled();
        await expect(this.slaughterHouseField).toBeEnabled();
        await expect(this.slaughterPlaceField).toBeEnabled();
        await expect(this.warmCarcassWeightSlider).toBeEnabled();
    }

    /**
     * Verify weight calculations are displayed
     */
    async verifyWeightCalculationsDisplayed() {
        await expect(this.liveWeightText).toBeVisible();
        await expect(this.warmCarcassWeightText).toBeVisible();
        await expect(this.meatWeightText).toBeVisible();
    }
}
