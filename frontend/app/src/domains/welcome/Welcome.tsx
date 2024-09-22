import React, { useState } from 'react'

import { Box, Button, Stack, TextField, Toolbar, Typography } from '@mui/material'
import ForwardIcon from '@mui/icons-material/Forward';

import { useLoaderData } from 'react-router-dom';

import { Sale } from '@viandeendirect/api/dist/models/Sale.js'

import SaleCustomerCard from '../../domains/sale/components/SaleCustomerCard.tsx'
import { ApiBuilder } from '../../api/ApiBuilder.ts'
import { Producer } from '@viandeendirect/api/dist/models/Producer';
import { FormContainer } from 'react-hook-form-mui';


export default function Welcome() {

    const loadedData = useLoaderData();
    const sales: Array<Sale> = loadedData.sales
    const randomProducer: Producer = loadedData.randomProducer
    const [privateAccessKey, setPrivateAccessKey] = useState<string | undefined>(undefined)
    const [displayedSales, setDisplayedSales] = useState<Array<Sale>>(sales)

    return <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
            <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap'
                }}>
                {getWelcomeMessage()}
                    
                <TextField size='small' 
                    label="Clé d'accès vente privée" 
                    onChange={(event) => setPrivateAccessKey(event.target.value)}
                    onKeyDown={(event) => {if (event.key === 'Enter') {reloadDisplayedSales(privateAccessKey)}}}
                    InputProps={{endAdornment: (<ForwardIcon sx={{':hover': {cursor: "pointer"}}} onClick={() => reloadDisplayedSales(privateAccessKey)}/>)}}/>                        
                
            </Box>
        {displayedSales.map(getSaleCard)}
        {getRandomProducerSlideshow()}
    </Box>

    function getWelcomeMessage() {
        if (displayedSales.length > 0) {
            return <Typography sx={{marginBottom: '1rem'}} variant='h5'>Nos prochaines ventes :</Typography>
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
        if (displayedSales.length === 0) {
        return <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: '-webkit-fill-available', maxWidth: '50rem', aspectRatio: '165/100'}}>
                    <iframe title="randomProducerSlideshow"
                        src={randomProducer.slideShowUrl}
                        allowFullScreen={true}
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

    async function reloadDisplayedSales(privateAccessKey: string | undefined) {
        const apiBuilder = new ApiBuilder()
        const api = await apiBuilder.getAnonymousApi()
        const reloadedSales = await api.getSales({privateAccessKey: privateAccessKey})
        setDisplayedSales(reloadedSales)
    }
}

export async function loadWelcomeData(): Promise<Array<Sale>> {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAnonymousApi()
    const sales = await api.getSales()
    const randomProducer = await api.getRandomProducerPublicData({})
    return {sales: sales, randomProducer: randomProducer}
}
