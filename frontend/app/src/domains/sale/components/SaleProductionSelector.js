import { useState, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import ProductionCard from '../../production/components/ProductionCard.tsx'

export default function SaleProductionSelector({selectProduction: selectProduction}) {

    const { keycloak, initialized } = useKeycloak()
    const [productionsForSale, setProductionsForSale] = useState([])
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
        loadProductionsForSale()
    }, [keycloak])

    function loadProductionsForSale() {
        apiBuilder.getAuthenticatedApi(keycloak).then(api => {
            apiBuilder.invokeAuthenticatedApi(() => {
                api.getProductions({ 'forSale': true }, (error, data, response) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('api.getProductions called successfully. Returned data: ' + data)
                        setProductionsForSale(data)
                    }
                })
            }, keycloak)
        })
    }

    function handleProductSelection(production) {
        selectProduction(production)
    }

    return productionsForSale.map(production => {
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