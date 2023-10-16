import { useEffect, useState } from 'react';
import BeefProductionCard from "./BeefProductionCard"

export default function ProductionCard({production: production, showActions: showActions}) {

    switch (production.productionType) {
        case 'BeefProduction':
            return <BeefProductionCard key={production.id} production={production} showActions={showActions}></BeefProductionCard>
        default :
            return <></>
    }
}