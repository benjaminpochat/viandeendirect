import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'
import { Typography } from "@mui/material"
import { ApiInvoker } from '../../../api/ApiInvoker.ts'
import { AnimalTypeUtils } from '../../../enum/AnimalType.ts';
import PieChart from '../../commons/components/PieChart.tsx'
import styles from './SaleCard.css'

export default function SaleCardBeefProduction({production: production}) {

    const [productionPercentageSold, setProductionPercentageSold] = useState([])
    const { keycloak } = useKeycloak()
    const apiInvoker = new ApiInvoker()

    useEffect(() => {
        apiInvoker.callApiAuthenticatedly(
            keycloak, 
            api => api.getProductionPercentageSold,
            production.id,
            setProductionPercentageSold,
            console.error)
    }, [keycloak, production])

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