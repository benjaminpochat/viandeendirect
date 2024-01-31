import React from 'react'
import { useEffect, useState } from 'react'

import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material'

import Sale from 'viandeendirect_eu/dist/model/Sale.js'

import { ApiInvoker } from '../../api/ApiInvoker.ts'
import SaleCustomerCard from '../../domains/sale/components/SaleCustomerCard.tsx'


export default function Welcome({createOrderCallback: createOrderCallback}) {

    const [sales, setSales] = useState([])
    const apiInvoker = new ApiInvoker()

    useEffect(() => {
        apiInvoker.callApiAnonymously(api => api.getSales, null, setSales)
    }, [])


    return <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography>Bienvenu dans l'espace client de ViandeEnDirect.eu</Typography>
        {sales.map(getSaleCard)}
    </Box>

    function getSaleCard(sale: Sale) {
        return <SaleCustomerCard sale={sale} createOrderCallback={() => createOrderCallback(sale)}></SaleCustomerCard>
    }

}