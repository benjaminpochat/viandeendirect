import React from 'react'
import { useEffect, useState } from 'react'
import { Typography, Button } from "@mui/material"

import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder.js'

import SaleCard from '../components/SaleCard.tsx'

export default function SalesList({manageSaleOrdersCallback: manageSaleOrdersCallback, createSaleCallback: createSaleCallback}) {

    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    const [sales, setSales] = useState([])

    useEffect(() => {
        loadSales()
    }, [keycloak])

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

    return <>
        <Typography>Ventes</Typography>
        {sales.map(sale => <SaleCard sale={sale} manageOrdersCallback={manageSaleOrdersCallback} />)}
        <Button variant="contained" size="small" onClick={createSaleCallback}>Créer une vente</Button>
    </>
}