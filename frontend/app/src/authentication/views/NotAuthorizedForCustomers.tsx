import { Box, Toolbar, Typography, Button, ButtonGroup, AppBar, CssBaseline, IconButton } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'
import React from 'react'
import { useEffect, useState } from 'react'
import { UrlService } from '../../domains/commons/service/UrlService.ts'
import { Logout } from '@mui/icons-material'

export default function NotAuthorizedForCustomers() {

    const urlService = new UrlService()  
    const [customerFrontendUrl, setCustomerFrontendUrl] = useState<String>()
    const {keycloak} = useKeycloak()
        
    useEffect(() => {
        urlService.getCustomerFrontentUrl().then(setCustomerFrontendUrl)
    })

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
                    <IconButton onClick={keycloak.logout} color="inherit">
                      <Logout/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Typography>Vous êtes dans l'espace producteur de viandeendirect.eu</Typography>
            <Typography>Votre compte est un compte client.</Typography>
            <Typography>Il est impossible d'accéder à l'espace producteur avec un compte client</Typography>
            <ButtonGroup>
                <Button size="small" variant="outlined" onClick={() => {
                    keycloak.logout()
                    keycloak.login()
                    }}>
                    Changer de compte
                </Button>
                <Button size="small" variant="contained" onClick={() => window.open(customerFrontendUrl, '_self')}>
                    Accéder à l'espace client
                </Button>
            </ButtonGroup>
        </Box>
}