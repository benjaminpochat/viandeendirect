import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import { Button, ButtonGroup, Stepper, Step, StepLabel, StepContent, Typography, Autocomplete, Switch } from "@mui/material"
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { DatePickerElement, TextFieldElement, FormContainer, TimePickerElement } from 'react-hook-form-mui'
import 'dayjs/locale/fr';
import dayjs from 'dayjs'

import SaleProductionSelector from '../components/SaleProductionSelector.js'
import { Sale } from '@viandeendirect/api/dist/models/Sale'
import { Address } from '@viandeendirect/api/dist/models/Address'
import { Production } from '@viandeendirect/api/dist/models/Production'
import { Producer } from '@viandeendirect/api/dist/models/Producer'
import { ProducerService } from '../../commons/service/ProducerService.ts'
import { BeefProduction, instanceOfBeefProduction } from "@viandeendirect/api/dist/models/BeefProduction.js"
import { AnimalTypeUtils } from '../../../enum/AnimalTypeUtils.ts'
import { useSnackbar } from '../../commons/components/SnackbarProvider.tsx'

/**
 * @param {Production} production 
 * @returns 
 */
export default function SaleForm() {

    const SELECT_PRODUCTION_STEP = 'SELECT_PRODUCTION_STEP'
    const SET_DELIVERY_DATE_STEP = 'SET_DELIVERY_DATE_STEP'
    const SET_DELIVERY_ADDRESS_STEP = 'SET_DELIVERY_ADDRESS_STEP'
    const CONFIRMATION_STEP = 'CONFIRMATION_STEP'
    const ACCESS_TYPE_STEP = 'ACCESS_TYPE_STEP'

    const { keycloak } = useKeycloak()
    const navigate = useNavigate()
    const data: SaleFormData = useLoaderData()
    const addresses: Array<Address> = data.addresses
    const productions: Array<Production> = data.productions
    const producer: Producer = data.producer


    const [activeStep, setActiveStep] = useState(SELECT_PRODUCTION_STEP)
    const [completedSteps, setCompletedSteps] = useState<Array<string>>([])
    const [sale, setSale] = useState<Sale>({})
    const [selectProductionStepLabel, setSelectProductionStepLabel] = useState<string>('Choisir une production')
    const [selectedAddress, setSelectedAddress] = useState(undefined)
    const [privateSale, setPrivateSale] = useState<boolean>(false)
    const [queryParams] = useSearchParams()
    const showSnackbar = useSnackbar()

    useEffect(() => {
        if (queryParams.get('productionId')) {
            const selectedProductionId = Number(queryParams.get('productionId'))
            const selectedProduction = productions.filter(production => production.id === selectedProductionId).pop()
            selectProduction(selectedProduction)
        }
    })

    return <>
        <Typography variant='h6'>Nouvelle vente</Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
            <Step active={activeStep === SELECT_PRODUCTION_STEP}>
                <StepLabel>{getSelectProductionStepLabel()}</StepLabel>
                <StepContent>
                    <div>
                        <SaleProductionSelector selectProduction={selectProduction} productions={productions}></SaleProductionSelector>
                    </div>
                    <div>
                        <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                    </div>
                </StepContent>
            </Step>
            <Step active={activeStep === SET_DELIVERY_ADDRESS_STEP}>
                <StepLabel>{getSetDeliveryAddressStepLabel()}</StepLabel>
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
                                        <Button variant="outlined" size="small" onClick={cancel}>Abandonner</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </FormContainer>
                    </div>
                </StepContent>
            </Step>
            <Step active={activeStep === SET_DELIVERY_DATE_STEP}>
                <StepLabel>{getSetDeliveryDateStepLabel()}</StepLabel>
                <StepContent>
                    <div>
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
                    </div>
                </StepContent>
            </Step>
            <Step active={activeStep === ACCESS_TYPE_STEP}>
                <StepLabel>{getAccessTypeStepLabel()}</StepLabel>
                <StepContent>
                    <div>
                        <FormContainer onSuccess={validateAccessType}>
                            <div>
                                Vente publique 
                                <Switch onChange={(event) => setPrivateSale(event.target.checked)}></Switch>
                                Vente privée
                            </div>
                            {displayPrivateAccessField()}
                            <div>
                                <ButtonGroup>
                                    <Button type='submit' variant="contained" size="small">Valider</Button>
                                    <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                                </ButtonGroup>
                            </div>
                        </FormContainer>
                    </div>    
                </StepContent>
            </Step>
            <Step active={activeStep === CONFIRMATION_STEP}>
                <StepLabel>Validation</StepLabel>
                <StepContent>
                    <div>Veuillez contrôler les information de la vente avant de valider.</div>
                    <div>
                        <ButtonGroup>
                            <Button type='submit' variant="contained" size="small" onClick={() => validate()}>Valider</Button>
                            <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
                        </ButtonGroup>
                    </div>
                </StepContent>
            </Step>
        </Stepper>
    </>
    
    function getSelectProductionStepLabel(): string {
        return selectProductionStepLabel
    }

    function getSetDeliveryAddressStepLabel(): string {
        if(completedSteps.includes(SET_DELIVERY_ADDRESS_STEP)) {
            return `Lieu de livraison : ${sale.deliveryAddressName}`
        }
        return 'Définir le lieu de livraison'
    }

    function getSetDeliveryDateStepLabel(): string {
        if(completedSteps.includes(SET_DELIVERY_DATE_STEP)) {
            return `Livraison le ${dayjs(sale.deliveryStart).format('DD/MM/YYYY')} entre ${dayjs(sale.deliveryStart).format('HH:mm')} et ${dayjs(sale.deliveryStop).format('HH:mm')}`
        }
        return `Définir la date et l'heure de livraison`
    }

    function getAccessTypeStepLabel(): string {
        if(completedSteps.includes(ACCESS_TYPE_STEP)) {
            return sale.privateAccessKey ? `Vente privée - code d'accès = '${sale.privateAccessKey}'` : 'Vente publique'
        }
        return `Définir le type d'accès`
    }

    function selectProduction(production) {
        console.log('production selected for sale : ' + production)
        sale.productions = sale.productions ? [...sale.productions, production] : [production]
        setSale(sale)
        setActiveStep(SET_DELIVERY_ADDRESS_STEP)
        setCompletedSteps([...completedSteps, SELECT_PRODUCTION_STEP])
        updateSelectProductionStepLabel(production)
    }

    function validateDeliveryAddress(deliveryAddressFormData) {
        sale.deliveryAddressName = deliveryAddressFormData.name
        sale.deliveryAddressLine1 = deliveryAddressFormData.line1
        sale.deliveryAddressLine2 = deliveryAddressFormData.line2
        sale.deliveryCity = deliveryAddressFormData.city
        sale.deliveryZipCode = deliveryAddressFormData.zipCode
        setSale(sale)
        setCompletedSteps([...completedSteps, SET_DELIVERY_ADDRESS_STEP])
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
        setCompletedSteps([...completedSteps, SET_DELIVERY_DATE_STEP])
        setActiveStep(ACCESS_TYPE_STEP)
    }

    function displayPrivateAccessField(): React.ReactNode {
        if (privateSale) {
            return <div>
                <TextFieldElement required={privateSale} name="privateAccessCode" label="Code accès vente privée" variant="standard" />
            </div>
        }
        return <></>
    }

    function validateAccessType(accessTypeFormData) {
        sale.privateAccessKey = privateSale ? accessTypeFormData.privateAccessCode : undefined
        setSale(sale)
        setActiveStep(CONFIRMATION_STEP)
        setCompletedSteps([...completedSteps, ACCESS_TYPE_STEP])
    }

    async function validate() {
        const apiBuilder = new ApiBuilder()
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        try {
            await api.createProducerSale({producerId: +producer.id, sale: sale})
            showSnackbar(`Vos productions sont mises en vente dans l'espace client pour la livraison du ${dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - ${sale.deliveryAddressName}`, 'success');
            navigate(-1)
        } catch (error) {
            showSnackbar(`Oops... une erreur s'est produite`, 'error');
            console.error(error)
        }
    }

    function cancel() {
        navigate(-1)
    }

    async function updateSelectProductionStepLabel(selectedProduction: Production) {
        if (selectedProduction) {
            if (selectedProduction?.productionType === 'BeefProduction') {
                const apiBuilder = new ApiBuilder()
                const api = await apiBuilder.getAuthenticatedApi(keycloak)
                const beefProduction = await api.getBeefProduction({beefProductionId: +selectedProduction.id})
                setSelectProductionStepLabel(`Mise en vente de colis de viande de boeuf pour ${new AnimalTypeUtils().getLabel(beefProduction.animalType)} n° ${beefProduction.animalIdentifier} découpée le ${dayjs(beefProduction.cuttingDate).format('DD/MM/YYYY')}`)
                return
            }
            setSelectProductionStepLabel(`Production sélectionnée`)
            return
        }
        setSelectProductionStepLabel(`Choisir une production`)
    }
}

class SaleFormData {
    addresses: Array<Address>
    productions: Array<Production>
    producer: Producer
}

export async function loadSaleFormData(keycloakClient): Promise<SaleFormData> {
    const producerService = new ProducerService(keycloakClient)
    const producer: Producer = await producerService.loadProducer()
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloakClient)
    const addresses: Array<Address> = await api.getAddresses()
    const productions: Array<Production> = await api.getProductions({forSale: true})
    return {addresses: addresses, productions: productions, producer: producer}
}