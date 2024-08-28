import React from 'react'
import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'
import { Typography } from "@mui/material"
import { AnimalTypeUtils } from '../../../enum/AnimalTypeUtils.ts';
import PieChart from '../../commons/components/PieChart.tsx'
import './SaleCard.css'
import { ApiBuilder } from '../../../api/ApiBuilder.ts';
import { BeefProduction } from '@viandeendirect/api/dist/models/BeefProduction';

export default function SaleCardBeefProduction({production: production}) {

    const [beefProduction, setBeefProduction] = useState<BeefProduction>()
    const [productionPercentageSold, setProductionPercentageSold] = useState([])
    const { keycloak } = useKeycloak()
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
        const loadData = async () => {
            const api = await apiBuilder.getAuthenticatedApi(keycloak)
            const loadedBeefProduction = await api.getBeefProduction({beefProductionId: production.id})
            setBeefProduction(loadedBeefProduction)
            const loadedPercentageSold = await api.getProductionPercentageSold({productionId: production.id})
            setProductionPercentageSold(+loadedPercentageSold)
        }
        loadData()
    }, [keycloak])

    return <>
        <div className='sale-card-production'>
            <div>
                <Typography component="div">
                    Colis de viande de boeuf
                </Typography>
                <Typography>
                    <div>
                        {new AnimalTypeUtils().getLabel(beefProduction?.animalType)} n° {beefProduction?.animalIdentifier}
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