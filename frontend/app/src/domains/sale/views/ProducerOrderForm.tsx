import React from 'react'
import { useState, useEffect } from 'react'

import { Button, Stepper, Step, StepLabel, StepContent, Typography } from "@mui/material"
import dayjs from 'dayjs'

import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'

import Customer from "viandeendirect_eu/dist/model/Customer"
import OrderItem from "viandeendirect_eu/dist/model/OrderItem"
import Order from "viandeendirect_eu/dist/model/Order"
import Production from "viandeendirect_eu/dist/model/Production"
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"
import Sale from "viandeendirect_eu/dist/model/Sale"

import PackageSelector from '../components/PackageSelector.tsx'
import CustomerSelector from '../components/CustomerSelector.tsx'
import OrderSummary from '../components/OrderSummary.tsx'
import { ApiInvoker } from '../../../api/ApiInvoker.ts'

export default function ProducerOrderForm({ producer: producer, sale: sale, returnCallback: returnCallback }) {

    const SET_ITEMS_STEP = 1
    const SET_CUSTOMER_STEP = 2
    const CONFIRMATION_STEP = 3

    const { keycloak, initialized } = useKeycloak()
    const apiInvoker = new ApiInvoker()
    const apiBuilder = new ApiBuilder()

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
        apiInvoker.callApiAuthenticatedly(
            keycloak, 
            api => api.getSaleProductions, 
            sale.id, setProductions, 
            console.error)
    }

    function loadCustomers() {
        apiInvoker.callApiAuthenticatedly(
            keycloak, 
            api => api.getProducerCustomers, 
            producer.id, 
            setCustomers, 
            console.error)
    }

    function createCustomerAndOrder(customer: Customer){
        apiInvoker.callApiAuthenticatedly(
            keycloak, 
            api => api.createCustomer, 
            customer, 
            customer => {
                const updatedOrder = {...order, customer: customer}
                setOrder(updatedOrder)
                createOrder(updatedOrder)
            }, 
            console.error)
    }

    function createOrder(order: Order) {
        apiInvoker.callApiAuthenticatedly(
            keycloak, 
            api => api.createOrder, 
            order, 
            () => returnCallback(sale),
            console.error)
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
            createCustomerAndOrder(order.customer)
        } else {
            createOrder(order)
        }
    }
}
