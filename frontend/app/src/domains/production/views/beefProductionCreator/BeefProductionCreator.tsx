import React from "react"
import { useState } from "react"

import { Button, ButtonGroup, Typography, Stepper, Step, StepContent, StepButton, Alert } from "@mui/material"

import 'dayjs/locale/fr'

import BeefProduction from "viandeendirect_eu/dist/model/BeefProduction.js"

import { ApiBuilder } from '../../../../api/ApiBuilder.ts'
import { useKeycloak } from '@react-keycloak/web'

import PackageLotsCreator from "../PackageLotsCreator.tsx"
import BreedingPropertiesForm from "./forms/BreedingPropertiesForm.tsx"
import SlaughterPropertiesForm from "./forms/SlaughterPropertiesForm.tsx"
import CuttingPropertiesForm from "./forms/CuttingPropertiesForm.tsx"
import { BeefProductionService } from "../../service/BeefProductionService.ts"

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

    return <>
            <Typography variant="h6">Nouvel abattage bovin</Typography>
            <Stepper activeStep={activeStep} orientation="vertical">
                <Step 
                    active={activeStep === BREEDING_PROPERTIES_STEP} 
                    disabled={!(completedSteps?.includes(BREEDING_PROPERTIES_STEP))}
                    completed={completedSteps?.includes(BREEDING_PROPERTIES_STEP)}>
                    <StepButton onClick={() => setActiveStep(BREEDING_PROPERTIES_STEP)}>Informations sur l'élevage</StepButton>
                    <StepContent>
                        <BreedingPropertiesForm beefProduction={beefProduction} validFormCallback={validateBreedingProperties} cancelFormCallback={() => cancel()}/>
                    </StepContent>
                </Step>
                <Step 
                    active={activeStep === SLAUGHTER_PROPERTIES_STEP}
                    disabled={!(completedSteps?.includes(SLAUGHTER_PROPERTIES_STEP))}
                    completed={completedSteps?.includes(SLAUGHTER_PROPERTIES_STEP)}>
                    <StepButton onClick={() => setActiveStep(SLAUGHTER_PROPERTIES_STEP)}>Informations sur l'abattage</StepButton>
                    <StepContent>
                        <SlaughterPropertiesForm beefProduction={beefProduction} validFormCallback={validateSlaughterProperties} cancelFormCallback={() => cancel()}/>
                    </StepContent>
                </Step>
                <Step 
                    active={activeStep === CUTTING_PROPERTIES_STEP}
                    disabled={!(completedSteps?.includes(CUTTING_PROPERTIES_STEP))}
                    completed={completedSteps?.includes(CUTTING_PROPERTIES_STEP)}>
                    <StepButton onClick={() => setActiveStep(CUTTING_PROPERTIES_STEP)}>Information sur la découpe</StepButton>
                    <StepContent onClick={() => setActiveStep(CUTTING_PROPERTIES_STEP)}>
                        <CuttingPropertiesForm beefProduction={beefProduction} validFormCallback={validateCuttingProperties} cancelFormCallback={() => cancel()}/>
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
        const beefProductionUpdated = {
            ...beefProduction,
            birthDate: breedingFormData.birthDate,
            birthFarm: breedingFormData.birthFarm,
            birthPlace: breedingFormData.birthPlace,
            animalIdentifier: breedingFormData.animalIdentifier,
            animalType: breedingFormData.animalType,
            cattleBreed: breedingFormData.cattleBreed,
            labelRougeCertified: breedingFormData.labelRougeCertified
        }
        const updateCompletedSteps = [...completedSteps, BREEDING_PROPERTIES_STEP]
        setBeefProduction(beefProductionUpdated)
        setCompletedSteps(updateCompletedSteps)
        console.debug(beefProductionUpdated)
        console.debug(updateCompletedSteps)
        setActiveStep(SLAUGHTER_PROPERTIES_STEP)
    }

    function validateSlaughterProperties(slaughterFormData) {
        const beefProductionUpdated = {
            ...beefProduction,
            slaughterDate: slaughterFormData.slaughterDate,
            slaughterHouse: slaughterFormData.slaughterHouse,
            slaughterPlace: slaughterFormData.slaughterPlace,
            warmCarcassWeight: slaughterFormData.warmCarcassWeight
        }
        setBeefProduction(beefProductionUpdated)
        console.debug(beefProductionUpdated)
        setCompletedSteps([...completedSteps, SLAUGHTER_PROPERTIES_STEP])
        setActiveStep(CUTTING_PROPERTIES_STEP)
    }

    function validateCuttingProperties(cuttingFormData) {
        const beefProductionUpdated = {
            ...beefProduction,
            cuttingDate: cuttingFormData.cuttingDate,
            cuttingPlace: cuttingFormData.cuttingPlace,
            cuttingButcher: cuttingFormData.cuttingButcher
        }
        setBeefProduction(beefProductionUpdated)
        console.debug(beefProductionUpdated)
        setCompletedSteps([...completedSteps, CUTTING_PROPERTIES_STEP])
        setActiveStep(PRODUCTS_STEP)
    }

    function displayAlerts() {
        if(!isTotalQuantitySoldLowerThanMeatWeight()) {
            return <Alert severity="error">Le poids total des produits préparés ne doit pas dépasser la quantité de viande de l'animal.</Alert>
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
