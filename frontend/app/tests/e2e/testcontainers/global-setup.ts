import { setupTestEnvironment } from './test-environment';
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  console.log('Starting test environment setup...');
  
  // Démarrer l'environnement de test
  const testEnv = await setupTestEnvironment();
  console.log(`Test environment started. Frontend URL: ${testEnv.getFrontendUrl()}`);

  // Configurer l'URL du frontend pour les tests
  process.env.FRONTEND_URL = testEnv.getFrontendUrl();
  process.env.BACKEND_URL = testEnv.getBackendUrl();

  // Setup d'authentification
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log(`Navigating to login page: ${testEnv.getFrontendUrl()}/login`);
    await page.goto(`${testEnv.getFrontendUrl()}/login`);

    // Authentification pour générer le storageState
    console.log('Performing authentication...');
    await page.fill('input[name="username"]', 'client-test@example.com');
    await page.fill('input[name="password"]', 'motdepasse123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    console.log('Authentication successful, saving storage state...');
    // Sauvegarder l'état d'authentification
    const authDir = path.join(__dirname, '..');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }
    
    await page.context().storageState({ path: path.join(__dirname, '../authSetup.json') });
    console.log('Storage state saved successfully.');
    
  } catch (error) {
    console.error('Authentication setup failed:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('Global setup completed.');
  }
}

export default globalSetup;