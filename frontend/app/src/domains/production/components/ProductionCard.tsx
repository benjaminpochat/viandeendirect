import React from 'react'
import BeefProductionCard from "./BeefProductionCard.tsx"

export default function ProductionCard({
    production: production, 
    showActions: showActions,
    viewBeefProductionCallback: viewBeefProductionCallback
}) {

    switch (production.productionType) {
        case 'BeefProduction':
            return <BeefProductionCard 
                        key={production.id}
                        production={production} 
                        showActions={showActions}
                        viewBeefProductionCallback={viewBeefProductionCallback}>
                    </BeefProductionCard>
        default :
            return <></>
    }
}