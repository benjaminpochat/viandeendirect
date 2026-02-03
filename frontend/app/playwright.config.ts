import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration de Playwright pour les tests end-to-end avec support Testcontainers
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  // Global setup and teardown for Testcontainers
  globalSetup: './tests/e2e/testcontainers/global-setup.ts',
  globalTeardown: './tests/e2e/testcontainers/global-teardown.ts',
  
  /* Maximum time one test can run for. */
  timeout: 120 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     */
    timeout: 10000
  },
  
  /* Run tests in files in parallel - disabled for Testcontainers */
  fullyParallel: false,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only - increased for container stability */
  retries: process.env.CI ? 2 : 1,
  
  /* Opt out of parallel tests on CI. */
  workers: 1, // Single worker for container tests
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Authentication state */
    storageState: 'tests/e2e/authSetup.json',
    
    /* Viewport configuration */
    viewport: { width: 1920, height: 1080 },
    
    /* Screenshot and video configuration */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  /* Disable local web server when using Testcontainers */
  webServer: process.env.USE_TESTCONTAINERS ? undefined : {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});