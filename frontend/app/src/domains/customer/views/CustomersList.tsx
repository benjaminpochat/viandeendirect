import React from 'react';
import { useEffect, useState } from 'react'
import { Typography } from "@mui/material"
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';

import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder'

export default function CustomersList() {

    const [customers, setCustomers] = useState([])
    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    useEffect(() => {
        loadCustomers()
    }, [keycloak])

    function loadCustomers() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak)
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getCustomers((error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getSales called successfully. Returned data: ' + data)
                    setCustomers(data)
                }
            })
        }, keycloak)
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