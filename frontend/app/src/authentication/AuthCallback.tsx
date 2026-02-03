import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';

export const AuthCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }

    if (auth.error) {
      console.error('Authentication error:', auth.error);
      // Dans v3.1.0, l'erreur peut avoir une structure différente
      const errorMessage = auth.error?.message || 'Unknown authentication error';
      console.error('Detailed error:', errorMessage);
      navigate('/login-error');
      return;
    }

    if (auth.isAuthenticated) {
      // Dans v3.1.0, nous pouvons accéder à plus d'informations utilisateur
      console.log('User authenticated:', {
        username: auth.user?.profile?.preferred_username,
        email: auth.user?.profile?.email,
        roles: auth.user?.profile?.realm_access?.roles
      });
      
      // Rediriger vers la page d'accueil ou la page précédente
      const returnUrl = localStorage.getItem('returnUrl') || '/';
      localStorage.removeItem('returnUrl');
      navigate(returnUrl);
    }
  }, [auth, navigate]);

  if (!auth.isLoading) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'background.default'
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" mt={2} color="text.secondary">
        Authentication en cours...
      </Typography>
    </Box>
  );
};

export default AuthCallback;