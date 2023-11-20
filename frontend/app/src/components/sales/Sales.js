import { useEffect, useState } from 'react'
import { Typography, Button } from "@mui/material"

import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../security/AuthenticatedApiBuilder'

import SaleForm from './SaleForm'
import SaleCard from './SaleCard'

export default function Sales() {

    const NONE = 'NONE'
    const SALE_CREATION = 'SALE_CREATION'

    const [currentAction, setCurrentAction] = useState(NONE)
    const [sales, setSales] = useState([])
    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    useEffect(() => {
        loadSales()
    }, [keycloak])

    return getContent()

    function getContent() {
        switch (currentAction) {
            case NONE: return salesList()
            case SALE_CREATION: return saleCreationForm()
        }
    }

    function loadSales() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak)
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getSales({}, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getSales called successfully. Returned data: ' + data)
                    setSales(data)
                }
            })
        }, keycloak)        
    }

    function salesList() {
        return <>
            <Typography>Ventes</Typography>
            {sales.map(sale => <SaleCard sale={sale}/>)}
            <Button variant="contained" size="small" onClick={() => setCurrentAction('SALE_CREATION')}>Créer une vente</Button>
        </>
    }

    function saleCreationForm() {
        return <>
            <SaleForm callback={() => setCurrentAction('NONE')}></SaleForm>
        </>
    }

}
