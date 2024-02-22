import React from "react"
import { useState } from "react"

import { Button, ButtonGroup, Typography, Stepper, Step, StepContent, StepButton, Alert } from "@mui/material"

import 'dayjs/locale/fr'

import BeefProduction from "viandeendirect_eu/dist/model/BeefProduction.js"

import { ApiBuilder } from '../../../../api/ApiBuilder.ts'
import { useKeycloak } from '@react-keycloak/web'

import PackageLotsCreator from "../PackageLotsCreator.tsx"
import {BreedingPropertiesForm, mapBreedingFormDataToBeefProduction as mapBreedingFormDataToBeefProduction} from "./forms/BreedingPropertiesForm.tsx"
import SlaughterPropertiesForm, { mapSlaughterFormDataToBeefProduction } from "./forms/SlaughterPropertiesForm.tsx"
import CuttingPropertiesForm, { mapCuttingFormDataToBeefProduction } from "./forms/CuttingPropertiesForm.tsx"
import { BeefProductionService } from "../../service/BeefProductionService.ts"
import { useForm } from "react-hook-form"
import dayjs from "dayjs"

export default function BeefProductionCreator({ callback }) {

    const BREEDING_PROPERTIES_STEP = 0
    const SLAUGHTER_PROPERTIES_STEP = 1
    const CUTTING_PROPERTIES_STEP = 2
    const PRODUCTS_STEP = 3

    const { keycloak } = useKeycloak()
    const [ activeStep, setActiveStep ] = useState<number>(BREEDING_PROPERTIES_STEP)
    const [ beefProduction, setBeefProduction] = useState<BeefProduction>({ productionType: "BeefProduction"})
    const [completedSteps, setCompletedSteps] = useState<Array<number>>([])
    const apiBuilder = new ApiBuilder()

    const breedingPropertiesForm = useForm<BeefProduction>({defaultValues: {
        ...beefProduction,
        birthDate: beefProduction.birthDate ? dayjs(beefProduction.birthDate) : undefined
    }})

    const slaughterPropertiesForm = useForm<BeefProduction>({defaultValues: {
        ...beefProduction,
        slaughterDate: beefProduction.slaughterDate ? dayjs(beefProduction.slaughterDate) : undefined
    }})

    const cuttingPropertiesForm = useForm<BeefProduction>({defaultValues: {
        ...beefProduction,
        cuttingDate: beefProduction.cuttingDate ? dayjs(beefProduction.cuttingDate) : undefined
    }})

    return <>
            <Typography variant="h6">Nouvel abattage bovin</Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step 
                    active={activeStep === BREEDING_PROPERTIES_STEP} 
                    disabled={!(completedSteps?.includes(BREEDING_PROPERTIES_STEP))}
                    completed={completedSteps?.includes(BREEDING_PROPERTIES_STEP)}>
                    <StepButton onClick={() => setActiveStep(BREEDING_PROPERTIES_STEP)}>Informations sur l'élevage</StepButton>
                    <StepContent>
                        <BreedingPropertiesForm form={breedingPropertiesForm}/>
                        <ButtonGroup>
                            <Button onClick={breedingPropertiesForm.handleSubmit(validateBreedingProperties)} variant="contained" size="small">Valider</Button>
                            <Button onClick={cancel} variant="outlined" size="small">Abandonner</Button>
                        </ButtonGroup>
                    </StepContent>
                </Step>
                <Step 
                    active={activeStep === SLAUGHTER_PROPERTIES_STEP}
                    disabled={!(completedSteps?.includes(SLAUGHTER_PROPERTIES_STEP))}
                    completed={completedSteps?.includes(SLAUGHTER_PROPERTIES_STEP)}>
                    <StepButton onClick={() => setActiveStep(SLAUGHTER_PROPERTIES_STEP)}>Informations sur l'abattage</StepButton>
                    <StepContent>
                        <SlaughterPropertiesForm form={slaughterPropertiesForm} minSlaughterDate={beefProduction.birthDate}/>
                        <ButtonGroup>
                            <Button onClick={slaughterPropertiesForm.handleSubmit(validateSlaughterProperties)} variant="contained" size="small">Valider</Button>
                            <Button onClick={cancel} variant="outlined" size="small">Abandonner</Button>
                        </ButtonGroup>
                    </StepContent>
                </Step>
                <Step 
                    active={activeStep === CUTTING_PROPERTIES_STEP}
                    disabled={!(completedSteps?.includes(CUTTING_PROPERTIES_STEP))}
                    completed={completedSteps?.includes(CUTTING_PROPERTIES_STEP)}>
                    <StepButton onClick={() => setActiveStep(CUTTING_PROPERTIES_STEP)}>Information sur la découpe</StepButton>
                    <StepContent onClick={() => setActiveStep(CUTTING_PROPERTIES_STEP)}>
                        <CuttingPropertiesForm form={cuttingPropertiesForm} minCuttingDate={beefProduction.slaughterDate}/>
                        <ButtonGroup>
                            <Button onClick={cuttingPropertiesForm.handleSubmit(validateCuttingProperties)} variant="contained" size="small">Valider</Button>
                            <Button onClick={cancel} variant="outlined" size="small" >Abandonner</Button>
                        </ButtonGroup>

                    </StepContent>
                </Step>
                <Step 
                    active={activeStep === PRODUCTS_STEP}
                    disabled={!beefProduction.lots}
                    completed={getTotalQuantitySold() > 0}>
                    <StepButton onClick={() => setActiveStep(PRODUCTS_STEP)}>Produits préparés</StepButton>
                    <StepContent>
                        <div className="form">
                            {displayAlerts()}
                            <div>
                                <PackageLotsCreator production={beefProduction} changeProductionCallback={setBeefProduction}></PackageLotsCreator>
                            </div>
                            <div>
                                <ButtonGroup>
                                    <Button type='submit' variant="contained" size="small" onClick={() => validate() } disabled={!isTotalQuantitySoldLowerThanMeatWeight() || getTotalQuantitySold() === 0}>Valider</Button>
                                    <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </StepContent>
                </Step>
            </Stepper>
        </>            

    function validateBreedingProperties(breedingFormData) {
        setBeefProduction(mapBreedingFormDataToBeefProduction(breedingFormData, beefProduction))
        setCompletedSteps([...completedSteps, BREEDING_PROPERTIES_STEP])
        setActiveStep(SLAUGHTER_PROPERTIES_STEP)
    }

    function validateSlaughterProperties(slaughterFormData) {
        setBeefProduction(mapSlaughterFormDataToBeefProduction(slaughterFormData, beefProduction))
        setCompletedSteps([...completedSteps, SLAUGHTER_PROPERTIES_STEP])
        setActiveStep(CUTTING_PROPERTIES_STEP)
    }

    function validateCuttingProperties(cuttingFormData) {
        setBeefProduction(mapCuttingFormDataToBeefProduction(cuttingFormData, beefProduction))
        setCompletedSteps([...completedSteps, CUTTING_PROPERTIES_STEP])
        setActiveStep(PRODUCTS_STEP)
    }

    function displayAlerts() {
        if(!isTotalQuantitySoldLowerThanMeatWeight()) {
            const meatQuantity = BeefProductionService.getMeatWeight(beefProduction.warmCarcassWeight)
            return <Alert severity="error">Le poids total des produits préparés ne doit pas dépasser la quantité de viande de l'animal estimée à {meatQuantity} kg.</Alert>
        }
    }

    function isTotalQuantitySoldLowerThanMeatWeight() {
        return getTotalQuantitySold() < BeefProductionService.getMeatWeight(beefProduction.warmCarcassWeight)
    }

    function getTotalQuantitySold() {
        return beefProduction.lots?.map(lot => lot.netWeight * lot.quantity).reduce((total, added) => total + added) || 0
    }

    function validate() {
        console.debug(beefProduction)
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
