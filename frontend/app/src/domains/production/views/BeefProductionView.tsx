import { Typography, ButtonGroup, Button, Tab, Tabs } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import BreedingPropertiesForm from './beefProductionCreator/forms/BreedingPropertiesForm.tsx'
import SlaughterPropertiesForm from './beefProductionCreator/forms/SlaughterPropertiesForm.tsx'
import CuttingPropertiesForm from './beefProductionCreator/forms/CuttingPropertiesForm.tsx'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


export default function BeefProductionView({ beefProduction: beefProduction, backCallback: backCallback }) {

    const [currentTab, setCurrentTab] = React.useState<number>(0);

    const changeTab = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };


    return <>
        <Typography variant="h6">Abattage bovin</Typography>
            <Tabs value={currentTab} onChange={changeTab} variant='scrollable' allowScrollButtonsMobile >
                <Tab label="Elevage"/>
                <Tab label="Abattage"/>
                <Tab label="Découpe"/>
                <Tab label="Colis"/>
            </Tabs>
            <div hidden={currentTab !== 0}>
                <BreedingPropertiesForm beefProduction={beefProduction} validFormCallback={undefined} cancelFormCallback={undefined} />
            </div>
            <div hidden={currentTab !== 1}>
                <SlaughterPropertiesForm beefProduction={beefProduction} validFormCallback={undefined} cancelFormCallback={undefined} />
            </div>
            <div hidden={currentTab !== 2}>
                <CuttingPropertiesForm beefProduction={beefProduction} validFormCallback={undefined} cancelFormCallback={undefined} />
            </div>
            <div hidden={currentTab !== 3}>
            </div>

        <div>
            <ButtonGroup>
                <Button variant="contained" size="small" onClick={() => backCallback()}>Retour</Button>
                <Button variant="outlined" size="small" >Modifier</Button>
                <Button variant="outlined" size="small" >Supprimer</Button>
            </ButtonGroup>
        </div>
    </>
}