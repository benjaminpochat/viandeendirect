import { useKeycloak } from '@react-keycloak/web'
import { useState } from 'react';

import {AppBar, Box, CssBaseline, IconButton, Toolbar, Typography} from '@mui/material'
import {Close, Logout, Menu} from '@mui/icons-material'

import Dashboard from '../domains/dashboard/Dashboard.js';
import CustomerController from '../domains/customer/CustomerController.js';
import GrowerAccount from '../domains/producer/ProducerAccount.js'
import ProductionController from '../domains/production/ProductionController.js'
import SaleController from '../domains/sale/SaleController.tsx'
import SideMenu from './SideMenu'


function AuthenticatedLayout() {
    const { keycloak, initialized } = useKeycloak()
    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const [mainContent, setMainContent] = useState('DASHBOARD')
  
    const sideMenuWidth = 240;
   
    const handleSideMenuToggle = () => {
      setSideMenuOpen(!sideMenuOpen);
    };
  
    const handleSelectMenuItem = (menuItem) => {
      setSideMenuOpen(false)
      setMainContent(menuItem)
    }
  
    function renderMainContent() {
        switch (mainContent) {
          case 'DASHBOARD' : return <Dashboard></Dashboard>
          case 'SALES' : return <SaleController></SaleController>
          case 'PRODUCTIONS' : return <ProductionController></ProductionController>
          case 'CUSTOMERS' : return <CustomerController></CustomerController>
          case 'GROWER_ACCOUNT' : return <GrowerAccount></GrowerAccount>
        }
    }
    
    function getIcon() {
      if (sideMenuOpen) {
        return <Close/>
      } else {
        return <Menu/>
      }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
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
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Viande en direct
                    </Typography>
                    <IconButton onClick={keycloak.logout} color="inherit">
                      <Logout/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <SideMenu
                open={sideMenuOpen}
                onClose={handleSideMenuToggle}
                selectItem={handleSelectMenuItem}
                width={sideMenuWidth}>
            </SideMenu>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {renderMainContent()}
            </Box>
        </Box>
    )
}

export default AuthenticatedLayout