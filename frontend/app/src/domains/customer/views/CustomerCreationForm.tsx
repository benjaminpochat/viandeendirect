import { Box, Button, ButtonGroup, Stepper, Toolbar, Typography } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'
import React from 'react'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import { Customer, User } from 'viandeendirect_eu'
import { ApiInvoker } from '../../../api/ApiInvoker.ts'

export default function CustomerCreationForm({returnCallback: returnCallback, customer: customer}) {

    const { keycloak } = useKeycloak()
    const apiInvoker = new ApiInvoker()

    function storeUserData(userFormData) {
        customer.user.phone = userFormData.phone
        apiInvoker.callApiAuthenticatedly(keycloak, api => api.createCustomer, customer, returnCallback)
    }

    return <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant='h6'>Vos coordonnées</Typography>
        <FormContainer onSuccess={storeUserData} defaultValues={{...customer.user}}>
            <div className="form">
                <div>
                    <TextFieldElement name="lastName" label="Nom" variant="standard" disabled/>
                </div>
                <div>
                    <TextFieldElement name="firstName" label="Prénom" variant="standard" disabled/>
                </div>
                <div>
                    <TextFieldElement name="email" label="Email" variant="standard" disabled/>
                </div>
                <div>
                    <TextFieldElement required name="phone" label="Téléphone mobile" variant="standard" />
                </div>
                <div>
                    <ButtonGroup>
                        <Button type='submit' variant="contained" size="small">Valider</Button>
                    </ButtonGroup>
                </div>
            </div>
        </FormContainer>
    </Box>
}