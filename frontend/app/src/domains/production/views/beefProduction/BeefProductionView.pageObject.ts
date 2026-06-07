import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for BeefProductionView component
 * Path: domains/production/views/beefProduction/BeefProductionView.tsx
 */
export class BeefProductionViewPage {
    readonly page: Page;
    readonly title: Locator;
    readonly tabs: Locator;
    readonly elevationTab: Locator;
    readonly slaughterTab: Locator;
    readonly cuttingTab: Locator;
    readonly packagesTab: Locator;
    
    // Tab content
    readonly breedingForm: Locator;
    readonly slaughterForm: Locator;
    readonly cuttingForm: Locator;
    readonly packagesCreator: Locator;
    
    // Buttons
    readonly backButton: Locator;
    readonly editButton: Locator;
    readonly saveButton: Locator;
    readonly abandonButton: Locator;
    
    // Alert
    readonly alert: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Colis de viande de boeuf"]');
        this.tabs = page.locator('role=tablist');
        this.elevationTab = page.locator('role=tab[name="Elevage"]');
        this.slaughterTab = page.locator('role=tab[name="Abattage"]');
        this.cuttingTab = page.locator('role=tab[name="Découpe"]');
        this.packagesTab = page.locator('role=tab[name="Colis"]');
        
        this.breedingForm = page.locator('BreedingPropertiesForm');
        this.slaughterForm = page.locator('SlaughterPropertiesForm');
        this.cuttingForm = page.locator('CuttingPropertiesForm');
        this.packagesCreator = page.locator('PackageLotsCreator');
        
        this.backButton = page.locator('role=button[name="Retour"]');
        this.editButton = page.locator('role=button[name="Modifier"]');
        this.saveButton = page.locator('role=button[name="Sauvegarder"]');
        this.abandonButton = page.locator('role=button[name="Abandonner"]');
        
        this.alert = page.locator('role=alert');
    }

    /**
     * Verify that the page is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.tabs).toBeVisible();
    }

    /**
     * Click on a specific tab
     */
    async clickTab(tabName: 'Elevage' | 'Abattage' | 'Découpe' | 'Colis') {
        switch (tabName) {
            case 'Elevage':
                await this.elevationTab.click();
                break;
            case 'Abattage':
                await this.slaughterTab.click();
                break;
            case 'Découpe':
                await this.cuttingTab.click();
                break;
            case 'Colis':
                await this.packagesTab.click();
                break;
        }
    }

    /**
     * Verify elevation tab is visible
     */
    async verifyElevationTabVisible() {
        await expect(this.elevationTab).toBeVisible();
    }

    /**
     * Verify slaughter tab is visible
     */
    async verifySlaughterTabVisible() {
        await expect(this.slaughterTab).toBeVisible();
    }

    /**
     * Verify cutting tab is visible
     */
    async verifyCuttingTabVisible() {
        await expect(this.cuttingTab).toBeVisible();
    }

    /**
     * Verify packages tab is visible
     */
    async verifyPackagesTabVisible() {
        await expect(this.packagesTab).toBeVisible();
    }

    /**
     * Click edit button
     */
    async clickEdit() {
        await this.editButton.click();
    }

    /**
     * Click save button
     */
    async clickSave() {
        await this.saveButton.click();
    }

    /**
     * Click abandon button
     */
    async clickAbandon() {
        await this.abandonButton.click();
    }

    /**
     * Click back button
     */
    async clickBack() {
        await this.backButton.click();
    }

    /**
     * Verify alert is displayed with error message
     */
    async verifyErrorAlertDisplayed(message: string) {
        await expect(this.alert).toBeVisible();
        await expect(this.alert).toHaveText(message);
    }

    /**
     * Verify alert is not displayed
     */
    async verifyNoAlert() {
        await expect(this.alert).not.toBeVisible();
    }

    /**
     * Verify form is in read-only mode
     */
    async verifyReadOnlyMode() {
        await expect(this.editButton).toBeVisible();
        await expect(this.saveButton).not.toBeVisible();
        await expect(this.abandonButton).not.toBeVisible();
    }

    /**
     * Verify form is in edit mode
     */
    async verifyEditMode() {
        await expect(this.saveButton).toBeVisible();
        await expect(this.abandonButton).toBeVisible();
        await expect(this.editButton).not.toBeVisible();
    }

    /**
     * Fill breeding form fields
     */
    async fillBreedingForm(fields: {
        birthDate?: string;
        birthFarm?: string;
        birthPlace?: string;
        animalIdentifier?: string;
        animalType?: string;
        cattleBreed?: string;
        labelRougeCertified?: boolean;
    }) {
        if (fields.birthDate) await this.breedingForm.locator('[name="birthDate"]').fill(fields.birthDate);
        if (fields.birthFarm) await this.breedingForm.locator('[name="birthFarm"]').fill(fields.birthFarm);
        if (fields.birthPlace) await this.breedingForm.locator('[name="birthPlace"]').fill(fields.birthPlace);
        if (fields.animalIdentifier) await this.breedingForm.locator('[name="animalIdentifier"]').fill(fields.animalIdentifier);
        if (fields.animalType) await this.breedingForm.locator('[name="animalType"]').selectOption(fields.animalType);
        if (fields.cattleBreed) await this.breedingForm.locator('[name="cattleBreed"]').selectOption(fields.cattleBreed);
        if (fields.labelRougeCertified !== undefined) {
            const checkbox = this.breedingForm.locator('[name="labelRougeCertified"]');
            if (fields.labelRougeCertified) {
                await checkbox.check();
            } else {
                await checkbox.uncheck();
            }
        }
    }

    /**
     * Fill slaughter form fields
     */
    async fillSlaughterForm(fields: {
        slaughterDate?: string;
        slaughterHouse?: string;
        slaughterPlace?: string;
        warmCarcassWeight?: number;
    }) {
        if (fields.slaughterDate) await this.slaughterForm.locator('[name="slaughterDate"]').fill(fields.slaughterDate);
        if (fields.slaughterHouse) await this.slaughterForm.locator('[name="slaughterHouse"]').fill(fields.slaughterHouse);
        if (fields.slaughterPlace) await this.slaughterForm.locator('[name="slaughterPlace"]').fill(fields.slaughterPlace);
        if (fields.warmCarcassWeight !== undefined) {
            await this.slaughterForm.locator('[name="warmCarcassWeight"]').fill(String(fields.warmCarcassWeight));
        }
    }

    /**
     * Fill cutting form fields
     */
    async fillCuttingForm(fields: {
        cuttingDate?: string;
        cuttingButcher?: string;
        cuttingPlace?: string;
    }) {
        if (fields.cuttingDate) await this.cuttingForm.locator('[name="cuttingDate"]').fill(fields.cuttingDate);
        if (fields.cuttingButcher) await this.cuttingForm.locator('[name="cuttingButcher"]').fill(fields.cuttingButcher);
        if (fields.cuttingPlace) await this.cuttingForm.locator('[name="cuttingPlace"]').fill(fields.cuttingPlace);
    }
}
