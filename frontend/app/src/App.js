import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { AuthProvider } from 'react-oidc-context'
import { createOidcUserManager } from './authentication/oidc-config'

import { CookiesProvider } from 'react-cookie'

import './App.css'
import { ThemeFactory } from './layouts/ThemeFactory.ts'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import ViandeEnDirectRouterProvider from './layouts/ViandeEnDirectRouterProvider.tsx'
import SnackbarProvider from './domains/commons/components/SnackbarProvider.tsx';
import { AuthCallback } from './authentication/AuthCallback.tsx';
import { getEnv } from './config/env';



function App() {

  const themeFactory = new ThemeFactory()

  // Use environment configuration for API base URL
  const env = getEnv();
  const userManager = createOidcUserManager();

  return (
    <CookiesProvider>
      <AuthProvider userManager={userManager}>
        <ThemeProvider theme={themeFactory.createTheme()}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <SnackbarProvider>
              <ViandeEnDirectRouterProvider/>
              <AuthCallback />
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </AuthProvider>
    </CookiesProvider>
  )
}
export default App