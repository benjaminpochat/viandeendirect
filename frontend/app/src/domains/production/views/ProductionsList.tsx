import React from 'react'
import { useEffect, useState } from 'react'

import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'

import { Button, Typography } from "@mui/material"

import ProductionCard from '../components/ProductionCard.tsx'
import { useNavigate } from 'react-router-dom'

export default function ProductionsList({
    createBeefProductionCallback: createBeefProductionCallback,
    viewBeefProductionCallback: viewBeefProductionCallback}) {

    const [productions, setProductions] = useState([])
    const { keycloak, initialized } = useKeycloak()
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
        loadProductions()
    }, [keycloak])

    function loadProductions() {
        apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            apiBuilder.invokeAuthenticatedApi(() => {
                api.getProductions({}, (error, data, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('api.getProductions called successfully. Returned data: ' + data)
                        setProductions(data)
                    }
                })
            }, keycloak)
        })
    }

    return <>
        <Typography variant='h6'>Productions</Typography>
        <div className='card-list'>
            {getProductionCards()}
        </div>
        <Button variant="contained" size="small" onClick={createBeefProductionCallback}>Ajouter un abattage bovin</Button>
    </>


    function getProductionCards() {
        return productions.map(production => <div className='card-clickable'>
                                                <ProductionCard 
                                                    production={production} 
                                                    showActions={true} 
                                                    clickCallback={viewBeefProductionCallback}> 
                                                </ProductionCard>
                                            </div>)
    }
}