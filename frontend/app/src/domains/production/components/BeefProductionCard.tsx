import React from 'react';
import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import dayjs from 'dayjs'

export default function BeefProductionCard({
    production: production, 
    showActions: showActions, 
    setPackageModificationLayoutContent: setPackageModificationLayoutContent}) {

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
            {getActions()}
        </Card>
    )

    function getActions() {
        if (showActions) {
            return <CardActions>
                <Button size="small">Mettre en vente</Button>
                <Button size="small">Ajuster le poids vif</Button>
                <Button size="small" onClick={() => setPackageModificationLayoutContent(production)}>Modifier les produits</Button>
            </CardActions>
        }
    }
}
