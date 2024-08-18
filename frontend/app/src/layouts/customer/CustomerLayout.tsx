import React from 'react'
import { AppBar, Box, Button, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'

import { Customer } from '@viandeendirect/api/dist/models/Customer'

import { AuthenticationService } from '../../authentication/service/AuthenticationService.ts'

import { Login, Logout } from '@mui/icons-material'
import { Navigate, Outlet, useLoaderData, useNavigate } from 'react-router-dom'
import { ApiBuilder } from '../../api/ApiBuilder.ts'


export default function CustomerLayout() {

    const WELCOME = 'WELCOME'
    const ORDER_CREATION = 'ORDER_CREATION'
    const NOT_AUTHORIZED_FOR_PRODUCER = 'NOT_AUTHORIZED_FOR_PRODUCER'

    const {keycloak} = useKeycloak()
    const authenticationService = new AuthenticationService(keycloak)

    const navigate = useNavigate()

    const data = useLoaderData()
    const loggedAsProducer = data.loggedAsProducer
    const customer = data.customer

    if (loggedAsProducer) {
        return <Navigate to='/unauthorized'/>
    }

    function displayAuthenticationButton(): React.ReactNode {
        if (authenticationService.isAuthenticated()) {
            return <>
                <Typography>{authenticationService.getCurrentUserFirstName() } {authenticationService.getCurrentUserLastName()}</Typography>
                <IconButton onClick={keycloak.logout} color="inherit">
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
    if (!authenticationService.isAuthenticated()) {
        return {loggedAsProducer: false, customer: undefined}
    }
    try {
        const userEmail = authenticationService.getCurrentUserEmail()
        const apiBuilder = new ApiBuilder()
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        const customer: Customer = await api.getCustomer({'email': userEmail})
        return {loggedAsProducer: false, customer: customer}
    } catch (error) {
        if(error.response.status === 409) {
            return {loggedAsProducer: true, customer: undefined}
        }
    }
}