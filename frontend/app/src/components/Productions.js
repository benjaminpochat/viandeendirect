import { useState } from 'react';

import { Button, Typography } from "@mui/material"
import ProductionForm from './ProductionForm';

function Productions() {

    const [currentAction, setCurrentAction] = useState('NONE')

    return <>{getContent()}</>

    function getContent() {
        switch(currentAction) {
            case 'NONE' : return productionsList()
            case 'CREATION' : return <ProductionForm setProductionsCurrentAction={setCurrentAction}/>
       }
    }

    function productionsList() {
        return <>
            <Typography>Productions</Typography>
            <Button variant="contained" size="small" onClick={() => setCurrentAction('CREATION')}>Créer une production</Button>
        </>
    }
}

export default Productions