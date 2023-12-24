import { useState, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Button, ButtonGroup, Stepper, Step, StepLabel, StepContent, Typography, Autocomplete } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder'
import { DatePickerElement, TextFieldElement, FormContainer, TimePickerElement } from 'react-hook-form-mui'

import Production from 'viandeendirect_eu/dist/model/Production'
import Sale from 'viandeendirect_eu/dist/model/Sale'

import SaleProductionSelector from '../components/SaleProductionSelector'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/fr';
import dayjs from 'dayjs'

const steps = ['Choisir une production', 'Définir le lieu et l\'heure', 'Choisir les produits mis en vente']

/**
 * @param {Production} production 
 * @returns 
 */
export default function SaleForm({returnCallback: returnCallback}) {

    const SELECT_PRODUCTION_STEP = 'SELECT_PRODUCTION_STEP'
    const SET_DELIVERY_DATE_STEP = 'SET_DELIVERY_DATE_STEP'
    const SET_DELIVERY_ADDRESS_STEP = 'SET_DELIVERY_ADDRESS_STEP'
    const CONFIRMATION_STEP = 'CONFIRMATION_STEP'

    const { keycloak, initialized } = useKeycloak()
    const [activeStep, setActiveStep] = useState(SELECT_PRODUCTION_STEP)
    const [sale, setSale] = useState(new Sale())
    const [addresses, setAddresses] = useState([])
    const [selectedAddress, setSelectedAddress] = useState(undefined)
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    useEffect(() => {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak);
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getAddresses((error, data, response) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('api.getAddresses called successfully. Returned data: ' + data);
                    setAddresses(data)
                }
            })
        }, keycloak)
    }, [keycloak])

    return <>
        <Typography variant='h6'>Nouvelle vente</Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
            <Step active={activeStep === SELECT_PRODUCTION_STEP}>
                <StepLabel>Choisir une production</StepLabel>
                <StepContent>
                    <div>
                        <SaleProductionSelector selectProduction={selectProduction}></SaleProductionSelector>
                    </div>
                    <div>
                        <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                    </div>
                </StepContent>
            </Step>
            <Step active={activeStep === SET_DELIVERY_ADDRESS_STEP}>
                <StepLabel>Définir le lieu de livraison</StepLabel>
                <StepContent>
                    <div>
                        <FormContainer values={{
                                "name": selectedAddress?.name,
                                "line1": selectedAddress?.addressLine1,
                                "line2": selectedAddress?.addressLine2,
                                "zipCode": selectedAddress?.zipCode,
                                "city": selectedAddress?.city
                            }}
                                onSuccess={validateDeliveryAddress}
                                FormProps={{"autoComplete": "off"}}>
                            <div className="form">
                                <div>
                                    <Autocomplete
                                        freeSolo
                                        options={addresses}
                                        getOptionLabel={(address) => address.name}
                                        onChange={(event, address) => setSelectedAddress(address)}
                                        renderInput={(params) => <TextFieldElement {...params} required name="name" label="Nom de l'adresse" variant="standard" />} />
                                </div>
                                <div>
                                    <TextFieldElement required name="line1" label="Numéro et rue" variant="standard" />
                                </div>
                                <div>
                                    <TextFieldElement name="line2" label="Complément" variant="standard" />
                                </div>
                                <div>
                                    <TextFieldElement required name="zipCode" label="Code postal" variant="standard" />
                                </div>
                                <div>
                                    <TextFieldElement required name="city" label="Commune" variant="standard" />
                                </div>
                                <div>
                                    <ButtonGroup>
                                        <Button type='submit' variant="contained" size="small">Valider</Button>
                                        <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </FormContainer>
                    </div>
                </StepContent>
            </Step>
            <Step active={activeStep === SET_DELIVERY_DATE_STEP}>
                <StepLabel>Définir l'heure de livraison</StepLabel>
                <StepContent>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                            <FormContainer onSuccess={validateDeliveryDate}>
                                <div className="form">
                                    <div>
                                        <DatePickerElement required name="date" label="Date de la livraison" variant="standard" />
                                    </div>
                                    <div>
                                        <TimePickerElement required name="startTime" label="Début de la livraison"/>
                                    </div>
                                    <div>
                                        <TimePickerElement required name="stopTime" label="Fin de la livraison"/>
                                    </div>
                                    <div>
                                        <ButtonGroup>
                                            <Button type='submit' variant="contained" size="small">Valider</Button>
                                            <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                                        </ButtonGroup>
                                    </div>                                    
                                </div>
                            </FormContainer>
                        </LocalizationProvider>
                    </div>
                </StepContent>
            </Step>
            <Step active={activeStep === CONFIRMATION_STEP}>
                <StepLabel>Récapitulatif</StepLabel>
                <StepContent>
                    <div>
                        <div>Production vendue : abattage bovin</div>
                        <div>Lieu de livraison : {sale.deliveryAddressName}</div>
                        <div>Livraison le {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} entre {dayjs(sale.deliveryStart).format('HH:mm')} et {dayjs(sale.deliveryStop).format('HH:mm')}
                        </div>
                        <div>
                            <ButtonGroup>
                                <Button type='submit' variant="contained" size="small" onClick={() => validate()}>Valider</Button>
                                <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </StepContent>
            </Step>
        </Stepper>
    </>
    
    function selectProduction(production) {
        console.log('production selected for sale : ' + production)
        sale.productions = [production]
        setSale(sale)
        setActiveStep(SET_DELIVERY_ADDRESS_STEP)
    }

    function validateDeliveryAddress(deliveryAddressFormData) {
        sale.deliveryAddressName = deliveryAddressFormData.name
        sale.deliveryAddressLine1 = deliveryAddressFormData.line1
        sale.deliveryAddressLine2 = deliveryAddressFormData.line2
        sale.deliveryCity = deliveryAddressFormData.city
        sale.deliveryZipCode = deliveryAddressFormData.zipCode
        setSale(sale)
        setActiveStep(SET_DELIVERY_DATE_STEP)
    }

    function validateDeliveryDate(deliveryDateFormData) {
        sale.deliveryStart = new Date()
        sale.deliveryStart.setDate(deliveryDateFormData.date.toDate().getDate())
        sale.deliveryStart.setMonth(deliveryDateFormData.date.toDate().getMonth())
        sale.deliveryStart.setFullYear(deliveryDateFormData.date.toDate().getFullYear())
        sale.deliveryStart.setHours(deliveryDateFormData.startTime.toDate().getHours())
        sale.deliveryStart.setMinutes(deliveryDateFormData.startTime.toDate().getMinutes())

        sale.deliveryStop = new Date()
        sale.deliveryStop.setDate(deliveryDateFormData.date.toDate().getDate())
        sale.deliveryStop.setMonth(deliveryDateFormData.date.toDate().getMonth())
        sale.deliveryStop.setFullYear(deliveryDateFormData.date.toDate().getFullYear())
        sale.deliveryStop.setHours(deliveryDateFormData.stopTime.toDate().getHours())
        sale.deliveryStop.setMinutes(deliveryDateFormData.stopTime.toDate().getMinutes())

        setSale(sale) 
        setActiveStep(CONFIRMATION_STEP)
    }

    function validate() {
        returnCallback()
    }

    function cancel() {
        returnCallback()
    }
}