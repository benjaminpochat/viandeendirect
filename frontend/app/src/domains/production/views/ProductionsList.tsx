import React from 'react'
import { useEffect, useState } from 'react'

import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder'

import { Button, Typography } from "@mui/material"

import ProductionCard from '../components/ProductionCard.tsx'

export default function ProductionsList({createBeefProductionCallback: createBeefProductionCallback}) {

    const [productions, setProductions] = useState([])
    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    useEffect(() => {
        loadProductions()
    }, [keycloak])

    function loadProductions() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak)
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getProductions({}, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getProductions called successfully. Returned data: ' + data)
                    setProductions(data)
                }
            })
        }, keycloak)
    }

    return <>
        <Typography variant='h6'>Productions</Typography>
        <div className='card-list'>
            {getProductionCards()}
        </div>
        <Button variant="contained" size="small" onClick={createBeefProductionCallback}>Ajouter un abattage bovin</Button>
    </>


    function getProductionCards() {
        return productions.map(production => <ProductionCard 
                                                production={production} 
                                                showActions={true} 
                                                setPackageModificationLayoutContent={createBeefProductionCallback}>    
                                            </ProductionCard>)
    }
}