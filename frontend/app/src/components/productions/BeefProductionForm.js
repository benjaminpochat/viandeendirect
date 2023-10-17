import { Button, ButtonGroup, Typography, Stepper, Step, StepLabel, StepContent } from "@mui/material"
import { DatePickerElement, FormContainer, SliderElement, TextFieldElement } from 'react-hook-form-mui'
import { BeefProduction } from 'viandeendirect_eu';
import { AuthenticatedApiBuilder } from '../security/AuthenticatedApiBuilder'
import { useKeycloak } from '@react-keycloak/web'
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useState } from "react"
import { PackageLotsCreator } from "./PackageLotsCreator"
import 'dayjs/locale/fr'

export default function BeefProductionForm({ callback }) {

    const SET_PRODUCTION_PROPERTIES_STEP = 'SELECT_PRODUCTION_STEP'
    const SET_PRODUCTS_STEP = 'SET_PRODUCTS_STEP'

    const { keycloak, initialized } = useKeycloak()
    const [ activeStep, setActiveStep ] = useState(SET_PRODUCTION_PROPERTIES_STEP)
    const authenticayedApiBuilder = new AuthenticatedApiBuilder()

    return <>
            <Typography>Nouvel abattage bovin</Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step active={activeStep === SET_PRODUCTION_PROPERTIES_STEP}>
                    <StepLabel>Définir les caractéristiques de l'abattage</StepLabel>
                    <StepContent>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                            <FormContainer onSuccess={validateProductionProperties} defaultValues={{ "animalLiveWeight": 400 }} >
                                <div className="form">
                                    <div>
                                        <TextFieldElement required name="animalIdentifier" label="Numéro d'identification de l'animal" variant="standard" />
                                    </div>
                                    <div>
                                        <SliderElement min={100} max={1000} step={50} required name="animalLiveWeight" label="Poids vif" variant="standard" />
                                    </div>
                                    <div>
                                        <DatePickerElement required name="birthDate" label="Date de naissance" variant="standard" />
                                    </div>
                                    <div>
                                        <TextFieldElement required name="birthPlace" label="Lieu de naissance" variant="standard" />
                                    </div>
                                    <div>
                                        <DatePickerElement required name="slaughterDate" label="Date de l'abattage" variant="standard" />
                                    </div>
                                    <div>
                                        <ButtonGroup>
                                            <Button type='submit' variant="contained" size="small">Valider</Button>
                                            <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                                        </ButtonGroup>
                                    </div>
                                </div>
                            </FormContainer>
                        </LocalizationProvider>
                    </StepContent>
                </Step>
                <Step active={activeStep === SET_PRODUCTS_STEP}>
                    <StepLabel>Définir les produits</StepLabel>
                    <StepContent>
                        <div className="form">
                            <div>
                                <PackageLotsCreator></PackageLotsCreator>
                            </div>
                            <div>
                                <ButtonGroup>
                                    <Button type='submit' variant="contained" size="small" onClick={() => validate()}>Valider</Button>
                                    <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </StepContent>
                </Step>
            </Stepper>
        </>            


    function validateProductionProperties(productionFormData) {
        console.log(productionFormData)
        const production = new BeefProduction()
        production.productionType = "BeefProduction"
        production.animalIdentifier = productionFormData.animalIdentifier
        production.animalLiveWeight = productionFormData.animalLiveWeight
        production.birthDate = productionFormData.birthDate
        production.slaughterDate = productionFormData.slaughterDate
        production.birthPlace = productionFormData.birthPlace
        setActiveStep(SET_PRODUCTS_STEP)
    }

    function validate(production) {
        var api = authenticayedApiBuilder.getAuthenticatedApi(keycloak);
        authenticayedApiBuilder.invokeAuthenticatedApi(() => {
            api.createProduction(production, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('API called successfully. Returned data: ' + data)
                    callback('NONE')
                }
            })
        }, keycloak);
    }

    function cancel() {
        callback('NONE')
    }
}
