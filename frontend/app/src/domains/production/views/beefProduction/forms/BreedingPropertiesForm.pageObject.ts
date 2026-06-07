import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for BreedingPropertiesForm component
 * Path: domains/production/views/beefProduction/forms/BreedingPropertiesForm.tsx
 */
export class BreedingPropertiesFormPage {
    readonly page: Page;
    readonly form: Locator;
    readonly birthDateField: Locator;
    readonly birthFarmField: Locator;
    readonly birthPlaceField: Locator;
    readonly animalIdentifierField: Locator;
    readonly animalTypeField: Locator;
    readonly cattleBreedField: Locator;
    readonly labelRougeCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('BreedingPropertiesForm');
        this.birthDateField = this.form.locator('[name="birthDate"]');
        this.birthFarmField = this.form.locator('[name="birthFarm"]');
        this.birthPlaceField = this.form.locator('[name="birthPlace"]');
        this.animalIdentifierField = this.form.locator('[name="animalIdentifier"]');
        this.animalTypeField = this.form.locator('[name="animalType"]');
        this.cattleBreedField = this.form.locator('[name="cattleBreed"]');
        this.labelRougeCheckbox = this.form.locator('[name="labelRougeCertified"]');
    }

    /**
     * Verify that the form is loaded
     */
    async verifyFormLoaded() {
        await expect(this.form).toBeVisible();
        await expect(this.birthDateField).toBeVisible();
        await expect(this.birthFarmField).toBeVisible();
        await expect(this.birthPlaceField).toBeVisible();
        await expect(this.animalIdentifierField).toBeVisible();
        await expect(this.animalTypeField).toBeVisible();
        await expect(this.cattleBreedField).toBeVisible();
        await expect(this.labelRougeCheckbox).toBeVisible();
    }

    /**
     * Fill all breeding properties
     */
    async fillForm(properties: {
        birthDate: string;
        birthFarm: string;
        birthPlace: string;
        animalIdentifier: string;
        animalType: string;
        cattleBreed: string;
        labelRougeCertified?: boolean;
    }) {
        await this.birthDateField.fill(properties.birthDate);
        await this.birthFarmField.fill(properties.birthFarm);
        await this.birthPlaceField.fill(properties.birthPlace);
        await this.animalIdentifierField.fill(properties.animalIdentifier);
        await this.animalTypeField.selectOption(properties.animalType);
        await this.cattleBreedField.selectOption(properties.cattleBreed);
        if (properties.labelRougeCertified !== undefined) {
            if (properties.labelRougeCertified) {
                await this.labelRougeCheckbox.check();
            } else {
                await this.labelRougeCheckbox.uncheck();
            }
        }
    }

    /**
     * Fill birth date
     */
    async fillBirthDate(date: string) {
        await this.birthDateField.fill(date);
    }

    /**
     * Fill birth farm
     */
    async fillBirthFarm(farm: string) {
        await this.birthFarmField.fill(farm);
    }

    /**
     * Fill birth place
     */
    async fillBirthPlace(place: string) {
        await this.birthPlaceField.fill(place);
    }

    /**
     * Fill animal identifier
     */
    async fillAnimalIdentifier(identifier: string) {
        await this.animalIdentifierField.fill(identifier);
    }

    /**
     * Select animal type
     */
    async selectAnimalType(type: string) {
        await this.animalTypeField.selectOption(type);
    }

    /**
     * Select cattle breed
     */
    async selectCattleBreed(breed: string) {
        await this.cattleBreedField.selectOption(breed);
    }

    /**
     * Set label rouge certification
     */
    async setLabelRougeCertified(certified: boolean) {
        if (certified) {
            await this.labelRougeCheckbox.check();
        } else {
            await this.labelRougeCheckbox.uncheck();
        }
    }

    /**
     * Verify form is disabled
     */
    async verifyFormDisabled() {
        await expect(this.birthDateField).toBeDisabled();
        await expect(this.birthFarmField).toBeDisabled();
        await expect(this.birthPlaceField).toBeDisabled();
        await expect(this.animalIdentifierField).toBeDisabled();
        await expect(this.animalTypeField).toBeDisabled();
        await expect(this.cattleBreedField).toBeDisabled();
    }

    /**
     * Verify form is enabled
     */
    async verifyFormEnabled() {
        await expect(this.birthDateField).toBeEnabled();
        await expect(this.birthFarmField).toBeEnabled();
        await expect(this.birthPlaceField).toBeEnabled();
        await expect(this.animalIdentifierField).toBeEnabled();
        await expect(this.animalTypeField).toBeEnabled();
        await expect(this.cattleBreedField).toBeEnabled();
    }

    /**
     * Get animal type options
     */
    async getAnimalTypeOptions() {
        return await this.animalTypeField.locator('[role="option"]').allTextContents();
    }

    /**
     * Get cattle breed options
     */
    async getCattleBreedOptions() {
        return await this.cattleBreedField.locator('[role="option"]').allTextContents();
    }
}
