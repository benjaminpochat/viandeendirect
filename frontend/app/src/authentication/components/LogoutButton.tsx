import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from 'react-oidc-context';

export const LogoutButton = () => {
  const auth = useAuth();

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleLogout}
      disabled={auth.isLoading}
    >
      Se déconnecter
    </Button>
  );
};

export default LogoutButton;