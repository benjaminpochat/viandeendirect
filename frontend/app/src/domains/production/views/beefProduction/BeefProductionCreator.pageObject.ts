import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for BeefProductionCreator component
 * Path: domains/production/views/beefProduction/BeefProductionCreator.tsx
 */
export class BeefProductionCreatorPage {
    readonly page: Page;
    readonly title: Locator;
    readonly stepper: Locator;
    
    // Steps
    readonly breedingStep: Locator;
    readonly breedingStepButton: Locator;
    readonly breedingStepContent: Locator;
    readonly slaughterStep: Locator;
    readonly slaughterStepButton: Locator;
    readonly slaughterStepContent: Locator;
    readonly cuttingStep: Locator;
    readonly cuttingStepButton: Locator;
    readonly cuttingStepContent: Locator;
    readonly productsStep: Locator;
    readonly productsStepButton: Locator;
    readonly productsStepContent: Locator;
    
    // Breeding form elements
    readonly birthDateField: Locator;
    readonly birthFarmField: Locator;
    readonly birthPlaceField: Locator;
    readonly animalIdentifierField: Locator;
    readonly animalTypeField: Locator;
    readonly cattleBreedField: Locator;
    readonly labelRougeCheckbox: Locator;
    
    // Slaughter form elements
    readonly slaughterDateField: Locator;
    readonly slaughterHouseField: Locator;
    readonly slaughterPlaceField: Locator;
    readonly warmCarcassWeightSlider: Locator;
    
    // Cutting form elements
    readonly cuttingDateField: Locator;
    readonly cuttingButcherField: Locator;
    readonly cuttingPlaceField: Locator;
    
    // Products form elements
    readonly packageLotsCreator: Locator;
    
    // Common buttons
    readonly validateButton: Locator;
    readonly abandonButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Nouvelle production de colis de viande de boeuf"]');
        this.stepper = page.locator('role=region[name="stepper"]');
        
        // Step 1: Breeding
        this.breedingStep = page.locator('text="Informations sur l\'élevage"');
        this.breedingStepButton = page.locator('role=button[name="Informations sur l\'élevage"]');
        this.breedingStepContent = page.locator('BreedingPropertiesForm');
        
        // Step 2: Slaughter
        this.slaughterStep = page.locator('text="Informations sur l\'abattage"');
        this.slaughterStepButton = page.locator('role=button[name="Informations sur l\'abattage"]');
        this.slaughterStepContent = page.locator('SlaughterPropertiesForm');
        
        // Step 3: Cutting
        this.cuttingStep = page.locator('text="Informations sur la découpe"');
        this.cuttingStepButton = page.locator('role=button[name="Informations sur la découpe"]');
        this.cuttingStepContent = page.locator('CuttingPropertiesForm');
        
        // Step 4: Products
        this.productsStep = page.locator('text="Produits préparés"');
        this.productsStepButton = page.locator('role=button[name="Produits préparés"]');
        this.productsStepContent = page.locator('PackageLotsCreator');
        
        // Breeding form fields
        this.birthDateField = page.locator('[name="birthDate"]');
        this.birthFarmField = page.locator('[name="birthFarm"]');
        this.birthPlaceField = page.locator('[name="birthPlace"]');
        this.animalIdentifierField = page.locator('[name="animalIdentifier"]');
        this.animalTypeField = page.locator('[name="animalType"]');
        this.cattleBreedField = page.locator('[name="cattleBreed"]');
        this.labelRougeCheckbox = page.locator('[name="labelRougeCertified"]');
        
        // Slaughter form fields
        this.slaughterDateField = page.locator('[name="slaughterDate"]');
        this.slaughterHouseField = page.locator('[name="slaughterHouse"]');
        this.slaughterPlaceField = page.locator('[name="slaughterPlace"]');
        this.warmCarcassWeightSlider = page.locator('[name="warmCarcassWeight"]');
        
        // Cutting form fields
        this.cuttingDateField = page.locator('[name="cuttingDate"]');
        this.cuttingButcherField = page.locator('[name="cuttingButcher"]');
        this.cuttingPlaceField = page.locator('[name="cuttingPlace"]');
        
        // Products
        this.packageLotsCreator = page.locator('PackageLotsCreator');
        
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
     * Verify breeding step is active
     */
    async verifyBreedingStepActive() {
        await expect(this.breedingStep).toBeVisible();
        await expect(this.breedingStepContent).toBeVisible();
    }

    /**
     * Fill breeding properties
     */
    async fillBreedingProperties(properties: {
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
     * Fill slaughter properties
     */
    async fillSlaughterProperties(properties: {
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
     * Fill cutting properties
     */
    async fillCuttingProperties(properties: {
        cuttingDate: string;
        cuttingButcher: string;
        cuttingPlace: string;
    }) {
        await this.cuttingDateField.fill(properties.cuttingDate);
        await this.cuttingButcherField.fill(properties.cuttingButcher);
        await this.cuttingPlaceField.fill(properties.cuttingPlace);
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
     * Submit breeding step
     */
    async submitBreedingStep(properties: {
        birthDate: string;
        birthFarm: string;
        birthPlace: string;
        animalIdentifier: string;
        animalType: string;
        cattleBreed: string;
        labelRougeCertified?: boolean;
    }) {
        await this.fillBreedingProperties(properties);
        await this.clickValidate();
    }

    /**
     * Submit slaughter step
     */
    async submitSlaughterStep(properties: {
        slaughterDate: string;
        slaughterHouse: string;
        slaughterPlace: string;
        warmCarcassWeight: number;
    }) {
        await this.fillSlaughterProperties(properties);
        await this.clickValidate();
    }

    /**
     * Submit cutting step
     */
    async submitCuttingStep(properties: {
        cuttingDate: string;
        cuttingButcher: string;
        cuttingPlace: string;
    }) {
        await this.fillCuttingProperties(properties);
        await this.clickValidate();
    }

    /**
     * Verify step is completed and next step is active
     */
    async verifyStepCompleted(stepIndex: number) {
        const steps = await this.page.locator('[role="tab"]').all();
        await expect(steps[stepIndex]).toHaveAttribute('aria-selected', 'true');
    }

    /**
     * Complete the entire production creation
     */
    async completeForm(
        breeding: {
            birthDate: string;
            birthFarm: string;
            birthPlace: string;
            animalIdentifier: string;
            animalType: string;
            cattleBreed: string;
            labelRougeCertified?: boolean;
        },
        slaughter: {
            slaughterDate: string;
            slaughterHouse: string;
            slaughterPlace: string;
            warmCarcassWeight: number;
        },
        cutting: {
            cuttingDate: string;
            cuttingButcher: string;
            cuttingPlace: string;
        }
    ) {
        await this.submitBreedingStep(breeding);
        await this.submitSlaughterStep(slaughter);
        await this.submitCuttingStep(cutting);
        await this.clickValidate();
    }

    /**
     * Set quantity for a package lot
     */
    async setPackageLotQuantity(index: number, quantity: number) {
        const configurators = await this.packageLotsCreator.locator('PackageLotConfigurator').all();
        await configurators[index].locator('[role="spinbutton"]').fill(String(quantity));
    }

    /**
     * Verify step label contains expected text
     */
    async verifyBreedingStepLabelContains(text: string) {
        await expect(this.breedingStepButton).toContainText(text);
    }

    /**
     * Verify slaughter step label contains expected text
     */
    async verifySlaughterStepLabelContains(text: string) {
        await expect(this.slaughterStepButton).toContainText(text);
    }

    /**
     * Verify cutting step label contains expected text
     */
    async verifyCuttingStepLabelContains(text: string) {
        await expect(this.cuttingStepButton).toContainText(text);
    }
}
