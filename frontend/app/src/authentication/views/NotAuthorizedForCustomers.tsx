import React from 'react'
import { Box, Toolbar, Typography, Button, ButtonGroup, AppBar, CssBaseline, IconButton } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'
import { UrlService } from '../../domains/commons/service/UrlService.ts'
import { Navigate, useLoaderData } from 'react-router-dom'
import { AuthenticationService } from '../service/AuthenticationService.ts'

export default function NotAuthorizedForCustomers() {

    const {keycloak} = useKeycloak()

    const data = useLoaderData()
    const authenticatedAsCustomer = data.authenticatedAsCustomer
    const customerFrontendUrl = data.customerFrontendUrl
    
    if (!authenticatedAsCustomer) {
        return <Navigate to='/'/>
    }

    return <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Typography>Vous êtes dans l'espace producteur de viandeendirect.eu</Typography>
            <Typography>Votre compte est un compte client.</Typography>
            <Typography>Il est impossible d'accéder à l'espace producteur avec un compte client</Typography>
            <ButtonGroup>
                <Button size="small" variant="outlined" onClick={() => {
                    keycloak.logout()
                    }}>
                    Se déconnecter
                </Button>
                <Button size="small" variant="contained" onClick={() => window.open(customerFrontendUrl, '_self')}>
                    Accéder à l'espace client
                </Button>
            </ButtonGroup>
        </Box>
}

export async function loadNotAuthorizedForCustomerData(keycloak) {
    const authenticationService = new AuthenticationService(keycloak)
    const authenticatedAsCustomer = await authenticationService.isAuthenticatedAsCustomer()
    const urlService = new UrlService()
    const customerFrontendUrl = await urlService.getCustomerFrontentUrl()
    return {authenticatedAsCustomer: authenticatedAsCustomer, customerFrontendUrl: customerFrontendUrl}
}