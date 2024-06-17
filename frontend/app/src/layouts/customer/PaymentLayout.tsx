import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../api/ApiBuilder.ts'

import { AppBar, Box, Button, CssBaseline, Toolbar, Typography } from '@mui/material'

import OrderSummary from '../../domains/sale/components/OrderSummary.tsx'
import Order from 'viandeendirect_eu/dist/model/Order.js';


export default function PaymentLayout({paymentSuccessful: paymentSuccessful}) {
    const { keycloak, initialized } = useKeycloak()
    const apiBuilder = new ApiBuilder()
    let { orderId } = useParams()

    const [order, setOrder] = useState<Order>()

    useEffect(() => {
        loadOrder()
    }, [keycloak])

    function loadOrder() {
        apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            apiBuilder.invokeAuthenticatedApi(() => {
                api.getOrder(orderId, (error, data, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('api.getOrder called successfully. Returned data: ' + data)
                        setOrder(data)
                    }
                })
            }, keycloak)
        })
    }

    if (order) {
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
                    {getPaymentState()}
                    <Button variant='contained' onClick={() => window.open('/', '_self')}>Retour à l'accueil</Button>
                </Box>
            </Box>
        )
    }

    function getPaymentState(){
        if (paymentSuccessful) {
            return <>
                <Typography variant='h5'>Votre paiement est validé</Typography>
                <Typography variant='h5'>Votre commande a bien été prise en compte</Typography>
                <Typography variant='h6'>Détails de la commande</Typography>
                <OrderSummary order={order}></OrderSummary>
            </>
        } else {
            return <>
                <Typography variant='h5'>Votre paiement n'a pas été validé</Typography>
                <Typography variant='h5'>Votre commande a été annulée</Typography>
            </>
        }
    }
}
