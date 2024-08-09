import ProductionCard from '../../production/components/ProductionCard.tsx'

export default function SaleProductionSelector({selectProduction: selectProduction, productions: productions}) {


    function handleProductSelection(production) {
        selectProduction(production)
    }

    return productions.map(production => {
        return <div className='card-clickable'>
                    <ProductionCard 
                        key={'production-card-' + production.id} 
                        production={production} 
                        showActions={false}
                        onClick={() => handleProductSelection(production)}>
                    </ProductionCard>
                </div>
    })
}