import React, { useEffect, useState } from 'react'

import { Button, ButtonGroup, Card, CardActions, CardContent, Typography } from "@mui/material"
import dayjs from 'dayjs'
import SaleCardBeefProduction from './SaleCardBeefProduction.tsx';
import { ApiInvoker } from '../../../api/ApiInvoker.ts';
import { useKeycloak } from '@react-keycloak/web';
import Order from '@viandeendirect/api/dist/models/Order'
import Production from '@viandeendirect/api/dist/models/Production'
import { useNavigate } from 'react-router-dom';


export default function SaleCard({ sale: sale, manageOrdersCallback: manageOrdersCallback}) {

    const apiInvoker = new ApiInvoker()
    const [orders, setOrders] = useState<Array<Order>>([])
    const [productions, setProductions] = useState<Array<Production>>([])
    const {keycloak} = useKeycloak()
    const navigate = useNavigate()

    useEffect(() => {
        apiInvoker.callApiAuthenticatedly(keycloak, api => api.getSaleOrders, sale.id, setOrders, console.error)
    }, [keycloak])

    useEffect(() => {
        apiInvoker.callApiAuthenticatedly(keycloak, api => api.getSaleProductions, sale.id, setProductions, console.error)
    }, [keycloak])

    return (
        <Card>
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Vente du {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}
                </Typography>
                <div className='sale-card-line-1'>
                    <div>
                        <Typography color="text.secondary">
                            Livraison
                        </Typography>
                        <Typography>
                            <div>{sale.deliveryAddressLine1}</div>
                            <div>{sale.deliveryAddressLine2}</div>
                            <div>{sale.deliveryZipCode} - {sale.deliveryCity}</div>
                            <div>entre {dayjs(sale.deliveryStart).format('HH:mm')} et {dayjs(sale.deliveryStop).format('HH:mm')}</div>
                        </Typography>
                    </div>
                    <div>
                        <Typography color="text.secondary">
                            Commandes
                        </Typography>
                        <Typography>
                            {orders.length} commandes client
                        </Typography>
                        <Typography>
                            {getQuantitySold()} kg commandés
                        </Typography>
                        <Typography>
                            {getAmountSold()} €<sup>TTC</sup> commandés
                        </Typography>
                    </div>
                </div>
                <div className='sale-card-line-2'>
                    <div>
                        <Typography color="text.secondary">
                            Productions mises en vente
                        </Typography>
                        {productions.map(getProduction)}
                    </div>
                </div>
            </CardContent>
            <CardActions>
                <ButtonGroup>
                    <Button size="small">Publier la vente</Button>
                    <Button size="small" onClick={() => navigate(`/sale/${sale.id}/orders`)}>Gérer les commandes</Button>
                    <Button size="small">Préparer la livraison</Button>
                </ButtonGroup>
            </CardActions>
        </Card>
    )

    function getProduction(production) {
        switch (production.productionType) {
            case 'BeefProduction':
                return <SaleCardBeefProduction production={production}/>
            default:
                return <></>

        }
    }

    function getQuantitySold() {
        return orders
            .flatMap(order => order.items)
            .map(item => item.packageLot.netWeight * item.quantity)
            .reduce((totalQuantity, orderItemQuantity) => totalQuantity + orderItemQuantity, 0)
    }

    function getAmountSold() {
        return orders
            .flatMap(order => order.items)
            .map(item => item.unitPrice * item.quantity)
            .reduce((totalAmout, orderItemAmout) => totalAmout + orderItemAmout, 0)
    }
}
