import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useRouteError } from "react-router-dom";

export function ErrorLayout({message: message}) {

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
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h3">Oups... y a un soucis :(</Typography>
                <Typography variant="h5">{message}</Typography>
                <Typography sx={{marginTop: '1rem', marginBottom: '1rem'}} variant="h5">N'hésitez pas à nous signaler le problème</Typography>                
                <Typography variant="h5"><a href='mailto:la.viande.en.diect@gmail.com'>Signaler le problème à la.viande.en.direct@gmail.com</a></Typography>
                <Typography variant="h5"><a href='/..'>Revenir à la page d'accueil</a></Typography>
            </Box>
        </Box>
    )
}
