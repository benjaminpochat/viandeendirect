import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import Keycloak from 'keycloak-js'
import { ReactKeycloakProvider } from '@react-keycloak/web'

import { CookiesProvider } from 'react-cookie';
import { RouterProvider } from "react-router-dom";


import { RouterFactory } from './layouts/RouterFactory.tsx';

import './App.css';
import { ThemeFactory } from './layouts/ThemeFactory.ts';


function App() {

  const keycloakClient = new Keycloak(window.location.origin + '/config/keycloak.json')
  const routerFactory = new RouterFactory()
  const themeFactory = new ThemeFactory()

  const keycloakInitOptions = {
    checkLoginIframe: false,
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
  }

  return (
    <CookiesProvider>
      <ReactKeycloakProvider authClient={keycloakClient} initOptions={keycloakInitOptions}>
        <ThemeProvider theme={themeFactory.createTheme()}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <RouterProvider router={routerFactory.getRouter(keycloakClient)} />
          </LocalizationProvider>
        </ThemeProvider>
      </ReactKeycloakProvider>
    </CookiesProvider>
  )
}
export default App