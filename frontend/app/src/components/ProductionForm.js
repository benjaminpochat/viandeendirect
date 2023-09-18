import { Button, ButtonGroup, TextField, Typography } from "@mui/material"
import {FormContainer, TextFieldElement} from 'react-hook-form-mui'
import {ApiClient, DefaultApi, BeefProduction, Production} from 'viandeendirect_eu';
//import { BeefProduction } from 'viandeendirect_eu/dist/model/BeefProduction.js'
//import { DefaultApi } from 'viandeendirect_eu/dist/api/DefaultApi.js'
import { useKeycloak } from '@react-keycloak/web'

function ProductionForm({setProductionsCurrentAction}) {

    const { keycloak, initialized } = useKeycloak()

    return <>
        <Typography>Nouvelle production</Typography>

        <FormContainer onSuccess={validate}>
            <TextFieldElement required name="animalIdentifier" label="Numéro d'identification de l'animal" variant="standard" />
            <TextFieldElement required name="animalLiveWeight" label="Poids vif" variant="standard" />
            <TextFieldElement required name="birthDate" label="Date de naissance" variant="standard" />
            <TextFieldElement required name="birthPlace" label="Lieu de naissance" variant="standard" />
            <TextFieldElement required name="slaughterDate" label="Date de l'abattage" variant="standard" />
            <ButtonGroup>
                <Button type='submit' variant="contained" size="small" >Enregistrer</Button>
                <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
            </ButtonGroup>

        </FormContainer>
    </>

    function validate(productionFormData) {
        console.log(productionFormData)
        const production = new BeefProduction()
        production.productionType = "BeefProduction"
        production.animalIdentifier = productionFormData.animalIdentifier
//        production.animalLiveWeight = productionFormData.animalLiveWeight
//        production.birthDate = productionFormData.birthDate
//        production.slaughterDate = productionFormData.slaughterDate
        

        keycloak.updateToken(30).then(function() {
            let apiClient = ApiClient.instance;
            apiClient.authentications['oAuth2ForViandeEnDirect'].accessToken = keycloak.token;
            //apiClient.basePath = process.env.REACT_APP_BACKEND_URL
            apiClient.basePath = '.'
            var api = new DefaultApi(apiClient)
            api.createProduction(production).then(function(data) {
                console.log('API called successfully. Returned data: ' + data);
                setProductionsCurrentAction('NONE')
            }, function(error) {
                console.error(error);
            });
            }).catch(function() {
                alert('Failed to refresh token');
            });        
    }

    function cancel() {
        setProductionsCurrentAction('NONE')
    }
}


export default ProductionForm
