import React from 'react'
import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'
import { Typography } from "@mui/material"
import { ApiInvoker } from '../../../api/ApiInvoker.ts'
import { AnimalTypeUtils } from '../../../enum/AnimalType.ts';
import PieChart from '../../commons/components/PieChart.tsx'
import Production from 'viandeendirect_eu/dist/model/BeefProduction'
import './SaleCard.css'

export default function SaleCardBeefProduction({production: production}) {

    const [beefProduction, setBeefProduction] = useState<BeefProduction>()
    const [productionPercentageSold, setProductionPercentageSold] = useState([])
    const { keycloak } = useKeycloak()
    const apiInvoker = new ApiInvoker()

    useEffect(() => {
        apiInvoker.callApiAuthenticatedly(
            keycloak, 
            api => api.getBeefProduction,
            production.id,
            setBeefProduction,
            console.error)
    }, [keycloak])

    useEffect(() => {
        apiInvoker.callApiAuthenticatedly(
            keycloak, 
            api => api.getProductionPercentageSold,
            production.id,
            setProductionPercentageSold,
            console.error)
    }, [keycloak])

    return <>
        <div className='sale-card-production'>
            <div>
                <Typography component="div">
                    Abattage bovin
                </Typography>
                <Typography>
                    <div>
                        {AnimalTypeUtils.getAnimalTypeLabel(beefProduction?.animalType)} n° {beefProduction?.animalIdentifier}
                    </div>
                </Typography>
                <Typography>
                    <div>
                        Carcasse chaude estimée : {beefProduction?.warmCarcassWeight} kg
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