import React from 'react'

import { ApiBuilder } from '../../../api/ApiBuilder.ts'

import { Button, Typography } from "@mui/material"

import ProductionCard from '../components/ProductionCard.tsx'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Production } from '@viandeendirect/api/dist/models/Production'

export default function ProductionsList() {

    const productions: Array<Production> = useLoaderData()

    const navigate = useNavigate()


    return <>
        <Typography variant='h6'>Productions</Typography>
        <div className='card-list'>
            {getProductionCards()}
        </div>
        <Button variant="contained" size="small" onClick={() => navigate('/beefProduction/creation')}>Ajouter une production de colis de viande de boeuf</Button>
    </>


    function getProductionCards() {
        return productions.map(production => <ProductionCard 
                                                    key={`production-card-${production.id}`}
                                                    production={production}
                                                    showActions={true} 
                                                    onClick={undefined} > 
                                              </ProductionCard>)
    }
}

export async function loadProductionListData(keycloakClient): Promise<Array<Production>> {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloakClient)
    const productions: Array<Production> = await api.getProductions({})
    return productions
}