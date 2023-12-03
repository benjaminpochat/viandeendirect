import React from 'react'
import { useEffect, useState } from 'react'

import { Button, Typography } from '@mui/material'

import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder.js'

import OrderSummary from '../components/OrderSummary.tsx'

export default function OrderView({order: rawOrder, sale: sale, returnCallback: returnCallback}) {
    
    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    const [order, setOrder] = useState([])

    useEffect(() => {
        loadOrder()
    }, [keycloak])

    function loadOrder() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak);
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getOrder(rawOrder.id, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getOrder called successfully. Returned data: ' + data)
                    setOrder(data)
                }
            })
        }, keycloak)
    }

    return <>
        <Typography variant='h6'>Détails de la commande</Typography>
        <OrderSummary order={order}></OrderSummary>
        <Button onClick={() => returnCallback(sale)}>Retour aux commandes</Button>
    </>
}