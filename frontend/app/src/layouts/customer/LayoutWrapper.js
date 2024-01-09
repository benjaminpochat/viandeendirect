
import {AppBar, Box, CssBaseline, IconButton, Toolbar, Typography} from '@mui/material'

export default function CustomerLayoutWrapper() {


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
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography>Bienvenu dans l'espace client de ViandeEnDirect.eu</Typography>
            </Box>
        </Box>
    )
    
}
