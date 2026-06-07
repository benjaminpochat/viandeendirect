import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for PackageLotsCreator component
 * Path: domains/production/views/PackageLotsCreator.tsx
 */
export class PackageLotsCreatorPage {
    readonly page: Page;
    readonly alert: Locator;
    readonly packageLotConfigurators: Locator;

    constructor(page: Page) {
        this.page = page;
        this.alert = page.locator('role=alert');
        this.packageLotConfigurators = page.locator('PackageLotConfigurator');
    }

    /**
     * Verify that the component is loaded
     */
    async verifyComponentLoaded() {
        await expect(this.packageLotConfigurators).toBeVisible();
    }

    /**
     * Verify error alert is displayed when total quantity exceeds meat weight
     */
    async verifyErrorAlertDisplayed(meatQuantity: number) {
        await expect(this.alert).toBeVisible();
        await expect(this.alert).toHaveText(/Le poids total des produits préparés ne doit pas dépasser la quantité de viande de l'animal estimée à \d+ kg\./);
    }

    /**
     * Verify no error alert is displayed
     */
    async verifyNoErrorAlert() {
        await expect(this.alert).not.toBeVisible();
    }

    /**
     * Get all package lot configurator elements
     */
    async getPackageLotConfigurators() {
        return await this.packageLotConfigurators.all();
    }

    /**
     * Verify the number of package lots
     */
    async verifyPackageLotsCount(count: number) {
        const lots = await this.getPackageLotConfigurators();
        await expect(lots).toHaveLength(count);
    }
}
