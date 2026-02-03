import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

export const createOidcUserManager = () => {
  return new UserManager({
    authority: window.location.origin + '/config/keycloak.json',
    client_id: 'viandeendirect-frontend',
    redirect_uri: window.location.origin + '/auth-callback',
    silent_redirect_uri: window.location.origin + '/silent-check-sso.html',
    response_type: 'code',
    scope: 'openid profile email',
    automaticSilentRenew: true,
    loadUserInfo: true,
    monitorSession: false,
    filterProtocolClaims: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    revokeAccessTokenOnSignout: true,
    // Map Keycloak specific claims
    metadata: {
      issuer: window.location.origin + '/realms/viandeendirect',
      authorization_endpoint: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/auth',
      token_endpoint: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/token',
      userinfo_endpoint: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/userinfo',
      end_session_endpoint: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/logout'
    }
  });
};

export const oidcInitOptions = {
  checkLoginIframe: false,
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
};

export const getKeycloakToken = (user: any) => {
  return user?.access_token || null;
};

export const getKeycloakTokenParsed = (user: any) => {
  return user?.profile || null;
};

export const isAuthenticated = (user: any) => {
  return user !== null && user !== undefined && !user.expired;
};

export const getUsername = (user: any) => {
  return user?.profile?.preferred_username || user?.profile?.email || 'unknown';
};

export const getRoles = (user: any) => {
  return user?.profile?.roles || [];
};

export const hasRole = (user: any, role: string) => {
  const roles = getRoles(user);
  return roles.includes(role);
};