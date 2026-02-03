// Setup global pour Vitest
import { expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Étendre les matchers de Vitest avec jest-dom
expect.extend({
  toBeInTheDocument: (received: HTMLElement | null) => {
    if (received === null) {
      return {
        pass: false,
        message: () => 'Expected element to be in the document, but it is null',
      };
    }
    return {
      pass: true,
      message: () => 'Element is in the document',
    };
  },
});

// Configuration globale des mocks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
  };
});

// Mock pour l'authentification
global.mockUseKeycloak = () => ({
  keycloak: {
    authenticated: true,
    token: 'mock-token',
    tokenParsed: { preferred_username: 'testuser', email: 'test@example.com' },
    userInfo: { preferred_username: 'testuser', email: 'test@example.com' },
    username: 'testuser',
    roles: ['user'],
    hasRealmRole: vi.fn((role) => role === 'user'),
    hasResourceRole: vi.fn((role) => role === 'user'),
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    accountManagement: vi.fn(),
    loadUserProfile: vi.fn().mockResolvedValue({ preferred_username: 'testuser' }),
    updateToken: vi.fn().mockResolvedValue(true),
    clearToken: vi.fn(),
  },
  initialized: true,
});

// Configuration des tests
beforeEach(() => {
  // Réinitialiser les mocks avant chaque test
  vi.restoreAllMocks();
});

afterEach(() => {
  // Nettoyer après chaque test
  cleanup();
});

// Configuration globale
globalThis.IS_REACT_ACT_ENVIRONMENT = true;