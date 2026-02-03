import { useAuth } from 'react-oidc-context';
import { getKeycloakToken, getKeycloakTokenParsed, isAuthenticated, getUsername, getRoles, hasRole } from './oidc-config';

export const useKeycloak = () => {
  const auth = useAuth();
  
  // Adapter pour maintenir la compatibilité avec l'ancien code
  const keycloak = {
    authenticated: isAuthenticated(auth.user),
    token: getKeycloakToken(auth.user),
    tokenParsed: getKeycloakTokenParsed(auth.user),
    userInfo: auth.user?.profile,
    username: getUsername(auth.user),
    roles: getRoles(auth.user),
    hasRealmRole: (role: string) => hasRole(auth.user, role),
    hasResourceRole: (role: string, resource?: string) => hasRole(auth.user, role),
    login: () => auth.signinRedirect(),
    logout: () => auth.signoutRedirect(),
    register: () => auth.signinRedirect(),
    accountManagement: () => {
      // Rediriger vers l'interface de gestion de compte Keycloak
      window.location.href = `${window.location.origin}/realms/viandeendirect/account`;
    },
    loadUserProfile: async () => {
      if (auth.user) {
        return auth.user.profile;
      }
      return null;
    },
    updateToken: async (minValidity?: number) => {
      if (auth.user && (minValidity === undefined || auth.user.expires_in < minValidity)) {
        try {
          await auth.signinSilent();
          return true;
        } catch (error) {
          console.error('Token update failed:', error);
          return false;
        }
      }
      return true;
    },
    clearToken: () => {
      auth.removeUser();
    }
  };
  
  return { keycloak, initialized: auth.isLoading === false };
};

export const KeycloakAdapter = {
  init: (initOptions: any) => {
    // Cette méthode est appelée par ReactKeycloakProvider
    // Avec react-oidc-context, l'initialisation est gérée automatiquement
    console.log('Keycloak adapter initialized with options:', initOptions);
    return Promise.resolve();
  }
};