import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { useState, useEffect } from 'react';

import {AppBar, Box, CssBaseline, IconButton, Toolbar, Typography} from '@mui/material'
import {Close, Logout, Menu} from '@mui/icons-material'

import { ApiInvoker } from '../../api/ApiInvoker.ts'

import Producer from 'viandeendirect_eu/dist/model/Producer.js';
import SideMenu from './SideMenu.jsx'
import { AuthenticationService } from '../../authentication/service/AuthenticationService.ts';
import NotAuthorizedForCustomers from '../../authentication/views/NotAuthorizedForCustomers.tsx';
import { ProducerService } from '../../domains/commons/service/ProducerService.ts';
import { Outlet } from 'react-router-dom';


export default function AuthenticatedLayout(props) {
    const { keycloak, initialized } = useKeycloak()
    const [sideMenuOpen, setSideMenuOpen] = useState(false)
    const [producer, setProducer] = useState<Producer>()
    const [unauthorized, setUnauthorized] = useState<Boolean>(false)
    const apiInvoker = new ApiInvoker()
    const authenticationService = new AuthenticationService(keycloak)
    const producerService = new ProducerService(keycloak)

    useEffect(() => {
      producerService.loadProducer(setProducer, setUnauthorized)
    }, [keycloak])


    const sideMenuWidth = 240;
   
    const handleSideMenuToggle = () => {
      setSideMenuOpen(!sideMenuOpen);
    };
  
    function getIcon() {
      if (sideMenuOpen) {
        return <Close/>
      } else {
        return <Menu/>
      }
    }

    if (unauthorized) {
      return <NotAuthorizedForCustomers/>
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
                    <Typography>{authenticationService.getCurrentUserFirstName() } {authenticationService.getCurrentUserLastName()}</Typography>
                    <IconButton onClick={keycloak.logout} color="inherit">
                      <Logout/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <SideMenu
                open={sideMenuOpen}
                onClose={handleSideMenuToggle}
                width={sideMenuWidth}>
            </SideMenu>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
                width={'100%'}>
                <Toolbar />
                <Outlet/>
            </Box>
        </Box>
    )
}
