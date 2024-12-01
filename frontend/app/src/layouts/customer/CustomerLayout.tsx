import React from 'react'
import { AppBar, Box, Button, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'

import { AuthenticationService } from '../../authentication/service/AuthenticationService.ts'

import { Login, Logout } from '@mui/icons-material'
import { Navigate, Outlet, useLoaderData, useNavigate } from 'react-router-dom'
import { ApiBuilder } from '../../api/ApiBuilder.ts'
import { UrlService } from '../../domains/commons/service/UrlService.ts'
import Footer from '../../domains/commons/components/Footer.tsx'
import { EnvironmentTypeService } from '../../domains/commons/service/EnvironmentTypeService.ts'


export default function CustomerLayout() {

    const {keycloak} = useKeycloak()
    const authenticationService = new AuthenticationService(keycloak)
    const urlService = new UrlService()

    const data = useLoaderData()
    const authenticatedAsProducer = data.authenticatedAsProducer
    const customer = data.customer
    const environmentType = data.environmentType
    
    if (authenticatedAsProducer) {
        return <Navigate to='/unauthorized'/>
    }
    if (authenticationService.isAuthenticated() && !customer.id) {
        return <Navigate to='/customer/registration'/>
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
        <>
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
                            {getTitle()}
                        </Typography>
                        {displayAuthenticationButton()}
                    </Toolbar>
                </AppBar>
                <Outlet/>
            </Box>
            <Footer/>
        </>
    )
}

export async function loadCustomerLayoutData(keycloak) {
    const authenticationService = new AuthenticationService(keycloak)
    const authenticatedAsProducer = await authenticationService.isAuthenticatedAsProducer()
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloak)
    const environmentTypeService = new EnvironmentTypeService();
    const environmentType = await environmentTypeService.getEnvironmentType()  
    if(!authenticatedAsProducer && authenticationService.isAuthenticated()) {
        const customer = await api.getCustomer({email: authenticationService.getCurrentUserEmail()})
        return {
            authenticatedAsProducer: authenticatedAsProducer, 
            customer: customer,
            environmentType: environmentType,
        }
    }
    return {
        authenticatedAsProducer: authenticatedAsProducer, 
        customer: undefined,
        environmentType: environmentType
    }
}