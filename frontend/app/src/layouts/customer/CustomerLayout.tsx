import React from 'react'
import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { ApiBuilder } from '../../api/ApiBuilder.ts'
import Sale from 'viandeendirect_eu/dist/model/Sale.js'
import SaleCustomerCard from '../../domains/sale/components/SaleCustomerCard.tsx'
import { ApiInvoker } from '../../api/ApiInvoker.ts'

export default function CustomerLayout() {

    const [sales, setSales] = useState([])
    const apiInvoker = new ApiInvoker()

    useEffect(() => {
        apiInvoker.callApiAnonymously(api => api.getSales, null, setSales)
    }, [])

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
                {sales.map(getSaleCard)}
            </Box>
        </Box>
    )

    function getSaleCard(sale: Sale) {
        return <SaleCustomerCard sale={sale}></SaleCustomerCard>
    }



}
