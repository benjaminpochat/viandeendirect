import './App.css';
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloakClient from "./keycloak"
import LayoutWrapper from './layout/LayoutWrapper';

function App() {

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