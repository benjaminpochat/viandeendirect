import React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Typography, ButtonGroup, Button, Tab, Tabs } from '@mui/material'
import dayjs from 'dayjs'
import BreedingPropertiesForm, { mapBreedingFormDataToBeefProduction } from './forms/BreedingPropertiesForm.tsx'
import SlaughterPropertiesForm, { mapSlaughterFormDataToBeefProduction } from './forms/SlaughterPropertiesForm.tsx'
import CuttingPropertiesForm, { mapCuttingFormDataToBeefProduction } from './forms/CuttingPropertiesForm.tsx'
import BeefProduction from "viandeendirect_eu/dist/model/BeefProduction.js"
import PackageLotsCreator from '../PackageLotsCreator.tsx'

export default function BeefProductionView({ beefProduction: beefProduction, backCallback: backCallback }) {

    const BREEDING_PROPERTIES_TAB = 0
    const SLAUGHTER_PROPERTIES_TAB = 1
    const CUTTING_PROPERTIES_TAB = 2
    const PRODUCTS_TAB = 3

    const [currentTab, setCurrentTab] = useState<number>(BREEDING_PROPERTIES_TAB)
    const [readOnly, setReadOnly] = useState<boolean>(true)
    const [production, setProduction] = useState<BeefProduction>(
        {...beefProduction,
            lots: beefProduction.lots ? beefProduction.lots.map((lot) => {return {...lot}}) : undefined
        })
    const [saveEnabled, setSaveEnabled] = useState<boolean>(true)

    const changeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const breedingPropertiesForm = useForm<BeefProduction>({defaultValues: {
        ...beefProduction,
        birthDate: production.birthDate ? dayjs(production.birthDate) : undefined
    }})

    const slaughterPropertiesForm = useForm<BeefProduction>({defaultValues: {
        ...production,
        slaughterDate: production.slaughterDate ? dayjs(production.slaughterDate) : undefined
    }})

    const cuttingPropertiesForm = useForm<BeefProduction>({defaultValues: {
        ...production,
        cuttingDate: production.cuttingDate ? dayjs(production.cuttingDate) : undefined
    }})

    return <>
        <Typography variant="h6">Abattage bovin</Typography>
            <Tabs value={currentTab} onChange={changeTab} variant='scrollable' allowScrollButtonsMobile >
                <Tab label="Elevage" disabled={!readOnly}/>
                <Tab label="Abattage" disabled={!readOnly}/>
                <Tab label="Découpe" disabled={!readOnly}/>
                <Tab label="Colis" disabled={!readOnly}/>
            </Tabs>
            <div hidden={currentTab !== 0}>
                <BreedingPropertiesForm 
                    form={breedingPropertiesForm} 
                    disabled={readOnly} 
                    maxBirthDate={production.slaughterDate}/>
            </div>
            <div hidden={currentTab !== 1}>
                <SlaughterPropertiesForm 
                    form={slaughterPropertiesForm} 
                    disabled={readOnly} 
                    minSlaughterDate={production.birthDate} 
                    maxSlaughterDate={production.cuttingDate}
                    initialWarmCarcassWeight={production.warmCarcassWeight}/>
            </div>
            <div hidden={currentTab !== 2}>
                <CuttingPropertiesForm 
                    form={cuttingPropertiesForm} 
                    disabled={readOnly} 
                    minCuttingDate={production.slaughterDate} />
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
                <Button variant="contained" size="small" onClick={() => backCallback()} >Retour</Button>
                <Button variant="outlined" size="small" onClick={() => setReadOnly(false)} >Modifier</Button>
            </ButtonGroup>
        }
        return <ButtonGroup>
                <Button variant="contained" size="small" onClick={saveUpdate()} disabled={!saveEnabled}>Sauvegarder</Button>
                <Button variant="outlined" size="small" onClick={cancelUpdate} >Abandonner</Button>
            </ButtonGroup>
    }

    function saveUpdate() {
        switch (currentTab) {
            case BREEDING_PROPERTIES_TAB: 
                return breedingPropertiesForm.handleSubmit((breedingFormData) => {
                    setProduction(mapBreedingFormDataToBeefProduction(breedingFormData, production))
                    setReadOnly(true)
            })
            case SLAUGHTER_PROPERTIES_TAB: 
                return slaughterPropertiesForm.handleSubmit((slaughterFormData) => {
                    setProduction(mapSlaughterFormDataToBeefProduction(slaughterFormData, production))
                    setReadOnly(true) 
                })
            case CUTTING_PROPERTIES_TAB:
                return cuttingPropertiesForm.handleSubmit((cuttingFormData) => {
                    setProduction(mapCuttingFormDataToBeefProduction(cuttingFormData, production))
                    setReadOnly(true) 
                })
            case PRODUCTS_TAB:
                return () => {
                    setReadOnly(true) 
                }
        }
    }

    function cancelUpdate() {
        switch (currentTab) {
            case BREEDING_PROPERTIES_TAB: 
                return breedingPropertiesForm.reset(() => {
                    setProduction(beefProduction)
                    setReadOnly(true)
                })
            case SLAUGHTER_PROPERTIES_TAB:
                return slaughterPropertiesForm.reset(() => {
                    setProduction({...beefProduction,
                        lots: beefProduction.lots ? beefProduction.lots.map((lot) => {return {...lot}}) : undefined
                    })
                    setReadOnly(true)
                })
            case CUTTING_PROPERTIES_TAB:
                return cuttingPropertiesForm.reset(() => {
                    setProduction({...beefProduction,
                        lots: beefProduction.lots ? beefProduction.lots.map((lot) => {return {...lot}}) : undefined
                    })
                    setReadOnly(true)
                })
            case PRODUCTS_TAB:
                setProduction({...beefProduction,
                    lots: beefProduction.lots ? beefProduction.lots.map((lot) => {return {...lot}}) : undefined
                })
                setSaveEnabled(true)
                setReadOnly(true) 
        }
    }
}