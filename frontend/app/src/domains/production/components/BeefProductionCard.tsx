import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder'
import dayjs from 'dayjs'

export default function BeefProductionCard({
    production: production, 
    showActions: showActions, 
    setPackageModificationLayoutContent: setPackageModificationLayoutContent}) {

    const [beefProduction, setBeefProduction] = useState(production)
    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    useEffect(() => {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak);
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getBeefProduction(production.id, (error, data, response) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('api.getBeefProduction called successfully. Returned data: ' + data);
                    setBeefProduction(data)
                }
            })
        }, keycloak)
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
                    Poids vif estimé : {beefProduction.animalLiveWeight} kg
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
