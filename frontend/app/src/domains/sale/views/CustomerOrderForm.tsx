import React from 'react'
import { useState, useEffect } from 'react'

import { Button, Checkbox, Stepper, Step, StepLabel, StepContent, Typography, Box, Toolbar, ButtonGroup } from "@mui/material"
import dayjs from 'dayjs'

import { useKeycloak } from '@react-keycloak/web'
import { ApiInvoker } from '../../../api/ApiInvoker.ts'

import OrderItem from "viandeendirect_eu/dist/model/OrderItem"
import Order from "viandeendirect_eu/dist/model/Order"
import Production from "viandeendirect_eu/dist/model/Production"
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"

import PackageSelector from '../components/PackageSelector.tsx'
import { AuthenticationService } from '../../../authentication/AuthenticationService.ts'

export default function CustomerOrderForm({ sale: sale, returnCallback: returnCallback }) {
    window.scroll(0,0)

    const SET_ITEMS_STEP = 1
    const SET_CUSTOMER_STEP = 2
    const CONFIRMATION_STEP = 3
    const PAYMENT_STEP = 4

    const { keycloak, initialized } = useKeycloak()
    const apiInvoker = new ApiInvoker()
    const authenticationService = new AuthenticationService(keycloak)
    
    const [productions, setProductions] = useState<Array<Production>>([])
    const [order, setOrder] = useState<Order>({sale: sale})
    const [items, setItems] = useState<Array<OrderItem>>([])
    const [activeStep, setActiveStep] = useState(SET_ITEMS_STEP)
    const [conditionApproved, setConditionApproved] = useState<boolean>(false)

    useEffect(() => {
        apiInvoker.callApiAnonymously(api => api.getSaleProductions, sale.id, setProductions)
    }, [])

    return <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar/>
        <Typography variant='h6'>Votre commande pour la vente du {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}</Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
            <Step active={activeStep === SET_ITEMS_STEP}>
                <StepLabel>Sélectionnez les articles commandés</StepLabel>
                <StepContent>
                    <div className='packages-list'>
                        {packageLots()}
                    </div>
                    <div>
                        {itemsValidationButton()}
                    </div>
                </StepContent>
            </Step>
            <Step active={activeStep === SET_CUSTOMER_STEP}>
                <StepLabel>{getAuthenticationStepLabel()}</StepLabel>
                <StepContent>
                    {getAuthenticationStepContent()}
                </StepContent>
            </Step>
            <Step active={activeStep === CONFIRMATION_STEP}>
                <StepLabel>Acceptez les conditions</StepLabel>
                <StepContent>
                    <div>
                        <div>
                            En validant ma commande je m'engage à :
                            <ol>
                                <li>venir chercher la marchandise au rendez-vous fixé :
                                    <div>le {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} entre {dayjs(sale.deliveryStart).format('HH:mm')} et {dayjs(sale.deliveryStop).format('HH:mm')}</div>
                                    <div>à l'adresse suivante :</div>
                                    <div>{sale.deliveryAddressLine1}</div>
                                    <div>{sale.deliveryAddressLine2}</div>
                                    <div>{sale.deliveryZipCode}</div>
                                    <div>{sale.deliveryCity}</div>
                                </li>
                                <li>respecter la chaîne du froid dès la réception de la marchandise</li>
                            </ol>
                        </div>
                        <div>
                            <Checkbox onChange={toggleConditionApproved}/>J'accepte les conditions
                        </div>
                    </div>
                    <Button disabled={!conditionApproved} variant="contained" size="small" onClick={() => setActiveStep(PAYMENT_STEP)}>Valider la commande</Button>
                </StepContent>
            </Step>
            <Step active={activeStep === PAYMENT_STEP}>
                <StepLabel>Payez votre commande</StepLabel>
            </Step>
        </Stepper>
        {getFinalButton()}
    </Box>

    function packageLots() {
        return productions.flatMap(production => production.lots).map(lot => packageSelector(lot))
    }

    function itemsValidationButton(){
        const totalAmount = items.map(item => item.packageLot.unitPrice * item.packageLot.netWeight * item.quantity)
            .reduce((total, amount) => total + amount, 0)
        const buttonLabel = totalAmount > 0 ? `Valider la commande pour ${totalAmount} €TTC` : 'Valider la commande'
        const disabled = totalAmount === 0
        return <Button type='submit' variant="contained" size="small" onClick={validateItems} disabled={disabled}>{buttonLabel}</Button>
    }

    function packageSelector(lot: PackageLot) {
        return <PackageSelector lot={lot} orderItems={items} updateItemsCallback={setItems}></PackageSelector>
    }

    function validateItems() {
        setActiveStep(SET_CUSTOMER_STEP)
        setOrder({...order, items: items})
    }

    function getAuthenticationStepLabel(): string {
        if (authenticationService.isAuthenticated()) {
            return "Votre commande est au nom de " + authenticationService.getCurrentUserName()
        }
        return "Identifiez-vous"
    }

    function getAuthenticationStepContent() {
        if (authenticationService.isAuthenticated()) {
            return <ButtonGroup size='small'>
                <Button variant='contained' onClick={validateOrder}>Continuer avec ce compte</Button>
                <Button>Se déconnecter et changer de compte</Button>
            </ButtonGroup>
        } return <Button>Se connecter</Button>
    }

    function validateOrder() {
        createOrder(order)
        setActiveStep(CONFIRMATION_STEP)
    }

    function createOrder(order: Order) {
        apiInvoker.callApiAuthenticatedly(api => api.createOrder, order, () => {}, keycloak)
    }

    function toggleConditionApproved() {
        setConditionApproved(!conditionApproved)
    }

    function getFinalButton() {
        if (conditionApproved && activeStep === PAYMENT_STEP) {
            return <Button size="small" variant='contained' onClick={payOrder}>Payer ma commande</Button>
        }
        return <Button size="small" onClick={() => returnCallback(sale)}>Abandonner</Button>
    }

    function payOrder() {
        //TODO : faire le truc qui paye
        returnCallback(sale)
    }
}
