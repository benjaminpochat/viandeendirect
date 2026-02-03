import { useAuth } from 'react-oidc-context';
import { getKeycloakToken, getKeycloakTokenParsed, isAuthenticated, getUsername, getRoles, hasRole } from './oidc-config';

export const useKeycloak = () => {
  const auth = useAuth();
  
  // Adapter pour maintenir la compatibilité avec l'ancien code
  // Note: Dans oidc-client-ts v3.1.0, la structure des données a changé
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
        // Dans v3.1.0, les données utilisateur sont dans auth.user.profile
        return auth.user.profile;
      }
      return null;
    },
    updateToken: async (minValidity?: number) => {
      if (auth.user) {
        // Vérifier si le token est sur le point d'expirer
        const expiresIn = auth.user.expires_at ? auth.user.expires_at - Math.floor(Date.now() / 1000) : 0;
        
        if (minValidity === undefined || expiresIn < minValidity) {
          try {
            // Utiliser la nouvelle méthode signinSilent de v3.1.0
            await auth.signinSilent();
            return true;
          } catch (error) {
            console.error('Token update failed:', error);
            return false;
          }
        }
      }
      return true;
    },
    clearToken: () => {
      // Utiliser la nouvelle méthode removeUser de v3.1.0
      auth.removeUser();
    },
    // Nouvelle méthode pour v3.1.0 - accès direct au user manager
    getUserManager: () => auth.userManager
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