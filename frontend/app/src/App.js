import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import Keycloak from 'keycloak-js'
import { ReactKeycloakProvider } from '@react-keycloak/web'

import { CookiesProvider } from 'react-cookie'

import './App.css'
import { ThemeFactory } from './layouts/ThemeFactory.ts'

import ViandeEnDirectRouterProvider from './layouts/ViandeEnDirectRouterProvider.tsx'


function App() {

  const themeFactory = new ThemeFactory()

  const keycloakClient = new Keycloak(window.location.origin + '/config/keycloak.json')
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
            <ViandeEnDirectRouterProvider></ViandeEnDirectRouterProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </ReactKeycloakProvider>
    </CookiesProvider>
  )
}
export default App