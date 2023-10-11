import { useState } from 'react'
import { Typography, Button } from "@mui/material"

function Sales() {

    const [currentAction, setCurrentAction] = useState('NONE')

    return <>{getContent()}
    </>

    function getContent() {
        switch (currentAction) {
            case 'NONE': return salesList()
            case 'SALE_CREATION': return saleCreationForm()
        }
    }

    function salesList() {
        return <>
            <Typography>Ventes</Typography>
            <Button variant="contained" size="small" onClick={() => setCurrentAction('SALE_CREATION')}>Créer une vente</Button>
        </>
    }

    function saleCreationForm() {
        return <>
            <Typography>Nouvelle vente</Typography>
            <Button variant="contained" size="small" onClick={() => setCurrentAction('NONE')}>Annuler</Button>
        </>
    }

}

export default Sales