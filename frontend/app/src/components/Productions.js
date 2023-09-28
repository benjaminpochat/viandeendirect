import { useState } from 'react';

import { Button, Typography } from "@mui/material"
import BeefProductionForm from './BeefProductionForm';

function Productions() {

    const [currentAction, setCurrentAction] = useState('NONE')

    return <>{getContent()}</>

    function getContent() {
        switch(currentAction) {
            case 'NONE' : return productionsList()
            case 'BEEF_PRODUCTION_CREATION' : return <BeefProductionForm setProductionsCurrentAction={setCurrentAction}/>
       }
    }

    function productionsList() {
        return <>
            <Typography>Productions</Typography>
            <Button variant="contained" size="small" onClick={() => setCurrentAction('BEEF_PRODUCTION_CREATION')}>Ajouter un abattage bovin</Button>
        </>
    }
}

export default Productions