import { useEffect, useState } from 'react'
import { Typography, Button } from "@mui/material"

import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../security/AuthenticatedApiBuilder'

import SaleForm from './SaleForm.js'
import SaleCard from './SaleCard.tsx'
import OrdersList from './OrdersList.tsx'
import Sale from 'viandeendirect_eu/dist/model/Sale'

export default function Sales() {

    const NONE = 'NONE'
    const SALE_CREATION = 'SALE_CREATION'
    const ORDERS_LIST = 'ORDERS_LIST'

    const [currentAction, setCurrentAction] = useState(NONE)
    const [sales, setSales] = useState([])
    const [currentSale, setCurrentSale] = useState(undefined)
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
            case ORDERS_LIST: return ordersList(currentSale)
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
            {sales.map(sale => <SaleCard sale={sale} manageOrdersCallback={(aSale: Sale) => manageOrders(aSale)}/>)}
            <Button variant="contained" size="small" onClick={() => setCurrentAction('SALE_CREATION')}>Créer une vente</Button>
        </>
    }

    function saleCreationForm() {
        return <>
            <SaleForm callback={() => setCurrentAction('NONE')}></SaleForm>
        </>
    }

    function manageOrders(sale: Sale) {
        setCurrentSale(sale)
        setCurrentAction(ORDERS_LIST)
    }

    function ordersList(sale: Sale) {
        return <OrdersList sale={sale} returnCallback={() => {
            setCurrentSale(undefined)
            setCurrentAction(NONE)}
        }/>
    }

}
