import React from "react"
import { useState } from "react"

import { Button, ButtonGroup, Typography, Stepper, Step, StepLabel, StepContent } from "@mui/material"
import { DatePickerElement, FormContainer, SliderElement, TextFieldElement } from 'react-hook-form-mui'

import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { useKeycloak } from '@react-keycloak/web'

import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import 'dayjs/locale/fr'

import { BeefProduction } from 'viandeendirect_eu';
import PackageLotsCreator from "./PackageLotsCreator.js"

export default function BeefProductionForm({ callback }) {

    const SET_PRODUCTION_PROPERTIES_STEP = 'SELECT_PRODUCTION_STEP'
    const SET_PRODUCTS_STEP = 'SET_PRODUCTS_STEP'

    const { keycloak, initialized } = useKeycloak()
    const [ activeStep, setActiveStep ] = useState(SET_PRODUCTION_PROPERTIES_STEP)
    const [ beefProduction, setBeefProduction] = useState(new BeefProduction())
    const apiBuilder = new ApiBuilder()

    return <>
            <Typography variant="h6">Nouvel abattage bovin</Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step active={activeStep === SET_PRODUCTION_PROPERTIES_STEP}>
                    <StepLabel>Définir les caractéristiques de l'abattage</StepLabel>
                    <StepContent>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                            <FormContainer onSuccess={validateProductionProperties} defaultValues={{ "warmCarcassWeight": 400 }}>
                                <div className="form">
                                    <div>
                                        <TextFieldElement required validation={{ required: 'Champ obligatoire'}} name="animalIdentifier" label="Numéro d'identification de l'animal" variant="standard" />
                                    </div>
                                    <div>
                                        <SliderElement value={beefProduction.warmCarcassWeight} onChange={updateProductionWeigth} min={100} max={1000} step={50} required validation={{ required: 'Champ obligatoire'}} name="warmCarcassWeight" label="Poids estimé de l'animal vif" variant="standard" />
                                        <div>
                                            <span>Poids de carcasse chaude : {beefProduction.warmCarcassWeight} kg</span>
                                        </div>
                                    </div>
                                    <div>
                                        <DatePickerElement required validation={{ required: 'Champ obligatoire'}} name="birthDate" label="Date de naissance" variant="standard" />
                                    </div>
                                    <div>
                                        <TextFieldElement required validation={{ required: 'Champ obligatoire'}} name="birthPlace" label="Lieu de naissance" variant="standard" />
                                    </div>
                                    <div>
                                        <DatePickerElement required validation={{ required: 'Champ obligatoire'}} name="slaughterDate" label="Date de l'abattage" variant="standard" />
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

    function updateProductionWeigth(event, weight) {
        console.log(weight)
        setBeefProduction({...beefProduction, 
            warmCarcassWeight: weight
        })
    }

    function validateProductionProperties(productionFormData) {
        setBeefProduction({...beefProduction, 
            productionType: "BeefProduction",
            animalIdentifier: productionFormData.animalIdentifier,
            warmCarcassWeight: productionFormData.warmCarcassWeight,
            birthDate: productionFormData.birthDate,
            slaughterDate: productionFormData.slaughterDate,
            birthPlace: productionFormData.birthPlace,
        })
        setActiveStep(SET_PRODUCTS_STEP)
    }

    function validate() {
        apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            apiBuilder.invokeAuthenticatedApi(() => {
                api.createBeefProduction(beefProduction, (error, data, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('API called successfully. Returned data: ' + data)
                        callback('PRODUCTIONS_LIST')
                    }
                })
            }, keycloak)
        });
    }

    function cancel() {
        callback('PRODUCTIONS_LIST')
    }
}
