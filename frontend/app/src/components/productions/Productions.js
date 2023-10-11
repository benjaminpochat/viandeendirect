import { useEffect, useState } from 'react'
import { Button } from "@mui/material"
import BeefProductionForm from './BeefProductionForm'
import BeefProductionCard from './BeefProductionCard'
import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../security/AuthenticatedApiBuilder'
import Production from 'viandeendirect_eu/dist/model/Production'
import BeefProduction from 'viandeendirect_eu/dist/model/BeefProduction'

function Productions() {

    const [currentAction, setCurrentAction] = useState('NONE')
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
            api.getProductions((error, data, response) => {
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
            case 'NONE': return productionsList()
            case 'BEEF_PRODUCTION_CREATION': return <BeefProductionForm callback={(action) => {
                setCurrentAction(action)
                loadProductions()
            }} />
        }
    }

    function productionsList() {
        return <>
            <div className='card-list'>
            {getProductionCards()}
            </div>
            <Button variant="contained" size="small" onClick={() => setCurrentAction('BEEF_PRODUCTION_CREATION')}>Ajouter un abattage bovin</Button>
        </>
    }

    function getProductionCards() {
        return productions.map(production => getProductionCard(production))
    }

    /**
     * @param {Production} production 
     */
    function getProductionCard(production) {
        switch (production.productionType) {
            case 'BeefProduction':
                return getBeefProductionCard(production)
                break
        }
    }

    /**
     * @param {BeefProduction} beefProduction 
     */
    function getBeefProductionCard(beefProduction) {
        return (
            <BeefProductionCard production={beefProduction}></BeefProductionCard>
        )
    }
}

export default Productions