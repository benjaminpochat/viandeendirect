import React from 'react'
import { useState } from 'react'

import { Button, ButtonGroup, Switch, Typography } from "@mui/material"
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs'

import { ApiBuilder } from '../../../api/ApiBuilder.ts'

import { Order } from "@viandeendirect/api/dist/models/Order"
import { OrderStatusUtils } from '../../../enum/OrderStatusUtils.ts';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Sale } from '@viandeendirect/api/dist/models/Sale';
import { OrderStatus } from '@viandeendirect/api/dist/models/OrderStatus';

export default function OrdersList() {

    const navigate = useNavigate()
    const data = useLoaderData()
    const sale = data.sale
    const orders = data.orders

    const [abortedOrdersHidden, setAbortedOrdersHidden] = useState<Boolean>(true);

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
            orderStatus: new OrderStatusUtils().getLabel(order.status)
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

export async function loadOrdersListData(saleId: number, keycloakClient): Promise<{orders: Array<Order>, sale: Sale}> {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloakClient)
    const orders: Array<Order> = await api.getSaleOrders({saleId: saleId})
    const sale = await api.getSale({saleId: saleId})
    return {orders: orders, sale: sale}
}
