import React from 'react'
import { useEffect, useState } from 'react'
import { Typography, Button } from "@mui/material"

import { useKeycloak } from '@react-keycloak/web'

import {Producer} from "@viandeendirect/api/dist/models/Producer.js";
import SaleCard from '../components/SaleCard.tsx'
import { ApiInvoker } from '../../../api/ApiInvoker.ts'
import { useNavigate } from 'react-router-dom'
import { ProducerService } from '../../commons/service/ProducerService.ts'
import { ApiBuilder } from '../../../api/ApiBuilder.ts';
import { Sale } from '@viandeendirect/api/dist/models/Sale';

//TODO : finir la conversion

export default function SalesList() {

    const { keycloak } = useKeycloak()
    const navigate = useNavigate()
    const producerService = new ProducerService(keycloak)

    const [sales, setSales] = useState([])
    const [producer, setProducer] = useState<Producer>({})
    const apiInvoker = new ApiInvoker()

    useEffect(() => {
        producerService.loadProducer(producer => {
                setProducer(producer)
                apiInvoker.callApiAuthenticatedly(keycloak, api => api.getProducerSales, producer.id, setSales, console.error)
            }
        )
    }, [keycloak, producer])

    return <>
        <Typography variant='h6'>Ventes</Typography>
        <div className='card-list'>
            {sales.map(sale => <SaleCard sale={sale}/>)}
        </div>
        <Button variant="contained" size="small" onClick={() => navigate('/sales/creation')}>Créer une vente</Button>
    </>
}

export async function loadSalesListData(keycloakClient): Promise<{sales: Array<Sale>, producer: Producer}> {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloakClient)
    const sales: Array<Sale> = await api.getSales()
    const producerService = new ProducerService(keycloakClient)
    const producer: Producer = await producerService.loadProducer()
    return {sales: sales, producer: producer}
}