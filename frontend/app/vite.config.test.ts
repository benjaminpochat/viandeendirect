import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    })
  ],
  
  test: {
    // Configuration globale des tests
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    
    // Configuration des fichiers de test
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Configuration des rapports
    reporters: ['default', 'html'],
    outputFile: 'test-results/vitest-results.html',
    
    // Configuration de la couverture de code
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'test-results/coverage',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}', 'src/test/', 'src/mocks/'],
    },
    
    // Configuration des mocks
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    
    // Configuration des alias (doit correspondre à vite.config.ts)
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@auth': path.resolve(__dirname, 'src/authentication'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@domains': path.resolve(__dirname, 'src/domains'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@resources': path.resolve(__dirname, 'src/resources')
    },
    
    // Configuration des threads
    threads: true,
    isolate: true,
    
    // Configuration des timeouts
    testTimeout: 30000,
    hookTimeout: 30000,
    
    // Configuration des snapshots
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
    
    // Configuration pour les tests E2E (si nécessaire)
    browser: {
      enabled: false,
      name: 'chromium',
      headless: true,
    },
    
    // Configuration des variables d'environnement pour les tests
    env: {
      NODE_ENV: 'test',
      VITE_APP_MOCK_API: 'true',
      VITE_APP_DEBUG_MODE: 'false',
    },
    
    // Configuration des fichiers de configuration
    config: './vite.config.test.ts',
  },
  
  // Configuration de la build pour les tests
  build: {
    outDir: 'test-results/build',
    emptyOutDir: true,
    minify: false,
    sourcemap: 'inline',
  },
  
  // Désactiver le serveur de développement pour les tests
  server: {
    port: 3001,
  },
})