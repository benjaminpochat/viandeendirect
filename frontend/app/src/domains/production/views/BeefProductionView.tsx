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

    const [currentTab, setCurrentTab] = React.useState('1');

    const changeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };


    return <>
        <Typography variant="h6">Abattage bovin</Typography>
        <TabContext value={currentTab}>
            <TabList onChange={changeTab}>
                <Tab label="Elevage" value="1" />
                <Tab label="Abattage" value="2" />
                <Tab label="Découpe" value="3" />
                <Tab label="Colis" value="4" />
            </TabList>
            <TabPanel value="1">
                <BreedingPropertiesForm beefProduction={beefProduction} validFormCallback={undefined} cancelFormCallback={undefined} />
            </TabPanel>
            <TabPanel value="2">
                <SlaughterPropertiesForm beefProduction={beefProduction} validFormCallback={undefined} cancelFormCallback={undefined} />
            </TabPanel>
            <TabPanel value="3">
                <CuttingPropertiesForm beefProduction={beefProduction} validFormCallback={undefined} cancelFormCallback={undefined} />
            </TabPanel>
            <TabPanel value="4">
            </TabPanel>
        </TabContext>

        <div>
            <ButtonGroup>
                <Button variant="contained" size="small" onClick={() => backCallback()}>Retour</Button>
                <Button variant="outlined" size="small" >Modifier</Button>
                <Button variant="outlined" size="small" >Supprimer</Button>
            </ButtonGroup>
        </div>
    </>
}