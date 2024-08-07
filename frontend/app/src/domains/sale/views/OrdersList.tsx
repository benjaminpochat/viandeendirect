import React from 'react'
import { useEffect, useState } from 'react'

import { Button, ButtonGroup, Switch, Typography } from "@mui/material"
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs'

import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'

import Order from "viandeendirect_eu/dist/model/Order.js"
import Sale from "viandeendirect_eu/dist/model/Sale.js"
import { OrderStatus, OrderStatusUtils } from '../../../enum/OrderStatus.ts';
import { useNavigate } from 'react-router-dom';

export default function OrdersList(props) {

    const { keycloak, initialized } = useKeycloak()
    const navigate = useNavigate()
    const apiBuilder = new ApiBuilder()

    const [sale, setSale] = useState<Sale>({id: props.saleId})
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        //TODO : load sale from props.saleId
        loadOrders()
    }, [keycloak])

    const [abortedOrdersHidden, setAbortedOrdersHidden] = useState<Boolean>(true);

    function loadOrders() {
        apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            apiBuilder.invokeAuthenticatedApi(() => {
                api.getSaleOrders(sale.id, (error, data, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('api.getSaleOrders called successfully. Returned data: ' + data)
                        setOrders(data)
                    }
                })
            }, keycloak)
        })
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Référence', flex: 0.5, disableColumnMenu: true },
        { field: 'customerName', headerName: 'Nom du client', flex: 1, disableColumnMenu: true },
        { field: 'orderStatus', headerName: 'Statut', flex: 1, disableColumnMenu: true },
        {
            field: 'actions',
            headerName: '',
            renderCell: (param) => <Button variant="contained" size="small" onClick={() => navigate(`/sale/${sale.id}/order/${param.row.id}`)}>Détails</Button>,
            disableColumnMenu: true,
            disableReorder: true
          }
    ]

    const rows: GridRowsProp = orders.filter(order => isOrderDisplayed(order)).map((order: Order) => {
        return {
            id: order.id,
            customerName: order.customer.user.lastName + ' ' + order.customer.user.firstName,
            orderStatus: OrderStatusUtils.getOrderStatusLabel(order.status)
        }
    })

    function isOrderDisplayed(order: Order): boolean {
        if (abortedOrdersHidden) {
            return order.status !== OrderStatus.PaymentAborted;
        }
        return true
    }

    return <>
        <Typography variant='h6'>Commandes pour la vente du {dayjs(sale?.deliveryStart).format('DD/MM/YYYY')} - {sale?.deliveryAddressName}</Typography>
        <DataGrid
            rows={rows}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            slotProps={{
                toolbar: {
                    showQuickFilter: true,
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { disableToolbarButton: true },
                },
            }} />
        <div>
            <Switch checked={abortedOrdersHidden.valueOf()} onChange={() => setAbortedOrdersHidden(!abortedOrdersHidden)}/>
            Masquer les commandes échouées
        </div>
        <ButtonGroup>
            <Button variant="contained" size="small" onClick={() => navigate(`/sale/${sale?.id}/order/creation`)}>Saisir une commande</Button>
            <Button size="small" onClick={() => navigate(-1)}>Retour aux ventes</Button>
        </ButtonGroup>
    </>
}
