import './App.css';
import { useEffect, useState } from 'react';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import keycloak from './keycloak';
import Authentication from './Authentication';
import Sales from './Sales';



function App() {



const keycloakInitOptions = {
  checkLoginIframe: false,
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
}

  return (
    <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakInitOptions}>
      <div className="App">
        <header className="App-header">
          <Authentication></Authentication>
          <Sales></Sales>
        </header>
      </div>
    </ReactKeycloakProvider>
  );
}

export default App;
