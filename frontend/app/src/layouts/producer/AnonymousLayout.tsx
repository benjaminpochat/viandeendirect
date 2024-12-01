import { styled } from '@mui/material/styles';
import { AppBar, Box, Typography, CssBaseline, Toolbar, Grid, Paper, Button, IconButton } from "@mui/material";
import { useKeycloak } from '@react-keycloak/web'
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from '../../domains/commons/components/Footer.tsx';
import { Login } from '@mui/icons-material';
import { EnvironmentTypeService } from '../../domains/commons/service/EnvironmentTypeService.ts';

export default function AnonymousLayout() {

    const environmentTypeService = new EnvironmentTypeService()
    const { keycloak, initialized } = useKeycloak()
    const [environmentType, setEnvironmentType] = useState<{label: String, color: String} | undefined>(undefined)
    const navigate = useNavigate()

    useEffect(() => {
        const loadEnvironmentType = async () => {
            setEnvironmentType(await environmentTypeService.getEnvironmentType())
        }
        console.log('loadEnvironmentType')
        loadEnvironmentType()
    }, [environmentTypeService])

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    function getTitle() {
        if(environmentType) {
            return <>
                <span>Viande en direct</span>
                <span style={{color: environmentType.color, marginLeft: '1rem'}}>{environmentType.label}</span>
            </>
        }
        return <>Viande en direct</>
    }

    function login() {
        keycloak.login()
    }

    function register() {
        navigate('/registration')
    }

    function getAnonymousLayout() {
        const functionDescriptionStyle = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: '1rem'
        };
        const authenticationActionStyle = {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'nowrap',
            marginTop: '1rem',
            gap: '1rem'
        };
        return <>
            <CssBaseline />
            <AppBar
                position="fixed"
            >
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        {getTitle()}
                    </Typography>
                    <IconButton onClick={login} color="inherit">
                        <Login/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box>
                <Toolbar />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    margin: '1rem'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '2rem'
                        }}>
                        <Typography variant='h3'>Simplifiez la vente directe de votre viande !</Typography>
                        <Typography>Transformez votre étable en boutique en ligne avec viandeendirect.eu</Typography>
                    </Box>

                    <Box sx={functionDescriptionStyle}>
                        <i style={{width:'3rem', height:'3rem'}} className="icon secure-payment-icon"></i>
                        <Typography variant='h5'>Paiement sécurisé</Typography>
                    </Box>

                    <Box sx={functionDescriptionStyle}>
                        <Typography variant='h5'>Gestion du stock simplifiée</Typography>
                        <i style={{width:'3rem', height:'3rem'}} className="icon stock-availability-icon"></i>
                    </Box>


                    <Box sx={functionDescriptionStyle}>
                        <i style={{width:'3rem', height:'3rem'}} className="icon package-label-icon"></i>
                        <Typography variant='h5'>Edition des étiquettes</Typography>
                    </Box>

                    <Box sx={functionDescriptionStyle}>
                        <Typography variant='h5'>Edition des factures</Typography>
                        <i style={{width:'3rem', height:'3rem'}} className="icon invoices-icon"></i>
                    </Box>

                    <Box sx={functionDescriptionStyle}>
                        <i style={{width:'3rem', height:'3rem'}} className="icon low-price-icon"></i>
                        <div>
                            <Typography variant='h5'>Commission : 2,5% + 0,25 €/commande</Typography>
                        </div>
                    </Box>

                    <Box sx={{ marginTop: '1rem' }}>
                        <Box sx={authenticationActionStyle}>
                            <Typography variant='h6'>Je n'ai pas encore de compte</Typography>
                            <Button onClick={register} variant='contained'>Je crée un compte</Button>
                        </Box>
                        <Box  sx={authenticationActionStyle}>
                            <Typography variant='h6'>J'ai déjà un compte</Typography>
                            <Button onClick={login} variant='outlined'>Je me connecte</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Footer/>
        </>
    }

    return (
        <>{keycloak.authenticated ? <Navigate to='/'></Navigate> : getAnonymousLayout()}</>
    )
}
