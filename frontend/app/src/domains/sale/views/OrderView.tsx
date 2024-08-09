import React from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'

import { Button, Typography } from '@mui/material'

import { ApiBuilder } from '../../../api/ApiBuilder.ts'

import OrderSummary from '../components/OrderSummary.tsx'
import { Order } from '@viandeendirect/api/dist/models/Order'

export default function OrderView() {
    
    const navigate = useNavigate()
    const order: Order = useLoaderData()

    return <>
        <Typography variant='h6'>Détails de la commande</Typography>
        <OrderSummary order={order}></OrderSummary>
        <Button onClick={() => navigate(-1)}>Retour aux commandes</Button>
    </>
}

export async function loadOrderViewData(orderId: number, keycloakClient): Promise<Order> {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloakClient)
    return await api.getOrder({orderId})
}