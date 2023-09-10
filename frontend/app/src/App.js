import './App.css';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
import LayoutWrapper from './layout/LayoutWrapper';

function App() {

  const keycloakClient = new Keycloak(window.location.origin + '/config/keycloak.json')

  const keycloakInitOptions = {
    checkLoginIframe: false,
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
  }

  return (
    <ReactKeycloakProvider authClient={keycloakClient} initOptions={keycloakInitOptions}>
      <LayoutWrapper/>
    </ReactKeycloakProvider>
  );

}
export default App