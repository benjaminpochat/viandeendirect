import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'
import { Typography } from "@mui/material"
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { AnimalTypeUtils } from '../../../enum/AnimalType.ts';
import PieChart from '../../commons/components/PieChart.tsx'
import styles from './SaleCard.css'

export default function SaleCardBeefProduction({production: production}) {

    const [productionPercentageSold, setProductionPercentageSold] = useState([])
    const { keycloak, initialized } = useKeycloak()
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
        loadProductionPercentageSold()
    }, [keycloak])


    function loadProductionPercentageSold() {
        apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            apiBuilder.invokeAuthenticatedApi(() => {
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
                <PieChart percentage={productionPercentageSold}></PieChart>
            </div>
        </div>
    </>
}