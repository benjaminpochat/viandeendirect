import React from 'react'
import BeefProductionCard from "./BeefProductionCard.tsx"

export default function ProductionCard({
    production: production, 
    showActions: showActions,
    onClick: onClick
}) {

    return <div className={onClick ? 'card-clickable' : ''} onClick={onClick}>
        {getProductionCard()}
    </div>

    function getProductionCard() {
        switch (production.productionType) {
            case 'BeefProduction':
                return <BeefProductionCard 
                            key={production.id}
                            production={production} 
                            showActions={showActions}
                            onClick={onClick}>
                        </BeefProductionCard>
            default :
                return <></>
        }
    }
}