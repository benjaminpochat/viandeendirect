import React from 'react'

import { Typography } from '@mui/material'

import OrderItem from 'viandeendirect_eu/dist/model/OrderItem'
import Order from 'viandeendirect_eu/dist/model/Order'

export default function OrderSummary({ order: order }) {
    return <div>
        {orderId()}
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
        <div>
            <Typography color="text.secondary">Montant de la commande</Typography>
            <ul>{orderTotalPrice(order)} €<sup>TTC</sup></ul>
        </div>
    </div>

    function orderId() {
        if (order.id) {
            return <div>
                <Typography color="text.secondary">Référence de la commande</Typography>
                <Typography>{order.id}</Typography>
            </div>

        }
    }

    function itemDescription(item: OrderItem): String {
        return `${item.quantity}x ${item.packageLot.label}`
    }

    function orderTotalPrice(order: Order): String {
        return order.items?.map(item => item.quantity * item.packageLot.netWeight * item.unitPrice)
            .reduce((totalPrice, itemPrice) => totalPrice + itemPrice)
    }
}