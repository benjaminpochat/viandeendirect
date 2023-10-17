import { useState, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Typography, Button, Stepper, Step, StepLabel, StepContent } from "@mui/material"
import { AuthenticatedApiBuilder } from '../security/AuthenticatedApiBuilder'
import { DatePickerElement, FormContainer } from 'react-hook-form-mui'
import Production from 'viandeendirect_eu/dist/model/Production'
import SaleProductionSelector from './SaleProductionSelector'
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/fr';

const steps = ['Choisir une production', 'Définir le lieu et l\'heure', 'Choisir les produits mis en vente']

/**
 * @param {Production} production 
 * @returns 
 */
export default function SaleForm(production) {

    const SELECT_PRODUCTION_STEP = 'SELECT_PRODUCTION_STEP'
    const SET_DATE_AND_PLACE_STEP = 'SET_DATE_AND_PLACE_STEP'

    const { keycloak, initialized } = useKeycloak()
    const [ activeStep, setActiveStep ] = useState(SELECT_PRODUCTION_STEP)
    const [ productionForSale, setProductionForSale ] = useState(undefined)
    const [ productTemplates, setProductTemplates ] = useState([])
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    function selectProduction(production) {
        console.log('production selected for sale : ' + production)
        setProductionForSale(production)
        setActiveStep('SET_DATE_AND_PLACE_STEP')
    }

/*
    useEffect(() => {
        loadProductTemplates(production.productionType)
    }, [keycloak])
*/
    return <Stepper activeStep={activeStep} orientation="vertical">
        <Step active={activeStep === SELECT_PRODUCTION_STEP}>
            <StepLabel>Choisir une production</StepLabel>
            <StepContent>
                <SaleProductionSelector selectProduction={selectProduction}></SaleProductionSelector>
            </StepContent>
        </Step>
        <Step active={activeStep === SET_DATE_AND_PLACE_STEP}>
            <StepLabel>Définir le lieu et l'heure</StepLabel>
            <StepContent>
                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                        <FormContainer>
                            <div className="form">
                                <DatePickerElement name="deliveryDate" label="Date de livraison" variant="standard" />
                            </div>
                        </FormContainer>
                    </LocalizationProvider>
                </div>
            </StepContent>
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