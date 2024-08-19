import { Box, Button, ButtonGroup, Stepper, Toolbar, Typography } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'
import React from 'react'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import { Customer } from '@viandeendirect/api/dist/models/Customer'
import { User } from '@viandeendirect/api/dist/models/User'
import { AuthenticationService } from '../../../authentication/service/AuthenticationService.ts'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'

export default function CustomerCreationForm() {

    const { keycloak } = useKeycloak()
    const navigate = useNavigate()
    const apiBuilder = new ApiBuilder()
    const customer: Customer = useLoaderData()

    async function storeUserData(userFormData) {
        customer.user.phone = userFormData.phone
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        await api.createCustomer({customer: customer})
        navigate(-1)
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

export function loadCustomerCreationFormData(keycloak): Customer {
    const authenticationService = new AuthenticationService(keycloak)
    const customer: Customer = {}
    const user: User = {}
    user.email = authenticationService.getCurrentUserEmail()
    user.firstName = authenticationService.getCurrentUserFirstName()
    user.lastName = authenticationService.getCurrentUserLastName()
    customer.user = user
    return customer
}