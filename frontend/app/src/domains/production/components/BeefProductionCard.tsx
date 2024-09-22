import React from 'react';
import { Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material"
import { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { BeefProduction } from '@viandeendirect/api/dist/models/BeefProduction';
import { AnimalTypeUtils } from '../../../enum/AnimalTypeUtils.ts';

export default function BeefProductionCard({
    production: production, 
    showActions: showActions,
    onClick: onClick = undefined}) {

    const navigate = useNavigate()
    const [beefProduction, setBeefProduction] = useState<BeefProduction>(production)
    const { keycloak } = useKeycloak()
    const apiBuilder = new ApiBuilder()
    
    useEffect(() => {
        const loadBeefProduction = async () => {
            const api = await apiBuilder.getAuthenticatedApi(keycloak)
            const loadBeefProduction = await api.getBeefProduction({beefProductionId: production.id})
            setBeefProduction(loadBeefProduction)            
        }
        loadBeefProduction()
    }, [keycloak])

    return (
        <>
            <Card>
                <CardHeader title='Colis de viande de boeuf'
                    subheader={`${new AnimalTypeUtils().getLabel(beefProduction.animalType)} n°${beefProduction.animalIdentifier}` }/>
                <CardContent>
                    <Typography variant="subtitle1" component="div">
                        Abattage le {dayjs(beefProduction.slaughterDate).format('DD/MM/YYYY')}
                    </Typography>
                    <Typography component="div">
                        Poids de carcasse chaude estimé : {beefProduction.warmCarcassWeight} kg
                    </Typography>
                </CardContent>
                {getActions()}
            </Card>
        </>
        
    )

    function getActions() {
        if (showActions) {
            return <CardActions>
                <ButtonGroup>
                    <Button variant='outlined' size="small" onClick={() => navigate(`/beefProduction/${production.id}`)}>Voir le détail</Button>
                    <Button variant='outlined' size="small" onClick={() => navigate(`/beefProduction/${production.id}/publicationToSale`)}>Mettre en vente</Button>
                </ButtonGroup>
            </CardActions>
        }
    }
}
