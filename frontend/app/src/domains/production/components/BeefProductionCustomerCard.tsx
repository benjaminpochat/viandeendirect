import React from 'react'
import { useEffect, useState } from 'react'

import { Typography } from "@mui/material"

import BeefProduction from 'viandeendirect_eu/dist/model/BeefProduction.js'
import { AnimalTypeUtils } from '../../../enum/AnimalType.ts'
import { ApiInvoker } from '../../../api/ApiInvoker.ts'
import PieChart from '../../commons/components/PieChart.tsx'

export default function BeefProductionCustomerCard({production: production}) {

    const [beefProduction, setBeefProduction] = useState<BeefProduction>({})
    const [percentageSold, setPercentageSold] = useState(0)
    const apiInvoker = new ApiInvoker()

    useEffect(() => {
        apiInvoker.callApiAnonymously(api => api.getBeefProduction, production.id, setBeefProduction)
        apiInvoker.callApiAnonymously(api => api.getProductionPercentageSold, production.id, setPercentageSold)
    }, [])


    return <>
        <div className="sale-customer-card__product-information">
            <Typography variant="h5">Abattage bovin</Typography>
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
                        ferme_elevage
                    </span>
                </div>
            </div>
        </div>
        <div className="sale-customer-card__product-batch-list">
            getProducts()
        </div>
    </>
}

