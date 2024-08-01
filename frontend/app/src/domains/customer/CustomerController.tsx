import { useEffect, useState } from 'react'
import CustomersList from './views/CustomersList.tsx'
import React from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { ProducerService } from '../commons/service/ProducerService.ts'
import Producer from 'viandeendirect_eu/dist/model/Producer.js'
import AuthenticatedLayout from '../../layouts/producer/AuthenticatedLayout.tsx'

export default function CustomerController() {

    const { keycloak } = useKeycloak()
    const producerService = new ProducerService(keycloak)
    const [producer, setProducer] = useState<Producer>()

    const NONE = 'NONE'
    
    const [currentAction, setCurrentAction] = useState(NONE)

    useEffect(() => {
        producerService.loadProducer(setProducer)
    })

    return <AuthenticatedLayout>{getContent()}</AuthenticatedLayout>

    function getContent() {
        if(producer) {
            switch (currentAction) {
                case 'NONE': return <CustomersList producer={producer}/>
            }
        }
    }
}
