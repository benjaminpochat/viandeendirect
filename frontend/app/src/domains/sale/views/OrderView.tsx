import React from 'react'
import { useEffect, useState } from 'react'

import { Button, Typography } from '@mui/material'

import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder.js'

import Order from 'viandeendirect_eu/dist/model/Order'
import OrderItem from 'viandeendirect_eu/dist/model/OrderItem'

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
        <div>
            <div>
                <Typography color="text.secondary">Référence de la commande</Typography>
                <Typography>{order.id}</Typography>
            </div>
            <div>
                <Typography color="text.secondary">Nom du client</Typography>
                <Typography>{order.customer?.user.lastName + ' ' + order.customer?.user.firstName}</Typography>
            </div>
            <div>
                <Typography color="text.secondary">Liste des articles</Typography>
                <ul>
                    {order.items?.map(item => <li>{itemDescription(item)}</li>)}
                </ul>
            </div>

        </div>
        <Button onClick={() => returnCallback(sale)}>Retour aux commandes</Button>
    </>

    function itemDescription(item: OrderItem){
        return `${item.quantity}x ${item.packageLot.label}`
    }
}