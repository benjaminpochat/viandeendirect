import { useState, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Typography, Button, Stepper, Step, StepLabel } from "@mui/material"
import { AuthenticatedApiBuilder } from '../security/AuthenticatedApiBuilder'
import Production from 'viandeendirect_eu/dist/model/Production'
import SaleProductionSelector from './SaleProductionSelector'

const steps = ['Choisir une production', 'Définir le lieu et l\'heure', 'Choisir les produits mis en vente']

/**
 * @param {Production} production 
 * @returns 
 */
export default function SaleForm(production) {

    const { keycloak, initialized } = useKeycloak()
    const [ productTemplates, setProductTemplates ] = useState([])
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    const [activeStep, setActiveStep] = useState(0);

/*
    useEffect(() => {
        loadProductTemplates(production.productionType)
    }, [keycloak])
*/
    return <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
            <StepLabel>Choisir une production</StepLabel>
            <SaleProductionSelector></SaleProductionSelector>
        </Step>
        <Step>
            <StepLabel>Définir le lieu et l'heure</StepLabel>
        </Step>
        <Step>
            <StepLabel>Choisir les produits mis en vente</StepLabel>
        </Step>
    </Stepper>

    /*
    return <>
        {productTemplates.foreach(productTemplate => {getProductTemplateSelector(productTemplate)})}
    </>
    */

    /*
    function loadProductTemplates() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak)
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getProductTemplates((error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getProductTemplates called successfully. Returned data: ' + data)
                    setProductTemplates(data)
                }
            })
        }, keycloak)
    }
*/
    function productTemplateSelector(productTemplate) {
        return <></>
    }
}