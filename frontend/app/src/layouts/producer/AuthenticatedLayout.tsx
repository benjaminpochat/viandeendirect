import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { useState, useEffect } from 'react';

import { AppBar, Box, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material'
import { Close, Logout, Menu } from '@mui/icons-material'


import SideMenu from './SideMenu.jsx'
import { AuthenticationService } from '../../authentication/service/AuthenticationService.ts';
import { Navigate, Outlet, useLoaderData } from 'react-router-dom';
import { UrlService } from '../../domains/commons/service/UrlService.ts';
import { EnvironmentTypeService } from '../../domains/commons/service/EnvironmentTypeService.ts';


export default function AuthenticatedLayout() {
  const { keycloak } = useKeycloak()
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const authenticationService = new AuthenticationService(keycloak)
  const urlService = new UrlService()

  const data = useLoaderData()
  const authenticatedAsCustomer: boolean = data.isAuthenticatedAsCustomer
  const environmentType = data.environmentType

  const sideMenuWidth = 240;

  const handleSideMenuToggle = () => {
    setSideMenuOpen(!sideMenuOpen)
  }

  function getIcon() {
    if (sideMenuOpen) {
      return <Close />
    } else {
      return <Menu />
    }
  }

  function getTitle() {
    if(environmentType) {
        return <>
            <span>Viande en direct</span>
            <span style={{color: environmentType.color, marginLeft: '1rem'}}>{environmentType.label}</span>
        </>
    }
    return <>Viande en direct</>
  }

  async function logout() {
    const frontendUrl = await urlService.getProducerFrontentUrl()
    keycloak.logout({ redirectUri: `${frontendUrl}/authentication` })
  }

  function getAuthenticatedLayout() {
    return <Box sx={{ display: 'flex' }}>
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
            {getTitle()}
          </Typography>
          <Typography>{authenticationService.getCurrentUserFirstName()} {authenticationService.getCurrentUserLastName()}</Typography>
          <IconButton onClick={logout} color="inherit">
            <Logout />
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
        <Outlet />
      </Box>
    </Box>
  }


  if (!authenticationService.isAuthenticated()) {
    return <Navigate to='/authentication' />
  } 
  if (authenticatedAsCustomer) {
    return <Navigate to='/unauthorized' />
  }
  return getAuthenticatedLayout()
}

export async function loadAuthenticatedLayoutData(keycloak): Promise<{isAuthenticatedAsCustomer: boolean, environmentType: {label: String, color: String} | undefined}> {
  const authenticationService = new AuthenticationService(keycloak)
  const isAuthenticatedAsCustomer = await authenticationService.isAuthenticatedAsCustomer()
  const environmentTypeService = new EnvironmentTypeService();
  const environmentType = await environmentTypeService.getEnvironmentType()
  return { isAuthenticatedAsCustomer: isAuthenticatedAsCustomer, environmentType: environmentType }
}