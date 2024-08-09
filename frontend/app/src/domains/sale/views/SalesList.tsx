import React from 'react'
import { Typography, Button } from "@mui/material"


import {Producer} from "@viandeendirect/api/dist/models/Producer.js";
import SaleCard from '../components/SaleCard.tsx'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { ProducerService } from '../../commons/service/ProducerService.ts'
import { ApiBuilder } from '../../../api/ApiBuilder.ts';
import { Sale } from '@viandeendirect/api/dist/models/Sale';

export default function SalesList() {

    const navigate = useNavigate()
    const data = useLoaderData()
    const sales: Array<Sale> = data.sales

    return <>
        <Typography variant='h6'>Ventes</Typography>
        <div className='card-list'>
            {sales.map(sale => <SaleCard sale={sale}/>)}
        </div>
        <Button variant="contained" size="small" onClick={() => navigate('/sales/creation')}>Créer une vente</Button>
    </>
}

export async function loadSalesListData(keycloakClient): Promise<{sales: Array<Sale>, producer: Producer}> {
    const producerService = new ProducerService(keycloakClient)
    const producer: Producer = await producerService.asyncLoadProducer()
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloakClient)
    const sales: Array<Sale> = await api.getProducerSales({producerId: producer.id})
    return {sales: sales, producer: producer}
}