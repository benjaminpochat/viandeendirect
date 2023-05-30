import { styled } from '@mui/material/styles';
import { AppBar, Box, Typography, CssBaseline, Toolbar, Grid, Paper, Button } from "@mui/material";
import { useKeycloak } from '@react-keycloak/web'

function AnonymousLayout() {

    const { keycloak, initialized } = useKeycloak()

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    function login() {
        keycloak.login()
    }

    function register() {
        keycloak.register()
    }

    return (
        <Box>
            <CssBaseline />
            <AppBar
                position="fixed"
            >
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Viande en direct
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box>
                <Toolbar />
                <Grid container
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <Item>
                            <Typography>Bienvenu dans l'espace producteur de ViandeEnDirect.eu</Typography>
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                            <Typography>J'ai déjà un compte "producteur"</Typography>
                            <Button onClick={login} variant='outlined'>Je me connecte</Button>
                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                            <Typography>Je n'ai pas encore un compte "producteur"</Typography>
                            <Button onClick={register} variant='contained'>Je crée un compte</Button>
                        </Item>
                    </Grid>
                </Grid>

            </Box>
        </Box>
    )
}

export default AnonymousLayout