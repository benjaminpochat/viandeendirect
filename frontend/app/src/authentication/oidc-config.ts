import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

export const createOidcUserManager = () => {
  return new UserManager({
    authority: window.location.origin + '/realms/viandeendirect',
    client_id: 'viandeendirect-frontend',
    redirect_uri: window.location.origin + '/auth-callback',
    silent_redirect_uri: window.location.origin + '/silent-check-sso.html',
    post_logout_redirect_uri: window.location.origin + '/',
    response_type: 'code',
    scope: 'openid profile email roles',
    automaticSilentRenew: true,
    loadUserInfo: true,
    monitorSession: false,
    filterProtocolClaims: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    revokeAccessTokenOnSignout: true,
    includeIdTokenInSilentRenew: true,
    // Configuration spécifique pour Keycloak
    extraQueryParams: {
      kc_idp_hint: 'default'
    },
    // Configuration des endpoints (optionnelle, généralement détectée automatiquement)
    metadata: {
      issuer: window.location.origin + '/realms/viandeendirect',
      authorization_endpoint: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/auth',
      token_endpoint: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/token',
      userinfo_endpoint: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/userinfo',
      end_session_endpoint: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/logout',
      jwks_uri: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/certs'
    }
  });
};

export const oidcInitOptions = {
  checkLoginIframe: false,
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
};

export const getKeycloakToken = (user: any) => {
  // Dans oidc-client-ts v3.1.0, le token est dans user.access_token
  return user?.access_token || null;
};

export const getKeycloakTokenParsed = (user: any) => {
  // Dans v3.1.0, les claims décodés sont dans user.id_token_claims
  return user?.id_token_claims || user?.profile || null;
};

export const isAuthenticated = (user: any) => {
  // Dans v3.1.0, la vérification d'expiration utilise expires_at
  if (!user) return false;
  
  if (user.expired !== undefined) {
    return !user.expired;
  }
  
  // Vérification alternative avec expires_at
  if (user.expires_at) {
    const now = Math.floor(Date.now() / 1000);
    return user.expires_at > now;
  }
  
  return false;
};

export const getUsername = (user: any) => {
  // Priorité aux claims standard OIDC, puis aux claims Keycloak spécifiques
  return user?.profile?.preferred_username ||
         user?.id_token_claims?.preferred_username ||
         user?.profile?.email ||
         user?.id_token_claims?.email ||
         'unknown';
};

export const getRoles = (user: any) => {
  // Dans v3.1.0, les rôles peuvent être dans différents endroits
  // selon la configuration Keycloak
  const realmRoles = user?.profile?.realm_access?.roles || [];
  const resourceRoles = user?.profile?.resource_access?.['viandeendirect-frontend']?.roles || [];
  const idTokenRoles = user?.id_token_claims?.roles || [];
  
  // Fusionner et dédupliquer les rôles
  return [...new Set([...realmRoles, ...resourceRoles, ...idTokenRoles])];
};

export const hasRole = (user: any, role: string) => {
  const roles = getRoles(user);
  return roles.includes(role);
};

export const hasRealmRole = (user: any, role: string) => {
  const realmRoles = user?.profile?.realm_access?.roles || [];
  return realmRoles.includes(role);
};

export const hasResourceRole = (user: any, role: string, resource: string = 'viandeendirect-frontend') => {
  const resourceRoles = user?.profile?.resource_access?.[resource]?.roles || [];
  return resourceRoles.includes(role);
};