import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from 'react-oidc-context';

export const LoginButton = () => {
  const auth = useAuth();

  const handleLogin = () => {
    // Sauvegarder l'URL actuelle pour la redirection après login
    localStorage.setItem('returnUrl', window.location.pathname);
    auth.signinRedirect();
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleLogin}
      disabled={auth.isLoading}
    >
      Se connecter
    </Button>
  );
};

export default LoginButton;