import React from 'react'
import { useState, useEffect } from 'react'

import { Button, Stepper, Step, StepLabel, StepContent, Typography } from "@mui/material"
import dayjs from 'dayjs'

import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'

import { Customer } from "@viandeendirect/api/dist/models/Customer"
import { OrderItem } from "@viandeendirect/api/dist/models/OrderItem"
import {Order} from "@viandeendirect/api/dist/models/Order"
import { Production } from "@viandeendirect/api/dist/models/Production"
import { PackageLot } from "@viandeendirect/api/dist/models/PackageLot"
import { Sale } from "@viandeendirect/api/dist/models/Sale"

import PackageSelector from '../components/PackageSelector.tsx'
import CustomerSelector from '../components/CustomerSelector.tsx'
import OrderSummary from '../components/OrderSummary.tsx'
import { ProducerService } from '../../commons/service/ProducerService.ts'
import { useLoaderData, useNavigate } from 'react-router-dom'

// TODO : corriger erreur eu retour de la création si saisie d'un nouvel utilisateur
export default function ProducerOrderForm() {

    const SET_ITEMS_STEP = 1
    const SET_CUSTOMER_STEP = 2
    const CONFIRMATION_STEP = 3

    const { keycloak } = useKeycloak()
    const navigate = useNavigate()
    const data: ProducerOrderFormData = useLoaderData()
    const productions = data.productions
    const customers = data.customers
    const sale = data.sale

    const [order, setOrder] = useState<Order>({sale: sale, customer: {}})
    const [items, setItems] = useState<Array<OrderItem>>([])
    const [activeStep, setActiveStep] = useState(SET_ITEMS_STEP)

    async function createCustomerAndOrder(customer: Customer){
        const apiBuilder = new ApiBuilder()
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        const createdCustomer = await api.createCustomer({customer: customer})
        const updatedOrder = {...order, customer: createdCustomer}
        setOrder(updatedOrder)
        await api.createOrder({order: updatedOrder})
        navigate(-1)
    }

    async function createOrder(){
        const apiBuilder = new ApiBuilder()
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        await api.createOrder({order: order})
        navigate(-1)
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
        <Button size="small" onClick={() => navigate(-1)}>Abandonner</Button>
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
            createOrder()
        }
    }
}

class ProducerOrderFormData {
    productions: Array<Production>    
    customers: Array<Customer>
    sale: Sale
}

export async function loadProducerOrderFormData(saleId: number, keycloakClient): Promise<ProducerOrderFormData> {
    const producerService = new ProducerService(keycloakClient)
    const producer = await producerService.asyncLoadProducer()
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloakClient)
    const productions = await api.getSaleProductions({saleId: saleId})
    const customers = await api.getProducerCustomers({producerId: producer.id})
    const sale = await api.getSale({saleId: saleId})
    return {productions: productions, customers: customers, sale: sale}
}
