import React, { useEffect, useState } from 'react'
import { SavingsOutlined } from '@mui/icons-material'
import { CircularProgress, Stack, Typography } from '@mui/material'
import { useKeycloak } from '@react-keycloak/web'
import { PaymentsSummary, Producer } from '@viandeendirect/api/dist/models'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { ProducerService } from '../../commons/service/ProducerService.ts'


function DashboardPayments() {
    const { keycloak } = useKeycloak()
    const [paymentsSummary, setPaymentSummary] = useState<PaymentsSummary | undefined>(undefined)
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

    function getContent() {
        if (!paymentsSummary) {
            return <CircularProgress/>
        } 
        return <ul>
                <li>Depuis 24h : {paymentsSummary?.daylyTotal} €</li>
                <li>Depuis 1 semaine : {paymentsSummary?.weeklyTotal} € </li>
                <li>Depuis 1 mois : {paymentsSummary?.monthlyTotal} € </li>
                <li>Depuis 1 an : {paymentsSummary?.yearlyTotal} € </li>
            </ul>
    }

    return <>
        <Stack alignItems="center" direction="row" gap={2}><SavingsOutlined /><Typography variant="subtitle1" component="span"> Mes derniers paiements</Typography></Stack>
        {getContent()}
    </>
}

export default DashboardPayments