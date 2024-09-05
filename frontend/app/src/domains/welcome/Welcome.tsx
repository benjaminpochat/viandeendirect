import React from 'react'

import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material'

import { useLoaderData } from 'react-router-dom';

import { Sale } from '@viandeendirect/api/dist/models/Sale.js'

import SaleCustomerCard from '../../domains/sale/components/SaleCustomerCard.tsx'
import { ApiBuilder } from '../../api/ApiBuilder.ts'


export default function Welcome() {

    const sales: Array<Sale> = useLoaderData()

    return <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography>Bienvenu dans l'espace client de ViandeEnDirect.eu</Typography>
        {sales.map(getSaleCard)}
    </Box>

    function getSaleCard(sale: Sale) {
        return <SaleCustomerCard key={`sale-card-${sale.id}`} sale={sale}></SaleCustomerCard>
    }

}

export async function loadWelcomeData(): Promise<Array<Sale>> {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAnonymousApi()
    const sales = await api.getSales()
    return sales
}
