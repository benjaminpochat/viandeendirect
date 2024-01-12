import React from 'react'
import { useEffect, useState } from 'react'
import { Typography, Button } from "@mui/material"

import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'

import SaleCard from '../components/SaleCard.tsx'

export default function SalesList({manageSaleOrdersCallback: manageSaleOrdersCallback, createSaleCallback: createSaleCallback}) {

    const { keycloak, initialized } = useKeycloak()
    const apiBuilder = new ApiBuilder()

    const [sales, setSales] = useState([])

    useEffect(() => {
        loadSales()
    }, [keycloak])

    function loadSales() {
        apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            apiBuilder.invokeAuthenticatedApi(() => {
                api.getSales((error, data, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('api.getSales called successfully. Returned data: ' + data)
                        setSales(data)
                    }
                })
            }, keycloak)
        })
    }

    return <>
        <Typography variant='h6'>Ventes</Typography>
        <div className='card-list'>
            {sales.map(sale => <SaleCard sale={sale} manageOrdersCallback={manageSaleOrdersCallback} />)}
        </div>
        <Button variant="contained" size="small" onClick={createSaleCallback}>Créer une vente</Button>
    </>
}