import React from 'react'

import BeefProductionCustomerCard from './BeefProductionCustomerCard.tsx';

export default function ProductionCustomerCard({production: production}) {
    switch (production.productionType) {
        case 'BeefProduction':
            return <BeefProductionCustomerCard production={production}></BeefProductionCustomerCard>
        default :
            return <></>
    }
}