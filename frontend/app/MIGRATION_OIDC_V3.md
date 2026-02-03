# Migration Guide: oidc-client-ts v2.4.0 → v3.1.0

This guide documents the changes made during the migration from oidc-client-ts v2.4.0 to v3.1.0.

## Summary of Changes

### 1. Package Version Update

```json
// Before
"oidc-client-ts": "^2.4.0"

// After
"oidc-client-ts": "^3.1.0"
```

### 2. Configuration Changes (`oidc-config.ts`)

#### Authority Configuration
```typescript
// Before: Using config file path
authority: window.location.origin + '/config/keycloak.json'

// After: Direct Keycloak realm URL
authority: window.location.origin + '/realms/viandeendirect'
```

#### Added Configuration Options
```typescript
// New in v3.1.0
post_logout_redirect_uri: window.location.origin + '/'
includeIdTokenInSilentRenew: true

// Enhanced Keycloak integration
extraQueryParams: {
  kc_idp_hint: 'default'
}
```

#### Complete Metadata
```typescript
// Added jwks_uri for better security
jwks_uri: window.location.origin + '/realms/viandeendirect/protocol/openid-connect/certs'
```

### 3. User Data Structure Changes

#### Token Access
```typescript
export const getKeycloakToken = (user: any) => {
  // v3.1.0: access_token is directly available
  return user?.access_token || null;
}
```

#### Token Claims
```typescript
export const getKeycloakTokenParsed = (user: any) => {
  // v3.1.0: id_token_claims contains decoded JWT claims
  return user?.id_token_claims || user?.profile || null;
}
```

#### Authentication Check
```typescript
export const isAuthenticated = (user: any) => {
  // v3.1.0: Multiple ways to check expiration
  if (!user) return false;
  
  // Method 1: expired flag
  if (user.expired !== undefined) {
    return !user.expired;
  }
  
  // Method 2: expires_at timestamp
  if (user.expires_at) {
    const now = Math.floor(Date.now() / 1000);
    return user.expires_at > now;
  }
  
  return false;
}
```

### 4. Role Management Enhancements

#### Comprehensive Role Extraction
```typescript
export const getRoles = (user: any) => {
  // v3.1.0: Roles can be in multiple locations
  const realmRoles = user?.profile?.realm_access?.roles || [];
  const resourceRoles = user?.profile?.resource_access?.['viandeendirect-frontend']?.roles || [];
  const idTokenRoles = user?.id_token_claims?.roles || [];
  
  // Merge and deduplicate
  return [...new Set([...realmRoles, ...resourceRoles, ...idTokenRoles])];
}
```

#### Specific Role Checks
```typescript
// New utility functions for fine-grained role checking
export const hasRealmRole = (user: any, role: string) => {
  const realmRoles = user?.profile?.realm_access?.roles || [];
  return realmRoles.includes(role);
}

export const hasResourceRole = (user: any, role: string, resource: string = 'viandeendirect-frontend') => {
  const resourceRoles = user?.profile?.resource_access?.[resource]?.roles || [];
  return resourceRoles.includes(role);
}
```

### 5. Adapter Enhancements (`keycloak-adapter.ts`)

#### Token Expiration Handling
```typescript
updateToken: async (minValidity?: number) => {
  if (auth.user) {
    // v3.1.0: Use expires_at for expiration calculation
    const expiresIn = auth.user.expires_at 
      ? auth.user.expires_at - Math.floor(Date.now() / 1000) 
      : 0;
    
    if (minValidity === undefined || expiresIn < minValidity) {
      try {
        await auth.signinSilent();
        return true;
      } catch (error) {
        console.error('Token update failed:', error);
        return false;
      }
    }
  }
  return true;
}
```

#### User Manager Access
```typescript
// New in v3.1.0: Direct access to user manager
getUserManager: () => auth.userManager
```

### 6. AuthCallback Enhancements

#### Improved Error Handling
```typescript
if (auth.error) {
  console.error('Authentication error:', auth.error);
  // v3.1.0: Enhanced error information
  const errorMessage = auth.error?.message || 'Unknown authentication error';
  console.error('Detailed error:', errorMessage);
  navigate('/login-error');
  return;
}
```

#### Enhanced User Information Logging
```typescript
if (auth.isAuthenticated) {
  // v3.1.0: Richer user information available
  console.log('User authenticated:', {
    username: auth.user?.profile?.preferred_username,
    email: auth.user?.profile?.email,
    roles: auth.user?.profile?.realm_access?.roles
  });
}
```

## Breaking Changes and Solutions

### 1. User Data Structure
**Problem**: `user.id_token_claims` is now the primary location for JWT claims.

**Solution**: Fallback to `user.profile` for backward compatibility.

### 2. Token Expiration
**Problem**: `user.expired` may not always be available.

**Solution**: Use `user.expires_at` with timestamp comparison.

### 3. Role Location
**Problem**: Roles are now distributed across multiple properties.

**Solution**: Check all possible locations and merge results.

## Benefits of v3.1.0

1. **Better TypeScript Support**: Improved type definitions
2. **Enhanced Security**: Automatic JWT validation
3. **Rich User Data**: More detailed user information
4. **Improved Error Handling**: Better error messages
5. **Performance**: Optimized token management
6. **Standards Compliance**: Full OIDC specification support

## Testing Recommendations

1. **Authentication Flow**: Test login/logout sequences
2. **Token Renewal**: Verify silent token renewal
3. **Role-Based Access**: Test all role-based features
4. **Error Handling**: Test various error scenarios
5. **Session Management**: Test session expiration

## Rollback Procedure

If issues arise, you can rollback using:

```bash
npm install oidc-client-ts@2.4.0 --save-exact
```

Then revert the changes in:
- `src/authentication/oidc-config.ts`
- `src/authentication/keycloak-adapter.ts`
- `src/authentication/AuthCallback.tsx`

## Additional Resources

- [oidc-client-ts v3.1.0 Documentation](https://github.com/authts/oidc-client-ts)
- [OIDC Specification](https://openid.net/connect/)
- [Keycloak OIDC Documentation](https://www.keycloak.org/docs/latest/securing_apps/)

## Migration Status

✅ Configuration updated
✅ User data handling adapted
✅ Role management enhanced
✅ Error handling improved
✅ Token management updated
✅ Backward compatibility maintained

This migration provides a more robust and standards-compliant authentication solution while maintaining full backward compatibility with existing code.