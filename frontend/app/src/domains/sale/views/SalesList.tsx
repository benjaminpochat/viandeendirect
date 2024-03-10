import React from 'react'
import { useEffect, useState } from 'react'
import { Typography, Button } from "@mui/material"

import { useKeycloak } from '@react-keycloak/web'

import SaleCard from '../components/SaleCard.tsx'
import { ApiInvoker } from '../../../api/ApiInvoker.ts'

export default function SalesList({producer: producer, manageSaleOrdersCallback: manageSaleOrdersCallback, createSaleCallback: createSaleCallback}) {

    const { keycloak } = useKeycloak()

    const [sales, setSales] = useState([])
    const apiInvoker = new ApiInvoker()

    useEffect(() => {
        apiInvoker.callApiAuthenticatedly(keycloak, api => api.getProducerSales, producer.id, setSales, console.error)
    }, [keycloak, producer])

    return <>
        <Typography variant='h6'>Ventes</Typography>
        <div className='card-list'>
            {sales.map(sale => <SaleCard sale={sale} manageOrdersCallback={manageSaleOrdersCallback} />)}
        </div>
        <Button variant="contained" size="small" onClick={createSaleCallback}>Créer une vente</Button>
    </>
}