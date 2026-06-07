import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for PublicationBeefProductionToSale component
 * Path: domains/production/views/beefProduction/PublicationBeefProductionToSale.tsx
 */
export class PublicationBeefProductionToSalePage {
    readonly page: Page;
    readonly title: Locator;
    readonly animalInfo: Locator;
    readonly slaughterDateInfo: Locator;
    readonly newSaleSwitch: Locator;
    readonly existingSaleSwitch: Locator;
    readonly saleSelection: Locator;
    readonly validateButton: Locator;
    readonly abandonButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Mise en vente de colis de viande de boeuf"]');
        this.animalInfo = page.locator('[data-testid="animal-info"]');
        this.slaughterDateInfo = page.locator('[data-testid="slaughter-date"]');
        this.newSaleSwitch = page.locator('text="Créer une nouvelle vente"');
        this.existingSaleSwitch = page.locator('text="Publier pour une vente existante"');
        this.saleSelection = page.locator('role=combobox[name="Vente sélectionnée"]');
        this.validateButton = page.locator('role=button[name=/Créer une nouvelle vente|Publier pour la vente sélectionnée/]');
        this.abandonButton = page.locator('role=button[name="Abandonner"]');
    }

    /**
     * Verify that the page is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.newSaleSwitch).toBeVisible();
        await expect(this.existingSaleSwitch).toBeVisible();
        await expect(this.validateButton).toBeVisible();
        await expect(this.abandonButton).toBeVisible();
    }

    /**
     * Verify animal info is displayed
     */
    async verifyAnimalInfoDisplayed(animalType: string, animalIdentifier: string) {
        await expect(this.page.locator(`text="${animalType} n°${animalIdentifier}"`)).toBeVisible();
    }

    /**
     * Verify slaughter date is displayed
     */
    async verifySlaughterDateDisplayed(date: string) {
        await expect(this.page.locator(`text="Découpée le ${date}"`)).toBeVisible();
    }

    /**
     * Set to create new sale
     */
    async setCreateNewSale() {
        const switchElement = this.page.locator('role=switch');
        const isChecked = await switchElement.isChecked();
        // Switch is for "Publier pour une vente existante", so we want it unchecked for new sale
        if (isChecked) {
            await this.existingSaleSwitch.click();
        }
    }

    /**
     * Set to publish to existing sale
     */
    async setPublishToExistingSale() {
        const switchElement = this.page.locator('role=switch');
        const isChecked = await switchElement.isChecked();
        if (!isChecked) {
            await this.existingSaleSwitch.click();
        }
    }

    /**
     * Select an existing sale by index
     */
    async selectExistingSale(index: number = 0) {
        await this.setPublishToExistingSale();
        const options = await this.saleSelection.locator('[role="option"]').all();
        await options[index].click();
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
     * Verify sale selection is visible
     */
    async verifySaleSelectionVisible() {
        await expect(this.saleSelection).toBeVisible();
    }

    /**
     * Verify sale selection is not visible
     */
    async verifySaleSelectionNotVisible() {
        await expect(this.saleSelection).not.toBeVisible();
    }

    /**
     * Verify validate button text for new sale
     */
    async verifyValidateButtonForNewSale() {
        await expect(this.validateButton).toHaveText('Créer une nouvelle vente');
    }

    /**
     * Verify validate button text for existing sale
     */
    async verifyValidateButtonForExistingSale() {
        await expect(this.validateButton).toHaveText('Publier pour la vente sélectionnée');
    }

    /**
     * Complete publication to new sale
     */
    async completePublicationToNewSale() {
        await this.setCreateNewSale();
        await this.clickValidate();
    }

    /**
     * Complete publication to existing sale
     */
    async completePublicationToExistingSale(saleIndex: number = 0) {
        await this.setPublishToExistingSale();
        await this.selectExistingSale(saleIndex);
        await this.clickValidate();
    }
}
