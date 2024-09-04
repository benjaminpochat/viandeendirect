import React, { useEffect, useState } from 'react'
import { SavingsOutlined } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'
import { PaymentsSummary, Producer } from '@viandeendirect/api/dist/models'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { ProducerService } from '../../commons/service/ProducerService.ts'


function DashboardPayments() {
    const { keycloak } = useKeycloak()
    const [paymentSummary, setPaymentSummary] = useState<PaymentsSummary | undefined>(undefined)
    const apiBuilder = new ApiBuilder()

    useEffect(() => {
        const loadPaymentsSumary = async () => {
            const producerService = new ProducerService(keycloak)
            const producer: Producer = await producerService.loadProducer()
            const api = await apiBuilder.getAuthenticatedApi(keycloak)
            const paymentsSummary = await api.getProducerPaymentsSummary({producerId: +producer.id})
            setPaymentSummary(paymentsSummary)
        }
        loadPaymentsSumary()
    }, [keycloak])

    return <>
        <Stack alignItems="center" direction="row" gap={2}><SavingsOutlined /><Typography variant="subtitle1" component="span"> Mes derniers versements</Typography></Stack>
        <ul>
            <li>Depuis 24h : {paymentSummary?.daylyTotal} €</li>
            <li>Depuis 1 semaine : {paymentSummary?.weeklyTotal} € </li>
            <li>Depuis 1 mois : {paymentSummary?.monthlyTotal} € </li>
            <li>Depuis 1 an : {paymentSummary?.yearlyTotal} € </li>
        </ul>
    </>
}

export default DashboardPayments