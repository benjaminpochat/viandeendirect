import React from 'react';
import { Typography } from "@mui/material"
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';

import { ApiBuilder } from '../../../api/ApiBuilder.ts';
import { Producer } from '@viandeendirect/api/dist/models/Producer';
import { ProducerService } from '../../commons/service/ProducerService.ts';
import { useLoaderData } from 'react-router-dom';
import { Customer } from '@viandeendirect/api/dist/models/Customer';

export default function CustomersList() {

    const customers: Array<Customer> = useLoaderData()

    const rows: GridRowsProp = customers.map(customer => {
        return {
            id: customer.id,
            name: customer.user.lastName + ' ' + customer.user.firstName,
            phone: customer.user.phone,
            email: customer.user.email
        }
    })

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nom', flex: 1, disableColumnMenu: true },
        { field: 'phone', headerName: 'Téléphone', flex: 1, disableColumnMenu: true },
        { field: 'email', headerName: 'Email', flex: 1, disableColumnMenu: true },
    ]

    return (<>
        <Typography variant='h6'>Clients</Typography>
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
    </>
    )

}

export async function loadCustomersListData(keycloak): Promise<Array<Customer>> {
    const producerService = new ProducerService(keycloak)
    const producer: Producer = await producerService.loadProducer()
    const apiBuilder = new ApiBuilder();
    const api = await apiBuilder.getAuthenticatedApi(keycloak);
    const customers = await api.getProducerCustomers({producerId: +producer.id})
    return customers
}