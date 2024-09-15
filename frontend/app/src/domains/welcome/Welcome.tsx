import React from 'react'

import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material'

import { useLoaderData } from 'react-router-dom';

import { Sale } from '@viandeendirect/api/dist/models/Sale.js'

import SaleCustomerCard from '../../domains/sale/components/SaleCustomerCard.tsx'
import { ApiBuilder } from '../../api/ApiBuilder.ts'
import { Producer } from '@viandeendirect/api/dist/models/Producer';


export default function Welcome() {

    const loadedData = useLoaderData();
    //const sales: Array<Sale> = loadedData.sales
    const sales: Array<Sale> = []
    const randomProducer: Producer = loadedData.randomProducer

    return <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {getWelcomeMessage()}
        <br/>
        {sales.map(getSaleCard)}
        {getRandomProducerSlideshow()}
    </Box>

    function getWelcomeMessage() {
        if (sales.length > 0) {
            return <Typography>Nos prochaines ventes :</Typography>
        }
        return <>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant='h5'>Aucune vente n'est planifiée pour l'instant...</Typography>
                <Typography variant='h6'>Pour patienter, on vous fait visiter la ferme de l'un de nos producteurs partenaires.</Typography>
            </Box>
        </>
    }

    function getRandomProducerSlideshow() {
        if (sales.length === 0) {
        return <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: '-webkit-fill-available', maxWidth: '60rem', aspectRatio: '165/100'}}>
                    <iframe title="randomProducerSlideshow"
                        src={randomProducer.slideShowUrl}
                        allowfullscreen="true"
                        mozallowfullscreen="true"
                        webkitallowfullscreen="true"
                        width="100%"
                        height="100%" />
                    </div>
            </div>
        }
        return <></>
    }

    function getSaleCard(sale: Sale) {
        return <SaleCustomerCard key={`sale-card-${sale.id}`} sale={sale}></SaleCustomerCard>
    }

}

export async function loadWelcomeData(): Promise<Array<Sale>> {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAnonymousApi()
    const sales = await api.getSales()
    const randomProducer = await api.getRandomProducerPublicData()
    return {sales: sales, randomProducer: randomProducer}
}
