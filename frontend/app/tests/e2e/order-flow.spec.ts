import { test, expect, step } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { HomePage } from './pageObjects/HomePage';
import { SalePage, PackageSelector, OrderStepper } from './pageObjects/SalePage';
import { AuthenticationStep, ConditionsStep, PaymentStep, OrderFormActions } from './pageObjects/OrderSteps';

// Configuration pour le test
test.use({
  baseURL: 'http://localhost:3000', // URL de votre application frontend
  storageState: 'tests/e2e/authSetup.json' // État d'authentification sauvé
});

test.describe('Scénarios de passage de commande', () => {
  let saleId: string;
  let productName: string;
  let productPrice: string;

  test.beforeAll(async ({ browser }) => {
    // Charger les données de test préparées par le script de setup
    const testDataPath = path.join(__dirname, 'testData.json');
    const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
    saleId = testData.saleId;
    
    // Setup: Authentification avant les tests
    const page = await browser.newPage();
    await page.goto('/login');
    
    // Remplacez par des identifiants de test valides
    await page.fill('input[name="username"]', 'client-test@example.com');
    await page.fill('input[name="password"]', 'motdepasse123');
    await page.click('button[type="submit"]');
    
    // Attendre la redirection après login
    await page.waitForURL('/');
    
    // Sauvegarder l'état d'authentification
    await page.context().storageState({ path: 'tests/e2e/authSetup.json' });
    await page.close();
  });

  test('Passage de commande complet - de la sélection du produit au paiement', async ({ page }) => {
    await step('Accéder à la page d\'accueil et vérifier la connexion', async () => {
      const homePage = new HomePage(page);
      await homePage.navigate();
      await expect(homePage.welcomeMessage).toBeVisible();
    });
    
    await step('Naviguer vers une vente disponible', async () => {
      const salePage = new SalePage(page);
      await salePage.navigate(saleId);
      await expect(salePage.orderTitle).toBeVisible();
      saleId = await salePage.getCurrentSaleId();
    });
    
    await step('Sélectionner un produit dans le PackageSelector', async () => {
      const salePage = new SalePage(page);
      const packageSelector = salePage.packageSelector;
      productName = await packageSelector.getPackageName(0);
      productPrice = await packageSelector.getPackagePrice(0);
      await packageSelector.incrementQuantity(0);
    });
    
    await step('Valider les articles sélectionnés', async () => {
      const orderActions = new OrderFormActions(page);
      await expect(orderActions.validateItemsButton).toBeEnabled();
      await orderActions.validateItems();
    });
    
    await step('Authentification et continuation', async () => {
      const authStep = new AuthenticationStep(page);
      await expect(authStep.authenticationTitle).toBeVisible();
      await authStep.continueWithAccount();
    });
    
    await step('Accepter les conditions générales', async () => {
      const conditionsStep = new ConditionsStep(page);
      await expect(conditionsStep.conditionsTitle).toBeVisible();
      await conditionsStep.acceptConditions();
      await conditionsStep.validateConditions();
    });
    
    await step('Paiement de la commande', async () => {
      const paymentStep = new PaymentStep(page);
      await expect(paymentStep.paymentTitle).toBeVisible();
      await paymentStep.payOrder();
    });
    
    // Note: En environnement de test, vous devrez peut-être mock la redirection Stripe
    // ou utiliser un webhook pour simuler le paiement réussi
  });

  test('Vérification du formulaire de commande - sélection des articles', async ({ page }) => {
    await step('Accéder à la page de vente', async () => {
      const salePage = new SalePage(page);
      await salePage.navigate(saleId);
      await expect(salePage.orderTitle).toBeVisible();
    });
    
    await step('Vérifier le Stepper et ses étapes', async () => {
      const salePage = new SalePage(page);
      const stepper = salePage.orderStepper;
      const stepCount = await stepper.getStepCount();
      expect(stepCount).toBe(4);
      
      const isFirstStepActive = await stepper.isStepActive(0);
      expect(isFirstStepActive).toBe(true);
    });
    
    await step('Vérifier l\'affichage des packages', async () => {
      const salePage = new SalePage(page);
      const packageCount = await salePage.packageSelector.getPackageCount();
      expect(packageCount).toBeGreaterThan(0);
    });
    
    await step('Vérifier l\'état initial du bouton de validation', async () => {
      const orderActions = new OrderFormActions(page);
      await expect(orderActions.validateItemsButton).toBeDisabled();
    });
  });

  test('Validation des étapes du formulaire', async ({ page }) => {
    await step('Sélectionner un article et valider', async () => {
      const salePage = new SalePage(page);
      await salePage.navigate(saleId);
      await salePage.packageSelector.incrementQuantity(0);
      
      const orderActions = new OrderFormActions(page);
      await orderActions.validateItems();
    });
    
    await step('Vérifier l\'étape d\'authentification', async () => {
      const salePage = new SalePage(page);
      const authStep = new AuthenticationStep(page);
      await expect(authStep.authenticationTitle).toBeVisible();
      
      const isAuthStepActive = await salePage.orderStepper.isStepActive(1);
      expect(isAuthStepActive).toBe(true);
      
      await authStep.continueWithAccount();
    });
    
    await step('Vérifier l\'étape des conditions générales', async () => {
      const salePage = new SalePage(page);
      const conditionsStep = new ConditionsStep(page);
      await expect(conditionsStep.conditionsTitle).toBeVisible();
      
      const isConditionsStepActive = await salePage.orderStepper.isStepActive(2);
      expect(isConditionsStepActive).toBe(true);
      
      const isValidationButtonEnabled = await conditionsStep.isValidationButtonEnabled();
      expect(isValidationButtonEnabled).toBe(false);
      
      await conditionsStep.acceptConditions();
      expect(await conditionsStep.isValidationButtonEnabled()).toBe(true);
      await conditionsStep.validateConditions();
    });
    
    await step('Vérifier l\'étape de paiement', async () => {
      const salePage = new SalePage(page);
      const paymentStep = new PaymentStep(page);
      await expect(paymentStep.paymentTitle).toBeVisible();
      
      const isPaymentStepActive = await salePage.orderStepper.isStepActive(3);
      expect(isPaymentStepActive).toBe(true);
    });
  });

  test('Annulation de commande', async ({ page }) => {
    await step('Accéder à la page de vente et ajouter un article', async () => {
      const salePage = new SalePage(page);
      await salePage.navigate(saleId);
      await salePage.packageSelector.incrementQuantity(0);
    });
    
    await step('Annuler la commande', async () => {
      const orderActions = new OrderFormActions(page);
      await orderActions.cancelOrder();
    });
    
    await step('Vérifier la redirection vers la page d\'accueil', async () => {
      await expect(page).toHaveURL('/');
    });
  });

  test('Gestion des quantités dans le panier', async ({ page }) => {
    await step('Accéder à la page de vente', async () => {
      const salePage = new SalePage(page);
      await salePage.navigate(saleId);
    });
    
    await step('Vérifier la quantité initiale', async () => {
      const salePage = new SalePage(page);
      const packageSelector = salePage.packageSelector;
      const initialQuantity = await packageSelector.getQuantityDisplay(0);
      expect(initialQuantity).toBe('0');
    });
    
    await step('Augmenter la quantité', async () => {
      const salePage = new SalePage(page);
      const packageSelector = salePage.packageSelector;
      await packageSelector.incrementQuantity(0);
      const quantityAfterIncrement = await packageSelector.getQuantityDisplay(0);
      expect(quantityAfterIncrement).toBe('1');
    });
    
    await step('Diminuer la quantité', async () => {
      const salePage = new SalePage(page);
      const packageSelector = salePage.packageSelector;
      await packageSelector.decrementQuantity(0);
      const quantityAfterDecrement = await packageSelector.getQuantityDisplay(0);
      expect(quantityAfterDecrement).toBe('0');
    });
    
    await step('Vérifier l\'état du bouton de validation', async () => {
      const orderActions = new OrderFormActions(page);
      await expect(orderActions.validateItemsButton).toBeDisabled();
    });
  });
});


