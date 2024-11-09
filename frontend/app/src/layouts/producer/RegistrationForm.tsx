import { Box, CssBaseline, AppBar, Toolbar, Typography, Button, ButtonGroup, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useNavigate } from "react-router-dom";
import { GoogleReCaptcha, GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Registration } from "@viandeendirect/api/dist/models";
import { ApiBuilder } from "../../api/ApiBuilder.ts";
import { useSnackbar } from "../../domains/commons/components/SnackbarProvider.tsx";

export default function RegistrationForm() {

    const navigate = useNavigate()
    const [reCaptchaKey, setReCaptchaKey] = useState<string | undefined >(undefined)
    const [captchaValidated, setCaptchaValidated] = useState<boolean>(false)
    const showSnackbar = useSnackbar()

    useEffect(() => {
        const getReCaptchaKey = async () => {
            const reCaptchaConfigResponse = await fetch(window.location.origin + '/config/recaptcha.json')
            const reCaptchaConfig = await reCaptchaConfigResponse.json()
            setReCaptchaKey(reCaptchaConfig.key)
        }
        getReCaptchaKey()
    }, [reCaptchaKey])

    async function sendNewProducerContact(producerFormData) {
        const registration: Registration = {
            producer: {
                user: {
                    email: producerFormData.email,
                    phone: producerFormData.phone,
                    firstName: producerFormData.firstName,
                    lastName: producerFormData.lastName
                },
                legalName: producerFormData.farmLegalName,
                legalIdentificationNumber: producerFormData.farmLegalIdentifier
            },
            productionDescription: producerFormData.productionDescription
        }
        const apiBuilder = new ApiBuilder()
        const api = await apiBuilder.getAnonymousApi()
        api.processRegistration({registration: registration})
        showSnackbar('Votre demande est bien prise en compte. Nous vous contacterons très prochainement.')
        navigate('/')
    }

    if (reCaptchaKey) {
        return (
            <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey}>
                <Box>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                    >
                        <Toolbar>
                            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                                Viande en direct
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Toolbar />
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, p: 3 }}
                        width={'100%'}>
                        <FormContainer onSuccess={sendNewProducerContact}>
                            <Stack flexDirection='column' gap='1rem'>
                                <Typography variant='h5'>Formulaire de création d'un compte producteur</Typography>
                                <div>
                                    <TextFieldElement
                                        fullWidth
                                        name="lastName"
                                        validation={{ required: 'Champ obligatoire' }}
                                        label="Nom"
                                        variant="standard" />
                                </div>
                                <div>
                                    <TextFieldElement
                                        fullWidth
                                        name="firstName"
                                        validation={{ required: 'Champ obligatoire' }}
                                        label="Prénom"
                                        variant="standard" />
                                </div>
                                <div>
                                    <TextFieldElement
                                        fullWidth
                                        name="farmLegalName"
                                        validation={{ required: 'Champ obligatoire' }}
                                        label="Nom de l'exploitation agricole"
                                        variant="standard" />
                                </div>
                                <div>
                                    <TextFieldElement
                                        fullWidth
                                        name="farmLegalIdentifier"
                                        validation={{ 
                                            required: 'Champ obligatoire',
                                            pattern: {
                                                value: /^([0-9]{3})( ?)([0-9]{3})( ?)([0-9]{3})$/ ,
                                                message: 'Veuillez entrer un numéro de SIREN valide'
                                            }
                                        }}
                                        label="n° SIREN de l'exploitation agricole (9 chiffres)"
                                        variant="standard" />
                                </div>
                                <div>
                                    <TextFieldElement
                                        fullWidth
                                        name="phone"
                                        validation={{ 
                                            required: 'Champ obligatoire', 
                                            pattern: {
                                                value: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/ ,
                                                message: 'Veuillez entrer un numéro de téléphone valide'
                                            }
                                        }}
    
                                        label="Téléphone"
                                        variant="standard"/>
                                </div>
                                <div>
                                    <TextFieldElement
                                        fullWidth
                                        name="email"
                                        validation={{ 
                                            required: 'Champ obligatoire',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Veuillez entrer une adresse email valide'
                                            }
                                        }}
                                        label="Adresse email"
                                        variant="standard" />
                                </div>
                                <div>
                                    <TextFieldElement
                                        fullWidth
                                        name="productionDescription"
                                        validation={{ required: 'Champ obligatoire' }}
                                        label="Description des productions destinées à la vente directe"
                                        variant="standard" 
                                        multiline/>
                                </div>
                                <div>
                                    <GoogleReCaptcha onVerify={validateReCaptcha}></GoogleReCaptcha>
                                </div>
                                <div>
                                    <ButtonGroup>
                                        <Button disabled={!captchaValidated} type='submit' variant="contained">Valider</Button>
                                        <Button onClick={() => navigate('/authentication')}>Annuler</Button>
                                    </ButtonGroup>
                                </div>
                            </Stack>
                        </FormContainer>
                    </Box>
                </Box>
            </GoogleReCaptchaProvider>
        )  
    }
        

    function validateReCaptcha(): void {
        console.log('reCapcha validated')
        setCaptchaValidated(true);
    }
}