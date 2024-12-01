import React from 'react'
import { useState, useEffect } from 'react'

import { Button, Checkbox, Stepper, Step, StepLabel, StepContent, Typography, Box, Toolbar, ButtonGroup, StepButton } from "@mui/material"
import dayjs from 'dayjs'

import { useKeycloak } from '@react-keycloak/web'

import { Customer } from "@viandeendirect/api/dist/models/Customer"
import { Order } from "@viandeendirect/api/dist/models/Order"
import { Production } from "@viandeendirect/api/dist/models/Production"
import { PackageLot } from "@viandeendirect/api/dist/models/PackageLot"

import PackageSelector from '../components/PackageSelector.tsx'
import { AuthenticationService } from '../../../authentication/service/AuthenticationService.ts'
import { useCookies } from 'react-cookie'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { Sale } from '@viandeendirect/api/dist/models/Sale'

export default function CustomerOrderForm() {
    window.scroll(0,0)

    const SET_ITEMS_STEP = 1
    const AUTHENTICATION_STEP = 2
    const CONFIRMATION_STEP = 3
    const PAYMENT_STEP = 4

    const { keycloak } = useKeycloak()
    const navigate = useNavigate()
    const apiBuilder = new ApiBuilder()
    const authenticationService = new AuthenticationService(keycloak)

    const data = useLoaderData()
    const productions: Array<Production> = data.productions
    const sale: Sale = data.sale

    const [order, setOrder] = useState<Order | undefined>({sale: sale, items: []})
    const [completedSteps, setCompletedSteps] = useState<Array<number>>([])
    const [activeStep, setActiveStep] = useState(SET_ITEMS_STEP)
    const [conditionApproved, setConditionApproved] = useState<boolean>(false)

    const [cookies, setCookie, removeCookie] = useCookies(['pendingOrder']);

    useEffect(() => {
        const completedSteps: Array<number> = []
        let activeStep: number = SET_ITEMS_STEP
        let updatedOrder: Order | undefined = {...order}
        if (cookies.pendingOrder && cookies.pendingOrder.items.length > 0) {
            updatedOrder.items = cookies.pendingOrder.items
            completedSteps.push(SET_ITEMS_STEP)
            activeStep = AUTHENTICATION_STEP
        }
        if (authenticationService.isAuthenticated()) {
            const customer: Customer = {
                user: {
                    email: authenticationService.getCurrentUserEmail()
                }
            }
            updatedOrder.customer = customer
            completedSteps.push(AUTHENTICATION_STEP)
            activeStep = completedSteps.includes(SET_ITEMS_STEP) ? CONFIRMATION_STEP : SET_ITEMS_STEP
        }
        setOrder(updatedOrder)
        setCompletedSteps(completedSteps)
        setActiveStep(activeStep)
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
                    <Button disabled={!conditionApproved} variant="contained" size="small" onClick={approveConditions}>Valider les conditions</Button>
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
        const totalAmount = order.items.map(item => item.packageLot.unitPrice * item.packageLot.netWeight * item.quantity)
            .reduce((total, amount) => total + amount, 0)
        const buttonLabel = totalAmount > 0 ? `Valider la commande pour ${totalAmount} €TTC` : 'Valider la commande'
        const disabled = totalAmount === 0
        return <Button type='submit' variant="contained" size="small" onClick={validateItems} disabled={disabled}>{buttonLabel}</Button>
    }

    function packageSelector(lot: PackageLot) {
        return <PackageSelector key={`selector-lot-${lot.id}`} lot={lot} orderItems={order.items} updateItemsCallback={items => setOrder({...order, items: items})}></PackageSelector>
    }

    function validateItems() {
        setCompletedSteps([...completedSteps, SET_ITEMS_STEP])
        setActiveStep(AUTHENTICATION_STEP)
        const orderLight = {...order}
        orderLight.items.forEach(item => item.packageLot.photo = undefined)
        orderLight.sale.productions = undefined
        setCookie('pendingOrder', orderLight, {path: "/", maxAge: 3600})        
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
        const customer: Customer = {
            user: {
                email: authenticationService.getCurrentUserEmail()
            }
        }
        setOrder({...order, customer: customer})
        setActiveStep(CONFIRMATION_STEP)
    }

    function approveConditions() {
        setCompletedSteps([...completedSteps, CONFIRMATION_STEP])
        setActiveStep(PAYMENT_STEP)
    }

    function toggleConditionApproved() {
        setConditionApproved(!conditionApproved)
    }

    function getFinalButton() {
        if (conditionApproved && activeStep === PAYMENT_STEP) {
            return <ButtonGroup size='small'>
                <Button size="small" variant='contained' onClick={payOrder}>Payer ma commande</Button>
                <Button size="small" onClick={cancel}>Abandonner</Button>
            </ButtonGroup>
        }
        return <Button size="small" onClick={cancel}>Abandonner</Button>
    }

    function cancel() {
        removeCookie('pendingOrder', {path: "/", maxAge: 3600})
        navigate('/')
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

    async function payOrder() {
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        const orderWithPayment = await api.createOrderPayment({order: order})
        redirectToStripePayment(orderWithPayment.payment.paymentUrl)
    }

    function redirectToStripePayment(url: string) {
        console.log(`payment created for order ${order.id}`)
        window.location.href = url
        removeCookie('pendingOrder', {path: "/", maxAge: 3600})
    }
}

export async function loadCustomerOrderFormData(saleId: number) {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAnonymousApi()
    const sale = await api.getSale({saleId: saleId})
    const productions = await api.getSaleProductions({saleId: saleId})
    return {productions: productions, sale: sale}
}
