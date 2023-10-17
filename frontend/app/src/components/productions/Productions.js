import { useEffect, useState } from 'react'
import { Button } from "@mui/material"
import BeefProductionForm from './BeefProductionForm'
import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../security/AuthenticatedApiBuilder'
import ProductionCard from './ProductionCard'
import { PackageLotsCreator } from './PackageLotsCreator'

export default function Productions() {

    const BEEF_PRODUCTION_CREATION = 'BEEF_PRODUCTION_CREATION'
    const BEEF_PRODUCTION_PACKAGE_MODIFICATION = 'BEEF_PRODUCTION_PACKAGE_MODIFICATION'
    const NONE = 'NONE'

    const [currentAction, setCurrentAction] = useState(NONE)
    const [productions, setProductions] = useState([])
    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    useEffect(() => {
        loadProductions()
    }, [keycloak])

    return <>{getContent()}</>

    function loadProductions() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak)
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getProductions({}, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getProductions called successfully. Returned data: ' + data)
                    setProductions(data)
                }
            })
        }, keycloak)
    }

    function getContent() {
        switch (currentAction) {
            case NONE: return productionsList()
            case BEEF_PRODUCTION_CREATION: return <BeefProductionForm callback={(action) => {
                setCurrentAction(action)
                loadProductions()
            }} />
            case BEEF_PRODUCTION_PACKAGE_MODIFICATION: return <PackageLotsCreator></PackageLotsCreator>
        }
    }

    function productionsList() {
        return <>
            <div className='card-list'>
            {getProductionCards()}
            </div>
            <Button variant="contained" size="small" onClick={() => setCurrentAction(BEEF_PRODUCTION_CREATION)}>Ajouter un abattage bovin</Button>
        </>
    }

    function getProductionCards() {
        return productions.map(production => <ProductionCard 
                                                production={production} 
                                                showActions={true} 
                                                setPackageModificationLayoutContent={() => setCurrentAction(BEEF_PRODUCTION_PACKAGE_MODIFICATION)}>    
                                            </ProductionCard>)
    }
}