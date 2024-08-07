import React from 'react'
import { useState, useEffect } from 'react'

import SalesList from './views/SalesList.tsx'
import SaleForm from './views/SaleForm.tsx'
import OrdersList from './views/OrdersList.tsx'
import Sale from '@viandeendirect/api/dist/models/Sale'
import Order from '@viandeendirect/api/dist/models/Order'
import OrderView from './views/OrderView.tsx'
import ProducerOrderForm from './views/ProducerOrderForm.tsx'
import AuthenticatedLayout from '../../layouts/producer/AuthenticatedLayout.tsx'
import { useKeycloak } from '@react-keycloak/web'
import { ProducerService } from '../commons/service/ProducerService.ts'
import Producer from '@viandeendirect/api/dist/models/Producer.js'

export default function SaleController() {

    const { keycloak, initialized } = useKeycloak()
    const producerService = new ProducerService(keycloak)
    const [producer, setProducer] = useState<Producer>()
    
    const SALES_LIST_VIEW = 'SALES_LIST_VIEW'
    const SALE_CREATION_VIEW = 'SALE_CREATION_VIEW'
    const ORDERS_LIST_VIEW = 'ORDERS_LIST_VEW'
    const ORDER_VIEW = 'ORDER_VIEW'
    const ORDER_CREATION_VIEW = 'ORDER_CREATION_VIEW'

    const [currentView, setCurrentView] = useState(SALES_LIST_VIEW)
    const [context, setContext] = useState(undefined)

    useEffect(() => {
        producerService.loadProducer(setProducer)
    })

    return <>{getCurrentView()}</>

    function getCurrentView() {
        if(producer) {
            switch (currentView) {
                case SALES_LIST_VIEW: return <SalesList producer={producer} createSaleCallback={displaySaleCreationForm} manageSaleOrdersCallback={displayOrdersList}/>
                case SALE_CREATION_VIEW: return <SaleForm producer={producer} returnCallback={displaySalesList}></SaleForm>
                case ORDERS_LIST_VIEW: return <OrdersList sale={context} returnCallback={displaySalesList} viewOrderCallback={displayOrder} createOrderCallback={() => createOrder(context)}/>
                case ORDER_VIEW: return <OrderView order={context.order} sale={context.sale} returnCallback={displayOrdersList}/>
                case ORDER_CREATION_VIEW: return <ProducerOrderForm producer={producer} sale={context} returnCallback={displayOrdersList}/>
            }
        }
    }

    function displayOrdersList(sale: Sale) {
        setContext(sale)
        setCurrentView(ORDERS_LIST_VIEW)
    }

    function displaySaleCreationForm() {
        setContext(undefined)
        setCurrentView(SALE_CREATION_VIEW)
    }

    function displaySalesList() {
        setContext(undefined)
        setCurrentView(SALES_LIST_VIEW)
    }

    function displayOrder(order: Order, sale: Sale) {
        const orderContext = {
            order: order,
            sale: sale
        }
        setContext(orderContext)
        setCurrentView(ORDER_VIEW)
    }

    function createOrder(sale: Sale) {
        setContext(sale)
        setCurrentView(ORDER_CREATION_VIEW)
    }
}
