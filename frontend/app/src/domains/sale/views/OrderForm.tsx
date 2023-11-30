import React from 'react'
import { useState, useEffect } from 'react'

import { Button, Stepper, Step, StepLabel, StepContent, Typography } from "@mui/material"
import dayjs from 'dayjs'

import { useKeycloak } from '@react-keycloak/web'
import { AuthenticatedApiBuilder } from '../../../api/AuthenticatedApiBuilder.js'

import OrderItem from "viandeendirect_eu/dist/model/OrderItem"
import Production from "viandeendirect_eu/dist/model/Production"
import PackageLot from "viandeendirect_eu/dist/model/PackageLot"
import PackageSelector from '../components/PackageSelector.tsx'
import CustomerSelector from '../components/CustomerSelector.tsx'

export default function OrderForm({ sale: sale, returnCallback: returnCallback }) {

    const SET_ITEMS_STEP = 1
    const SET_CUSTOMER_STEP = 2

    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    const [productions, setProductions] = useState<Array<Production>>([])
    const [items, setItems] = useState<Array<OrderItem>>([])
    const [activeStep, setActiveStep] = useState(SET_ITEMS_STEP)

    useEffect(() => {
        loadProductions()
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

    return <>
        <Typography variant='h6'>Creation d'une commande pour la vente du {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}</Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
            <Step active={activeStep === SET_ITEMS_STEP}>
                <StepLabel>Sélectionner les produits commandés</StepLabel>
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
                    <div></div>
                    <div>
                        <div>
                            <CustomerSelector callback={validateOrder}></CustomerSelector>
                        </div>
                        <Button type='submit' variant="contained" size="small" onClick={validateOrder}>Valider</Button>
                    </div>
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
        console.log(items)
    }

    function validateOrder() {
        returnCallback(sale)
    }
}
