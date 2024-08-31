import React from 'react'
import { AppBar, Box, Button, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'

import { AuthenticationService } from '../../authentication/service/AuthenticationService.ts'

import { Login, Logout } from '@mui/icons-material'
import { Navigate, Outlet, useLoaderData, useNavigate } from 'react-router-dom'
import { ApiBuilder } from '../../api/ApiBuilder.ts'
import { UrlService } from '../../domains/commons/service/UrlService.ts'


export default function CustomerLayout() {

    const {keycloak} = useKeycloak()
    const authenticationService = new AuthenticationService(keycloak)
    const urlService = new UrlService()

    const data = useLoaderData()
    const authenticatedAsProducer = data.authenticatedAsProducer
    const customer = data.customer
    
    if (authenticatedAsProducer) {
        return <Navigate to='/unauthorized'/>
    }
    if (authenticationService.isAuthenticated() && !customer.id) {
        return <Navigate to='/customer/registration'/>
    }

    async function logout() {
        const frontendUrl = await urlService.getCustomerFrontentUrl()
        keycloak.logout({redirectUri: frontendUrl})
    }

    function displayAuthenticationButton(): React.ReactNode {
        if (authenticationService.isAuthenticated()) {
            return <>
                <Typography>{authenticationService.getCurrentUserFirstName() } {authenticationService.getCurrentUserLastName()}</Typography>
                <IconButton onClick={logout} color="inherit">
                    <Logout/>
                </IconButton>
            </>
        } 
        return <IconButton onClick={keycloak.login} color="inherit">
            <Login/>
        </IconButton>
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
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Viande en direct
                    </Typography>
                    {displayAuthenticationButton()}
                </Toolbar>
            </AppBar>
            <Outlet/>
        </Box>
    )
}

export async function loadCustomerLayoutData(keycloak) {
    const authenticationService = new AuthenticationService(keycloak)
    const authenticatedAsProducer = await authenticationService.isAuthenticatedAsProducer()
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloak)
    if(!authenticatedAsProducer && authenticationService.isAuthenticated()) {
        const customer = await api.getCustomer({email: authenticationService.getCurrentUserEmail()})
        return {authenticatedAsProducer: authenticatedAsProducer, customer: customer}
    }
    return {authenticatedAsProducer: authenticatedAsProducer, customer: undefined}
}