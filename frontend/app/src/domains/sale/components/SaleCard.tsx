import React, { useEffect, useState } from 'react'

import { Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Chip, Typography, Stack } from "@mui/material"
import LockIcon from '@mui/icons-material/Lock';
import dayjs from 'dayjs'
import SaleCardBeefProduction from './SaleCardBeefProduction.tsx';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { ApiBuilder } from '../../../api/ApiBuilder.ts';
import { Order } from '@viandeendirect/api/dist/models/Order'
import { Production } from '@viandeendirect/api/dist/models/Production'


export default function SaleCard({sale: sale}) {

    const [orders, setOrders] = useState<Array<Order>>([])
    const [productions, setProductions] = useState<Array<Production>>([])
    const {keycloak} = useKeycloak()
    const navigate = useNavigate()
    const apiBuilder = new ApiBuilder()


    useEffect(() => {
        const loadData = async () => {
            const api = await apiBuilder.getAuthenticatedApi(keycloak)
            const loadedOrders = await api.getSaleOrders({saleId: sale.id})
            setOrders(loadedOrders)
            const loadedProductions = await api.getSaleProductions({saleId: sale.id})
            setProductions(loadedProductions)
        }
        loadData()
    }, [keycloak])

    return (
        <Card>
            <CardHeader 
                title={<Stack alignItems="center" direction="row" gap={2} justifyContent='space-between'>
                    <div>{`Vente du ${dayjs(sale.deliveryStart).format('DD/MM/YYYY')}`}</div>
                    {getPrivateAccessKeyChip()}
                    </Stack>
                } 
                subheader={sale.deliveryAddressName}>
            </CardHeader>
            <CardContent>
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
                return <SaleCardBeefProduction key={`beef-production-card-${production.id}`} production={production}/>
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

    function getPrivateAccessKeyChip() {
        if (sale.privateAccessKey) {
            return <Chip icon={<LockIcon/>} size='small' color='warning' label={`code accès privé : ${sale.privateAccessKey}`}/>
        }
        return <></>
    }
}
