import React from 'react'
import { useEffect, useState } from 'react'

import { Button, Dialog, Link, Stack, Typography } from "@mui/material"

import { BeefProduction } from '@viandeendirect/api/dist/models/BeefProduction.js'
import { PackageLot } from '@viandeendirect/api/dist/models/PackageLot.js'
import { AnimalTypeUtils } from '../../../enum/AnimalTypeUtils.ts'
import PieChart from '../../commons/components/PieChart.tsx'
import PackageLotDescription from './PackageLotDescription.tsx'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import VisitFarmButton from '../../commons/components/VisitFarmButton.tsx'
import { Producer } from '@viandeendirect/api/dist/models/Producer'

export default function BeefProductionCustomerCard({production: production}) {

    const [beefProduction, setBeefProduction] = useState<BeefProduction>({})
    const [percentageSold, setPercentageSold] = useState(0)
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
        const loadData = async () => {
            const api = await apiBuilder.getAnonymousApi()
            const loadedBeefProduction = await api.getBeefProduction({beefProductionId: production.id})
            const producer = await api.getProductionProducerPublicData({productionId: production.id})
            loadedBeefProduction.producer = producer
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
                        {new AnimalTypeUtils().getLabel(beefProduction.animalType)}
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
                    <Stack alignItems="center" direction="row" gap={2}>
                        <span>
                            {displayFarmName(beefProduction?.producer)}
                        </span>
                        <VisitFarmButton producer={beefProduction?.producer}></VisitFarmButton>
                    </Stack>
                </div>
            </div>
        </div>
        <div className="sale-customer-card__product-batch-list">
            {beefProduction.lots?.map(getLot)}
        </div>
    </>

    function displayFarmName(producer: Producer): React.ReactNode {
        if(producer?.websiteUrl) {
            return <Link sx={{color: 'black'}} href={producer?.websiteUrl} target='_blank'>{producer?.farmName}</Link>
        } 
        return <>{producer?.farmName}</>
    }

    function getLot(lot: PackageLot) {
        return <PackageLotDescription key={`package-lot-description-${lot.id}`} lot={lot} production={production}></PackageLotDescription>
    }
}

