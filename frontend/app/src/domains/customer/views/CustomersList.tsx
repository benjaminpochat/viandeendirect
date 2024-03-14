import React from 'react';
import { useEffect, useState } from 'react'
import { Typography } from "@mui/material"
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';

import { useKeycloak } from '@react-keycloak/web'
import { ApiInvoker } from '../../../api/ApiInvoker.ts';

export default function CustomersList({producer: producer}) {

    const [customers, setCustomers] = useState([])
    const { keycloak, initialized } = useKeycloak()
    const apiInvoker = new ApiInvoker()
    
    useEffect(() => {
        loadCustomers()
    }, [keycloak])

    function loadCustomers() {
        apiInvoker.callApiAuthenticatedly(keycloak, api => api.getProducerCustomers, producer.id, setCustomers, console.error)
    }

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