import { Button, Typography } from "@mui/material"
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';
import dayjs from 'dayjs'

import Order from "viandeendirect_eu/dist/model/Order"

export default function OrdersList({sale: sale, returnCallback: returnCallback}) {

    //TODO : charger les commandes et leur grappe

    const rows: GridRowsProp = sale.orders.map((order: Order) => {
        return {
            id: order.id,
            //customerName: order.customer.user.lastName + ' ' + order.customer.user.name
            customerName: 'Bob'
            //items: order.items.map
        }
    })
      
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Numéro de commande', flex: 1, disableColumnMenu: true },
        { field: 'customerName', headerName: 'Nom du client', flex: 1, disableColumnMenu: true }
    ]

    return <>
        <Typography>Vente du {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}</Typography>
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
                },
            }} />
        <Button size="small" onClick={() => returnCallback()}>Retour aux ventes</Button>
    </>
}
