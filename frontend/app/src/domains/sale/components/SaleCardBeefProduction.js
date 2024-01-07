import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'
import { Typography } from "@mui/material"
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder.js'
import { AnimalTypeUtils } from '../../../enum/AnimalType.ts';
import styles from './SaleCard.css'

export default function SaleCardBeefProduction({production: production}) {

    const [productionPercentageSold, setProductionPercentageSold] = useState([])
    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    useEffect(() => {
        loadProductionPercentageSold()
    }, [keycloak])


    function loadProductionPercentageSold() {
        authenticatedApiBuilder.getAuthenticatedApi(keycloak).then(api => {
            authenticatedApiBuilder.invokeAuthenticatedApi(() => {
                api.getProductionPercentageSold(production.id, (error, data, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('api.getProductionPercentageSold called successfully. Returned data: ' + data)
                        setProductionPercentageSold(data)
                    }
                })
            }, keycloak)        
        })
    }

    return <>
        <div className='sale-card-production'>
            <div>
                <Typography component="div">
                    Abattage bovin
                </Typography>
                <Typography>
                    <div>
                        {AnimalTypeUtils.getAnimalTypeLabel(production.animalType)} n° {production.animalIdentifier}
                    </div>
                </Typography>
                <Typography>
                    <div>
                        Poids vif estimé : {production.animalLiveWeight} kg
                    </div>
                </Typography>
            </div>
            <div>
                <div>{productionPercentageSold}% vendu</div>
                <div className="pie-chart" style={{ backgroundImage: getPieChartBackgroundImage()}}></div>
            </div>
        </div>
    </>

    function getPieChartBackgroundImage() {
        const angle = 360 * productionPercentageSold / 100
        return 'conic-gradient(#1976d2 ' + angle + 'deg , lightgrey ' + angle + 'deg 360deg)'
    }
}