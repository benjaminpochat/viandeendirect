import React from 'react'
import { useEffect, useState } from 'react'

import { Typography } from "@mui/material"

import { BeefProduction } from '@viandeendirect/api/dist/models/BeefProduction.js'
import { PackageLot } from '@viandeendirect/api/dist/models/PackageLot.js'
import { AnimalTypeUtils } from '../../../enum/AnimalType.ts'
import PieChart from '../../commons/components/PieChart.tsx'
import PackageLotDescription from './PackageLotDescription.tsx'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'

export default function BeefProductionCustomerCard({production: production}) {

    const [beefProduction, setBeefProduction] = useState<BeefProduction>({})
    const [percentageSold, setPercentageSold] = useState(0)
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
        const loadData = async () => {
            const api = await apiBuilder.getAnonymousApi()
            const loadedBeefProduction = await api.getBeefProduction({beefProductionId: production.id})
            setBeefProduction(loadedBeefProduction)
            const loadedPercentageSold = await api.getProductionPercentageSold({productionId: production.id})
            setPercentageSold(+loadedPercentageSold)
        }
        loadData()
    }, [])


    return <>
        <div className="sale-customer-card__product-information">
            <Typography variant="h5">Viande de boeuf</Typography>
            <PieChart percentage={percentageSold} description={<><div>{percentageSold}%</div><div>déjà vendu</div></>}></PieChart>
        </div>        
        <div className="sale-customer-card__general-information">
            <div className="sale-customer-card__animal-information">
                <div className="sale-customer-card__animal">
                    <i className="icon cow-icon"></i>
                    <span>
                        {AnimalTypeUtils.getAnimalTypeLabel(beefProduction.animalType)}
                    </span>
                </div>
                <div className="sale-customer-card__animal-id">
                    <i className="icon label-icon"></i>
                    <span>
                        {beefProduction.animalIdentifier}
                    </span>
                </div>
                <div className="sale-customer-card__farm">
                    <i className="icon farm-icon"></i>
                    <span>
                        {beefProduction.birthFarm}
                    </span>
                </div>
            </div>
        </div>
        <div className="sale-customer-card__product-batch-list">
            {beefProduction.lots?.map(getLot)}
        </div>
    </>

    function getLot(lot: PackageLot) {
        return <PackageLotDescription lot={lot}></PackageLotDescription>
    }
}

