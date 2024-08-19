import React from 'react'
import { useEffect, useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom';

import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../api/ApiBuilder.ts'

import { AppBar, Box, Button, CircularProgress, CssBaseline, Toolbar, Typography } from '@mui/material'

import OrderSummary from '../../domains/sale/components/OrderSummary.tsx'
import { Order } from '@viandeendirect/api/dist/models/Order.js';
import { AuthenticationService } from '../../authentication/service/AuthenticationService.ts';


export default function PaymentLayout() {
    const { keycloak, initialized } = useKeycloak()
    const apiBuilder = new ApiBuilder()
    const authenticationService = new AuthenticationService(keycloak)
    const { orderId } = useParams()
    const [forbiddenAccess, setForbiddenAccess] = useState<Boolean>(false)
    const [order, setOrder] = useState<Order>({})
    const [orderAccessError, setOrderAccessError] = useState<Boolean>(false)
    let intervalId = 0

    useEffect(() => {
        if (initialized) {
            intervalId = setInterval(loadOrder, 1000)
        }
    }, [initialized])

    async function loadOrder() {
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        try {
            const loadedOrder = await api.getOrder({orderId: +orderId})
            if (loadedOrder.status !== 'PAYMENT_PENDING') {
                clearInterval(intervalId)
            }
            setOrder(loadedOrder)
        } catch (error) {
            console.error(error)
            if (error.response.status === 403 || error.response.status === 401) {
                setForbiddenAccess(true)
                clearInterval(intervalId)
            }
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Viande en direct
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {getContent()}
            </Box>
        </Box>
    )

    function getContent() {
        if (forbiddenAccess) {
            return <>
                <Typography variant='h5'>Désolé, vous n'êtes pas autorisé à consulter cette commande</Typography>
                <Button variant='contained' onClick={() => window.open('/', '_self')}>Retour à l'accueil</Button>
            </>
        }
        if (authenticationService.isAuthenticated()) {
            return <>
                <div>
                    {getPaymentState()}
                    {getOrderSummary()}
                </div>
                <Button variant='contained' onClick={() => window.open('/', '_self')}>Retour à l'accueil</Button>
            </>
        } else {
            return <>
                <Typography variant='h5'>Vous devez vous identifier pour voir l'état de votre commande</Typography>
                <Button variant='contained' onClick={() => keycloak.login()}>S'identifier</Button>
            </>
        }
    }

    function getPaymentState(){
        if (order) {
            if (order.status === "PAYMENT_COMPLETED") {
                return <>
                    <Typography variant='h5'>Votre paiement est validé</Typography>
                    <Typography variant='h5'>Votre commande a bien été prise en compte</Typography>
                </>
            } else if (order.status === 'PAYMENT_ABORTED') {
                return <>
                    <Typography variant='h5'>Votre paiement n'a pas été validé</Typography>
                    <Typography variant='h5'>Votre commande a été annulée</Typography>
                </>
            } else if (order.status === 'PAYMENT_PENDING') {
                return <>
                    <Typography variant='h5'>Votre paiement est en cours</Typography>
                    <CircularProgress/>
                </>
            } else if (order.status === 'BOOKED_WITHOUT_PAYMENT') {
                return <Typography variant='h5'>Votre commande est réservée et n'a pas encore été payée</Typography>
            } else if (order.status === 'DELIVERED') {
                return <Typography variant='h5'>Votre commande vous a été livrée</Typography>
            } else {
                return <Typography variant='h5'>L'état de votre commande est indéterminé : veuillez contacter viandeendirect.eu</Typography>
            }
        }
    }

    function getOrderSummary() {
        if (order) {
            return <>
                        <Typography variant='h6'>Détails de la commande</Typography>
                        <OrderSummary order={order}></OrderSummary>
            </>
        }
    }
}
