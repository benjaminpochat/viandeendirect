import { Button, ButtonGroup, TextField, Typography } from "@mui/material"
import {DatePickerElement, FormContainer, SliderElement, TextFieldElement} from 'react-hook-form-mui'
import {ApiClient, DefaultApi, BeefProduction, Production} from 'viandeendirect_eu';
//import { BeefProduction } from 'viandeendirect_eu/dist/model/BeefProduction.js'
//import { DefaultApi } from 'viandeendirect_eu/dist/api/DefaultApi.js'
import { useKeycloak } from '@react-keycloak/web'
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import { useState } from "react";

function BeefProductionForm({setProductionsCurrentAction}) {

    const { keycloak, initialized } = useKeycloak()

    return <>
        <Typography>Nouvel abattage bovin</Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
        <FormContainer onSuccess={validate} defaultValues={{"animalLiveWeight":400}} >
            <TextFieldElement required name="animalIdentifier" label="Numéro d'identification de l'animal" variant="standard" />
            <SliderElement min={100} max={1000} step={50} required name="animalLiveWeight" label="Poids vif" variant="standard" />
            <DatePickerElement required name="birthDate" label="Date de naissance" variant="standard" />
            <TextFieldElement required name="birthPlace" label="Lieu de naissance" variant="standard" />
            <DatePickerElement required name="slaughterDate" label="Date de l'abattage" variant="standard" />
            <ButtonGroup>
                <Button type='submit' variant="contained" size="small" >Enregistrer</Button>
                <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
            </ButtonGroup>
        </FormContainer>
        </LocalizationProvider>
        
    </>

    function validate(productionFormData) {
        console.log(productionFormData)
        const production = new BeefProduction()
        production.productionType = "BeefProduction"
        production.animalIdentifier = productionFormData.animalIdentifier
        production.animalLiveWeight = productionFormData.animalLiveWeight
        production.birthDate = productionFormData.birthDate
        production.slaughterDate = productionFormData.slaughterDate
        production.birthPlace = productionFormData.birthPlace
        

        keycloak.updateToken(30).then(function() {
            let apiClient = ApiClient.instance;
            apiClient.authentications['oAuth2ForViandeEnDirect'].accessToken = keycloak.token;
            apiClient.basePath = '.'
            var api = new DefaultApi(apiClient)
            api.createProduction(production, (error, data, response) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('API called successfully. Returned data: ' + data);
                    setProductionsCurrentAction('NONE')
                }
            })
        }).catch(function() {
            alert('Failed to refresh token');
        })
    }

    function cancel() {
        setProductionsCurrentAction('NONE')
    }
}


export default BeefProductionForm
