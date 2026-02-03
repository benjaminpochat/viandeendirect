// Configuration des variables d'environnement pour Vite
// Vite utilise le préfixe VITE_ pour exposer les variables au code client

interface EnvConfig {
  app: {
    title: string;
    version: string;
    env: string;
    mode: string;
    debug: boolean;
    mockApi: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  auth: {
    keycloakUrl: string;
    realm: string;
    clientId: string;
  };
}

export const envConfig: EnvConfig = {
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'ViandeEnDirect',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    env: import.meta.env.VITE_APP_ENV || 'development',
    mode: import.meta.env.VITE_APP_MODE || 'CUSTOMER',
    debug: import.meta.env.VITE_APP_DEBUG_MODE === 'true',
    mockApi: import.meta.env.VITE_APP_MOCK_API === 'true',
  },
  api: {
    baseUrl: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8080',
    timeout: parseInt(import.meta.env.VITE_APP_API_TIMEOUT || '30000'),
  },
  auth: {
    keycloakUrl: import.meta.env.VITE_APP_KEYCLOAK_URL || 'http://localhost:8080',
    realm: import.meta.env.VITE_APP_KEYCLOAK_REALM || 'viandeendirect',
    clientId: import.meta.env.VITE_APP_KEYCLOAK_CLIENT_ID || 'viandeendirect-frontend',
  },
};

// Fonction pour accéder facilement à la configuration
export const getEnv = (): EnvConfig => envConfig;

// Vérification que l'environnement est correctement configuré
export const validateEnv = (): void => {
  const requiredVars = [
    'VITE_APP_API_BASE_URL',
    'VITE_APP_KEYCLOAK_URL',
    'VITE_APP_KEYCLOAK_REALM',
    'VITE_APP_KEYCLOAK_CLIENT_ID',
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
  }

  if (envConfig.app.debug) {
    console.log('📋 Environment Configuration:', envConfig);
  }
};

// Initialiser la validation au chargement
default validateEnv();