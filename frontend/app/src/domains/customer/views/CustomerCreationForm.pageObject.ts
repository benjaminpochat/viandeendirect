import { Locator, Page, expect } from '@playwright/test';

/**
 * Page Object for CustomerCreationForm component
 * Path: domains/customer/views/CustomerCreationForm.tsx
 */
export class CustomerCreationFormPage {
    readonly page: Page;
    readonly title: Locator;
    readonly form: Locator;
    readonly lastNameField: Locator;
    readonly firstNameField: Locator;
    readonly emailField: Locator;
    readonly phoneField: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('role=heading[name="Vos coordonnées"]');
        this.form = page.locator('form');
        this.lastNameField = page.locator('[name="lastName"]');
        this.firstNameField = page.locator('[name="firstName"]');
        this.emailField = page.locator('[name="email"]');
        this.phoneField = page.locator('[name="phone"]');
        this.submitButton = page.locator('role=button[name="Valider"]');
    }

    /**
     * Verify that the form is loaded
     */
    async verifyPageLoaded() {
        await expect(this.title).toBeVisible();
        await expect(this.lastNameField).toBeVisible();
        await expect(this.firstNameField).toBeVisible();
        await expect(this.emailField).toBeVisible();
        await expect(this.phoneField).toBeVisible();
        await expect(this.submitButton).toBeVisible();
    }

    /**
     * Fill the phone field
     */
    async fillPhone(phone: string) {
        await this.phoneField.fill(phone);
    }

    /**
     * Verify that fields are pre-filled with customer data
     */
    async verifyPreFilledData(lastName: string, firstName: string, email: string) {
        await expect(this.lastNameField).toHaveValue(lastName);
        await expect(this.firstNameField).toHaveValue(firstName);
        await expect(this.emailField).toHaveValue(email);
    }

    /**
     * Verify that name and email fields are disabled
     */
    async verifyNameAndEmailDisabled() {
        await expect(this.lastNameField).toBeDisabled();
        await expect(this.firstNameField).toBeDisabled();
        await expect(this.emailField).toBeDisabled();
    }

    /**
     * Submit the form
     */
    async submit() {
        await this.submitButton.click();
    }

    /**
     * Fill and submit the form
     */
    async fillAndSubmit(phone: string) {
        await this.fillPhone(phone);
        await this.submit();
    }
}
