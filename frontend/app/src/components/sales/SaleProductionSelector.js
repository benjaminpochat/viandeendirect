import { useState, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { AuthenticatedApiBuilder } from '../security/AuthenticatedApiBuilder'
import Production from 'viandeendirect_eu/dist/model/Production'
import ProductionCard from '../productions/ProductionCard'

export default function SaleProductionSelector(production) {

    const { keycloak, initialized } = useKeycloak()
    const [productionsForSale, setProductionsForSale] = useState([])
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    useEffect(() => {
        loadProductionsForSale()
    }, [keycloak])

    function loadProductionsForSale() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak)
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getProductions({ 'forSale': true }, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getProductions called successfully. Returned data: ' + data)
                    setProductionsForSale(data)
                }
            })
        }, keycloak)
    }

    return productionsForSale.map(production => {
        return <div className='card-clickable'><ProductionCard key={'production-card-' + production.id} production={production} showActions={false}></ProductionCard></div>
    })
}