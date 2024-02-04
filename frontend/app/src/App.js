import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { frFR } from '@mui/material/locale';

import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'

import { CookiesProvider } from 'react-cookie';

import ProducerLayoutWrapper from './layouts/producer/LayoutWrapper';
import CustomerLayout from './layouts/customer/CustomerLayout.tsx';

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
  }, frFR);

  function getLayoutWrapper() {
    if(process.env.REACT_APP_MODE === 'CUSTOMER') {
      return <CustomerLayout/>
    }
    if(process.env.REACT_APP_MODE === 'PRODUCER') {
      return <ProducerLayoutWrapper/>
    }
    return <div>Configuration du mode client ou producteur absent ou non reconnu</div>
  }

  return (
    <CookiesProvider>
      <ReactKeycloakProvider authClient={keycloakClient} initOptions={keycloakInitOptions}>
        <ThemeProvider theme={theme}>
          {getLayoutWrapper()}
        </ThemeProvider>
      </ReactKeycloakProvider>
    </CookiesProvider>
  )
}
export default App