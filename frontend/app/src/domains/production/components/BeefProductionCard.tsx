import React from 'react';
import { Button, Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material"
import { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import dayjs from 'dayjs'

export default function BeefProductionCard({
    production: production, 
    showActions: showActions, 
    viewBeefProductionCallback: viewBeefProductionCallback}) {

    const [beefProduction, setBeefProduction] = useState(production)
    const { keycloak, initialized } = useKeycloak()
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
        apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            apiBuilder.invokeAuthenticatedApi(() => {
                api.getBeefProduction(production.id, (error, data, response) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('api.getBeefProduction called successfully. Returned data: ' + data);
                        setBeefProduction(data)
                    }
                })
            }, keycloak)
        })
    }, [keycloak])

    return (
        <Card>
            <CardActionArea onClick={() => viewBeefProductionCallback(beefProduction)}>
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
