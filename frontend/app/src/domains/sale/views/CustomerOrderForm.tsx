import React from 'react'
import { useState, useEffect } from 'react'

import { Button, Checkbox, Stepper, Step, StepLabel, StepContent, Typography, Box, Toolbar, ButtonGroup, StepButton } from "@mui/material"
import dayjs from 'dayjs'

import { useKeycloak } from '@react-keycloak/web'
import { ApiInvoker } from '../../../api/ApiInvoker.ts'

import OrderItem from "viandeendirect_eu/dist/model/OrderItem"
import Order from "viandeendirect_eu/dist/model/Order"
import Production from "viandeendirect_eu/dist/model/Production"
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"

import PackageSelector from '../components/PackageSelector.tsx'
import { AuthenticationService } from '../../../authentication/AuthenticationService.ts'
import { useCookies } from 'react-cookie'

export default function CustomerOrderForm({ sale: sale, returnCallback: returnCallback }) {
    window.scroll(0,0)

    const SET_ITEMS_STEP = 1
    const AUTHENTICATION_STEP = 2
    const CONFIRMATION_STEP = 3
    const PAYMENT_STEP = 4

    const { keycloak, initialized } = useKeycloak()
    const apiInvoker = new ApiInvoker()
    const authenticationService = new AuthenticationService(keycloak)
    
    const [productions, setProductions] = useState<Array<Production>>([])
    const [order, setOrder] = useState<Order>({sale: sale})
    const [completedSteps, setCompletedSteps] = useState<Array<number>>([])
    const [items, setItems] = useState<Array<OrderItem>>([])
    const [activeStep, setActiveStep] = useState(SET_ITEMS_STEP)
    const [conditionApproved, setConditionApproved] = useState<boolean>(false)

    const [cookies, setCookie, removeCookie] = useCookies(['pendingOrder']);


    useEffect(() => {
        apiInvoker.callApiAnonymously(api => api.getSaleProductions, sale.id, setProductions)
        if (cookies.pendingOrder) {
            setItems(cookies.pendingOrder.items)
            if(authenticationService.isAuthenticated()) {
                setCompletedSteps([SET_ITEMS_STEP, AUTHENTICATION_STEP])
                setActiveStep(CONFIRMATION_STEP)
            } else {
                setCompletedSteps([SET_ITEMS_STEP])
                setActiveStep(AUTHENTICATION_STEP)
            }
        }
    }, [])

    return <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar/>
        <Typography variant='h6'>Votre commande pour la vente du {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}</Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
            <Step 
                disabled={!completedSteps?.includes(SET_ITEMS_STEP)} 
                completed={completedSteps?.includes(SET_ITEMS_STEP)}
                active={activeStep === SET_ITEMS_STEP}>
                <StepButton onClick={() => setActiveStep(SET_ITEMS_STEP)}>Sélectionnez les articles commandés</StepButton>
                <StepContent>
                    <div className='packages-list'>
                        {packageLots()}
                    </div>
                    <div>
                        {itemsValidationButton()}
                    </div>
                </StepContent>
            </Step>
            <Step 
                disabled={!completedSteps?.includes(AUTHENTICATION_STEP)} 
                completed={completedSteps?.includes(AUTHENTICATION_STEP)}
                active={activeStep === AUTHENTICATION_STEP}>
                <StepButton onClick={() => setActiveStep(AUTHENTICATION_STEP)}>{getAuthenticationStepLabel()}</StepButton>
                <StepContent>
                    {getAuthenticationStepContent()}
                </StepContent>
            </Step>
            <Step 
                disabled={!completedSteps?.includes(CONFIRMATION_STEP)} 
                completed={completedSteps?.includes(CONFIRMATION_STEP)}
                active={activeStep === CONFIRMATION_STEP}>
                <StepButton onClick={() => setActiveStep(CONFIRMATION_STEP)}>Acceptez les conditions</StepButton>
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
                            <Checkbox onChange={toggleConditionApproved} checked={conditionApproved}/>J'accepte les conditions
                        </div>
                    </div>
                    <Button disabled={!conditionApproved} variant="contained" size="small" onClick={approveConditions}>Valider la commande</Button>
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
        setCompletedSteps([...completedSteps, SET_ITEMS_STEP])
        setActiveStep(AUTHENTICATION_STEP)
        const updatedOrder = {...order, items: items}
        setCookie('pendingOrder', updatedOrder, {path: "/", maxAge: 3600})        
        setOrder(updatedOrder)
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
                <Button variant='contained' onClick={validateAuthentication}>Continuer avec ce compte</Button>
                <Button onClick={logout}>Se déconnecter et changer de compte</Button>
            </ButtonGroup>
        } 
        return <ButtonGroup size='small'>
                <Button variant='contained' onClick={login}>Se connecter</Button>
                <Button variant='contained' onClick={register}>Créer un compte</Button>
            </ButtonGroup>
    }

    function validateAuthentication() {
        setCompletedSteps([...completedSteps, AUTHENTICATION_STEP])
        createOrder(order)
        setActiveStep(CONFIRMATION_STEP)
    }

    function approveConditions() {
        setCompletedSteps([...completedSteps, CONFIRMATION_STEP])
        setActiveStep(PAYMENT_STEP)
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
        return <Button size="small" onClick={cancel}>Abandonner</Button>
    }

    function cancel() {
        removeCookie('pendingOrder')
        returnCallback(sale)
    }

    function login() {
        keycloak.login()
    }

    function logout() {
        keycloak.logout()
    }

    function register() {
        keycloak.register()
    }

    function payOrder() {
        //TODO : faire le truc qui paye
        removeCookie('pendingOrder')
        returnCallback(sale)
    }
}
