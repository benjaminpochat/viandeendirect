import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Typography, ButtonGroup, Button, Tab, Tabs, Alert } from '@mui/material'
import dayjs from 'dayjs'
import BreedingPropertiesForm, { mapBreedingFormDataToBeefProduction } from './forms/BreedingPropertiesForm.tsx'
import SlaughterPropertiesForm, { mapSlaughterFormDataToBeefProduction } from './forms/SlaughterPropertiesForm.tsx'
import CuttingPropertiesForm, { mapCuttingFormDataToBeefProduction } from './forms/CuttingPropertiesForm.tsx'
import { BeefProduction } from "@viandeendirect/api/dist/models/BeefProduction.js"
import PackageLotsCreator from '../PackageLotsCreator.tsx'
import { useKeycloak } from '@react-keycloak/web'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { ApiBuilder } from '../../../../api/ApiBuilder.ts'
import { Production } from '@viandeendirect/api/dist/models/Production'

export default function BeefProductionView() {

    const BREEDING_PROPERTIES_TAB = 0
    const SLAUGHTER_PROPERTIES_TAB = 1
    const CUTTING_PROPERTIES_TAB = 2
    const PRODUCTS_TAB = 3

    const { keycloak } = useKeycloak()
    const navigate = useNavigate();
    const loadedProduction = useLoaderData()
    const apiBuilder = new ApiBuilder()


    const [currentTab, setCurrentTab] = useState<number>(BREEDING_PROPERTIES_TAB)
    const [readOnly, setReadOnly] = useState<boolean>(true)
    const [production, setProduction] = useState<BeefProduction>(loadedProduction)
    

    const [saveEnabled, setSaveEnabled] = useState<boolean>(true)
    const [alerts, setAlerts] = useState<string>(undefined)

    const changeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const breedingPropertiesForm = useForm<BeefProduction>({defaultValues: {
        ...production,
        birthDate: production?.birthDate ? dayjs(production.birthDate) : undefined
    }})

    const slaughterPropertiesForm = useForm<BeefProduction>({defaultValues: {
        ...production,
        slaughterDate: production?.slaughterDate ? dayjs(production.slaughterDate) : undefined
    }})

    const cuttingPropertiesForm = useForm<BeefProduction>({defaultValues: {
        ...production,
        cuttingDate: production?.cuttingDate ? dayjs(production.cuttingDate) : undefined
    }})

    return <>
        <Typography variant="h6">Abattage bovin</Typography>
            <Tabs value={currentTab} onChange={changeTab} variant='scrollable' allowScrollButtonsMobile >
                <Tab label="Elevage" disabled={!readOnly}/>
                <Tab label="Abattage" disabled={!readOnly}/>
                <Tab label="Découpe" disabled={!readOnly}/>
                <Tab label="Colis" disabled={!readOnly}/>
            </Tabs>
            {displayAlerts()}
            <div hidden={currentTab !== 0}>
                <BreedingPropertiesForm 
                    form={breedingPropertiesForm} 
                    disabled={readOnly} 
                    maxBirthDate={production?.slaughterDate}/>
            </div>
            <div hidden={currentTab !== 1}>
                <SlaughterPropertiesForm 
                    form={slaughterPropertiesForm} 
                    disabled={readOnly} 
                    minSlaughterDate={production?.birthDate} 
                    maxSlaughterDate={production?.cuttingDate}
                    initialWarmCarcassWeight={production?.warmCarcassWeight}/>
            </div>
            <div hidden={currentTab !== 2}>
                <CuttingPropertiesForm 
                    form={cuttingPropertiesForm} 
                    disabled={readOnly} 
                    minCuttingDate={production?.slaughterDate} />
            </div>
            <div hidden={currentTab !== 3}>
                <div>
                    <PackageLotsCreator
                        production={production} 
                        disabled={readOnly}
                        changeQuantitiesCompliancyCallback={setSaveEnabled}/>
                </div>
            </div>
            {getButtons()}
    </>

    function getButtons() {
        if (readOnly) {
            return <ButtonGroup>
                <Button variant="contained" size="small" onClick={() => navigate(-1)} >Retour</Button>
                <Button variant="outlined" size="small" onClick={() => setReadOnly(false)} >Modifier</Button>
            </ButtonGroup>
        }
        return <ButtonGroup>
                <Button variant="contained" size="small" onClick={handleSave()} disabled={!saveEnabled}>Sauvegarder</Button>
                <Button variant="outlined" size="small" onClick={cancelUpdate} >Abandonner</Button>
            </ButtonGroup>
    }

    function handleSave() {
        switch (currentTab) {
            case BREEDING_PROPERTIES_TAB: 
                return breedingPropertiesForm.handleSubmit((breedingFormData) => {
                    const updatedProduction = mapBreedingFormDataToBeefProduction(breedingFormData, production)
                    setProduction(updatedProduction)
                    saveProduction(updatedProduction)
            })
            case SLAUGHTER_PROPERTIES_TAB: 
                return slaughterPropertiesForm.handleSubmit((slaughterFormData) => {
                    const updatedProduction = mapSlaughterFormDataToBeefProduction(slaughterFormData, production)
                    setProduction(updatedProduction)
                    saveProduction(updatedProduction)
                })
            case CUTTING_PROPERTIES_TAB:
                return cuttingPropertiesForm.handleSubmit((cuttingFormData) => {
                    const updatedProduction = mapCuttingFormDataToBeefProduction(cuttingFormData, production)
                    setProduction(updatedProduction)
                    saveProduction(updatedProduction)
                })
            case PRODUCTS_TAB:
                return () => saveProduction(production)
        }
    }

    async function saveProduction(updatedProduction) {
        setAlerts(undefined)
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        try {
            await api.createBeefProduction({beefProduction: updatedProduction})
            setReadOnly(true)
        } catch (error) {
            const reader = error.response.body.getReader()
            const chunk  = await reader.read()
            const errorAsJson = new TextDecoder().decode(chunk.value);
            const errorAsObject = JSON.parse(errorAsJson)
            setAlerts(errorAsObject.message)
        }
    }

    async function cancelUpdate() {
        setAlerts(undefined)
        switch (currentTab) {
            case BREEDING_PROPERTIES_TAB: 
                return breedingPropertiesForm.reset(() => {
                    setProduction(production)
                    setReadOnly(true)
                })
            case SLAUGHTER_PROPERTIES_TAB:
                return slaughterPropertiesForm.reset(() => {
                    setProduction({...production,
                        lots: production?.lots ? production?.lots.map((lot) => {return {...lot}}) : undefined
                    })
                    setReadOnly(true)
                })
            case CUTTING_PROPERTIES_TAB:
                return cuttingPropertiesForm.reset(() => {
                    setProduction({...production,
                        lots: production?.lots ? production?.lots.map((lot) => {return {...lot}}) : undefined
                    })
                    setReadOnly(true)
                })
            case PRODUCTS_TAB:
                const reloadedProduction = await reloadProduction(production.id)
                setProduction({...production,
                    lots: reloadedProduction?.lots ? reloadedProduction?.lots : undefined
                })
                setSaveEnabled(true)
                setReadOnly(true) 
        }
    }

    async function reloadProduction(beefProductionId: number): Promise<Production> {
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        return await api.getBeefProduction({beefProductionId: beefProductionId})
    }

    function displayAlerts() {
        if (alerts) {
            return <Alert severity="error">{alerts}</Alert>
        }
    }
}

export async function loadBeefProductionViewData(beefProductionId: number, keycloakClient): Promise<BeefProduction> {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloakClient)
    const beefProduction = await api.getBeefProduction({beefProductionId: beefProductionId})
    return beefProduction

}