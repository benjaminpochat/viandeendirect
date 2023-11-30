import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'

import LayoutWrapper from './layout/LayoutWrapper';

import './App.css';


function App() {

  const keycloakClient = new Keycloak(window.location.origin + '/config/keycloak.json')

  const keycloakInitOptions = {
    checkLoginIframe: false,
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
  }

  const theme = createTheme({
    palette: {
      //mode: 'dark',
      primary: {
        main: '#556b2f',
      }
    },
    typography: {
      h1: {
        fontFamily: 'Acme',
      },
      h2: {
        fontFamily: 'Acme',
      },
      h3: {
        fontFamily: 'Acme',
      },
      h4: {
        fontFamily: 'Acme',
      },
      h5: {
        fontFamily: 'Acme',
      },
      h6: {
        fontFamily: 'Acme',
      },
      subtitle1: {
        fontWeight: 'bold'
      }
    }
  });

  return (
    <ReactKeycloakProvider authClient={keycloakClient} initOptions={keycloakInitOptions}>
      <ThemeProvider theme={theme}>
        <LayoutWrapper />
      </ThemeProvider>
    </ReactKeycloakProvider>
  )
}
export default App