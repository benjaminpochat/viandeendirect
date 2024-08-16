import React from 'react';
import { Button, Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material"
import { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';

export default function BeefProductionCard({
    production: production, 
    showActions: showActions,
    onClick: onClick = undefined}) {

    const navigate = useNavigate()
    const [beefProduction, setBeefProduction] = useState(production)
    const { keycloak, initialized } = useKeycloak()
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
        <Card>
            <CardActionArea onClick={onClick || (() => navigate(`/beefProduction/${production.id}`))}>
                <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                        Abattage bovin
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                        Abattage le {dayjs(beefProduction.slaughterDate).format('DD/MM/YYYY')}
                    </Typography>
                    <Typography component="div">
                        Poids de carcasse chaude : {beefProduction.warmCarcassWeight} kg
                    </Typography>
                </CardContent>
            </CardActionArea>
            {getActions()}
        </Card>
    )

    function getActions() {
        if (showActions) {
            return <CardActions>
                <Button size="small">Mettre en vente</Button>
            </CardActions>
        }
    }
}
