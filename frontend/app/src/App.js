import './App.css';
import { useEffect, useState } from 'react';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import keycloak from './keycloak';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box'
import SideMenu from './layout/SideMenu'
import Authentication from './components/security/Authentication';
import Sales from './Sales';

function App() {

  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const keycloakInitOptions = {
    checkLoginIframe: false,
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
  }

  const handleSideMenuToggle = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  function getIcon() {
    if (sideMenuOpen) {
      return <CloseIcon/>
    } else {
      return <MenuIcon />
    }
  }

  return (
    <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakInitOptions}>
      <AppBar 
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleSideMenuToggle}
            sx={{ 
              mr: 2,
              display: { xs: 'block', sm: 'none' }
            }}
          >
            {getIcon()}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Viande en direct
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <SideMenu 
        open={sideMenuOpen} 
        onClose={handleSideMenuToggle}>
      </SideMenu>
      <Box>
        {/* Main content */}
      </Box>

      {/*
      <div className="App">
        <header className="App-header">
          <Authentication></Authentication>
          <Sales></Sales>
        </header> 
      */}
    </ReactKeycloakProvider>
  );
}
export default App