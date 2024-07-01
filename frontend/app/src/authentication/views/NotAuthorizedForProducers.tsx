import { Box, Toolbar, Typography, Button, ButtonGroup } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'
import React from 'react'
import { useEffect, useState } from 'react'
import { UrlService } from '../../domains/commons/service/UrlService.ts'

export default function NotAuthorizedForProducers() {

    const urlService = new UrlService()  
    const [producerFrontendUrl, setProducerFrontendUrl] = useState<String>()
    const {keycloak} = useKeycloak()
        
    useEffect(() => {
        urlService.getProducerFrontentUrl().then(setProducerFrontendUrl)
    })

    return <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Typography>Vous êtes dans l'espace client de viandeendirect.eu</Typography>
            <Typography>Votre compte est un compte producteur.</Typography>
            <Typography>Il est impossible d'accéder à l'espace client avec un compte producteur</Typography>
            <ButtonGroup>
                <Button size="small" variant="outlined" onClick={() => {
                    keycloak.logout()
                    keycloak.login()
                    }}>
                    Changer de compte
                </Button>
                <Button size="small" variant="contained" onClick={() => window.open(producerFrontendUrl, '_self')}>
                    Accéder à l'espace producteur
                </Button>
            </ButtonGroup>
        </Box>
}