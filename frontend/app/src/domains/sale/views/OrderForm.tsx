import React from 'react'
import { useState, useEffect } from 'react'

import { Button, Stepper, Step, StepLabel, StepContent, Typography } from "@mui/material"
import dayjs from 'dayjs'

import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder.js'

import Customer from "viandeendirect_eu/dist/model/Customer"
import OrderItem from "viandeendirect_eu/dist/model/OrderItem"
import Order from "viandeendirect_eu/dist/model/Order"
import Production from "viandeendirect_eu/dist/model/Production"
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"
import Sale from "viandeendirect_eu/dist/model/Sale"

import PackageSelector from '../components/PackageSelector.tsx'
import CustomerSelector from '../components/CustomerSelector.tsx'
import OrderSummary from '../components/OrderSummary.tsx'

export default function OrderForm({ sale: sale, returnCallback: returnCallback }) {

    const SET_ITEMS_STEP = 1
    const SET_CUSTOMER_STEP = 2
    const CONFIRMATION_STEP = 3

    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    const [productions, setProductions] = useState<Array<Production>>([])
    const [customers, setCustomers] = useState<Array<Customer>>([])
    const [order, setOrder] = useState<Order>({sale: sale})
    const [items, setItems] = useState<Array<OrderItem>>([])
    const [activeStep, setActiveStep] = useState(SET_ITEMS_STEP)

    useEffect(() => {
        loadProductions()
        loadCustomers()
    }, [keycloak])

    function loadProductions() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak);
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getSaleProductions(sale.id, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getSaleProductions called successfully. Returned data: ' + data)
                    setProductions(data)
                }
            })
        }, keycloak)
    }

    function loadCustomers() {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak);
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.getCustomers(undefined, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.getCustomers called successfully. Returned data: ' + data)
                    setCustomers(data)
                }
            })
        }, keycloak)        
    }

    return <>
        <Typography variant='h6'>Creation d'une commande pour la vente du {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}</Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
            <Step active={activeStep === SET_ITEMS_STEP}>
                <StepLabel>Sélectionner les articles commandés</StepLabel>
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
                <StepLabel>Définir le client</StepLabel>
                <StepContent>
                    <div>
                        <div>
                            <CustomerSelector callback={validateCustomer} customers={customers}></CustomerSelector>
                        </div>
                    </div>
                </StepContent>
            </Step>
            <Step active={activeStep === CONFIRMATION_STEP}>
                <StepLabel>Confirmation de la commande</StepLabel>
                <StepContent>
                    <div>
                        <OrderSummary order={order}></OrderSummary>
                    </div>
                    <Button variant="contained" size="small" onClick={validateOrder}>Valider la commande</Button>
                </StepContent>
            </Step>
        </Stepper>
        <Button size="small" onClick={() => returnCallback(sale)}>Abandonner</Button>
    </>

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

    function validateCustomer(customer: Customer) {
        setOrder({...order, customer: customer})
        setActiveStep(CONFIRMATION_STEP)
    }

    function validateOrder() {
        if(!order.customer.id) {
            order.customer = createCustomer(order.customer)
        }
        createOrder(order)
        returnCallback(sale)
    }

    function createCustomer(customer: Customer){
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak);
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.createCustomer(customer, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.createCustomer called successfully. Returned data: ' + data)
                    setOrder({...order, customer: data})
                }
            })
        }, keycloak)
    }

    function createOrder(order: Order) {
        let api = authenticatedApiBuilder.getAuthenticatedApi(keycloak);
        authenticatedApiBuilder.invokeAuthenticatedApi(() => {
            api.createOrder(order, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log('api.createOrder called successfully. Returned data: ' + data)
                }
            })
        }, keycloak)
    }
}
