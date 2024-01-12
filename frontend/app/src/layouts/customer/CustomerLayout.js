
import {AppBar, Box, CssBaseline, IconButton, Toolbar, Typography} from '@mui/material'
import { useEffect, useState } from 'react'
import { ApiBuilder } from '../../api/ApiBuilder.ts'

export default function CustomerLayout() {

    const apiBuilder = new ApiBuilder()
    const [sales, setSales] = useState([])

    useEffect(() => {
        loadSales()
    })

    function loadSales() {
        apiBuilder.getAnonymousApi().then(api => {
            apiBuilder.invokeAnonymousApi(() => {
                api.getSales((error, data, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('api.getSales called successfully. Returned data: ' + data)
                        setSales(data)
                    }
                })
            })
        })
    }

    /*
    function callApi(apiFunction, apiFunctionArgs, successCallback) {
        apiBuilder.getAnonymousApi().then(api => {
            apiBuilder.invokeAnonymousApi(() => {
                apiFunction(...apiFunctionArgs, (error, data, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        successCallback(data)
                    }
                })
            })
        })
    }
    */

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Viande en direct
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography>Bienvenu dans l'espace client de ViandeEnDirect.eu</Typography>
                {sales.map(sale => <div>Vente n° {sale.id}</div>)}
            </Box>
        </Box>
    )
    
}
