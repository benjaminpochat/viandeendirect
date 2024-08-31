import React from 'react'
import { Box, Toolbar, Typography, Button, ButtonGroup, CssBaseline, AppBar } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'
import { UrlService } from '../../domains/commons/service/UrlService.ts'
import { AuthenticationService } from '../service/AuthenticationService.ts'
import { Navigate, useLoaderData } from 'react-router-dom'

export default function NotAuthorizedForProducers() {

    const { keycloak } = useKeycloak()
    const data = useLoaderData()
    const authenticatedAsProducer = data.authenticatedAsProducer
    const producerFrontendUrl = data.producerFrontendUrl

    if (!authenticatedAsProducer) {
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
                <Typography>Vous êtes dans l'espace client de viandeendirect.eu</Typography>
                <Typography>Votre compte est un compte producteur.</Typography>
                <Typography>Il est impossible d'utiliser un compte producteur pour s'identifier à l'espace client avec un compte producteur</Typography>
                <ButtonGroup>
                    <Button size="small" variant="outlined" onClick={() => {
                        keycloak.logout()
                        }}>
                        Se déconnecter
                    </Button>
                    <Button size="small" variant="contained" onClick={() => window.open(producerFrontendUrl, '_self')}>
                        Accéder à l'espace producteur
                    </Button>
                </ButtonGroup>
            </Box>
}

export async function loadNotAuthorizedForProducerData(keycloak) {
    const authenticationService = new AuthenticationService(keycloak)
    const authenticatedAsProducer = await authenticationService.isAuthenticatedAsProducer()
    const urlService = new UrlService()
    const producerFrontendUrl = await urlService.getProducerFrontentUrl()
    return {authenticatedAsProducer: authenticatedAsProducer, producerFrontendUrl: producerFrontendUrl}
}