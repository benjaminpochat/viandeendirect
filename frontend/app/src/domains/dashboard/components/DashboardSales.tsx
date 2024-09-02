import React, { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Button, Stack, Typography } from "@mui/material"
import { Producer, Sale } from '@viandeendirect/api/dist/models'
import SaleCard from '../../sale/components/SaleCard.tsx'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { ProducerService } from '../../commons/service/ProducerService.ts'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { LocalShippingOutlined } from '@mui/icons-material'


export default function DashboardSales() {

  const {keycloak} = useKeycloak()
  const [nextSales, setNextSales] = useState<Array<Sale> | undefined>(undefined)
  const apiBuilder = new ApiBuilder()
  const navigate = useNavigate()

  useEffect(() => {
    const loadNextSale = async () => {
      const producerService = new ProducerService(keycloak)
      const producer: Producer = await producerService.loadProducer()
      const api = await apiBuilder.getAuthenticatedApi(keycloak)
      const producerSales = await api.getProducerSales({producerId: +producer.id})
      const nextSales = producerSales
        .filter(sale => sale.deliveryStart && sale.deliveryStart > new Date())
        .sort((sale1, sale2) => (sale1.deliveryStart > sale2.deliveryStart) ? 1 : -1)
      setNextSales(nextSales)
    }
    loadNextSale()
  }, [keycloak])

  function displayNextSales(): React.ReactNode {
    if (nextSales?.length > 0) {
      return <ul>{nextSales?.map(displaySale)}</ul>
    }
    return <div>Aucune vente programmée pour le moment.</div>
  }

  function displaySale(sale: Sale) {
    return <li>{dayjs(sale.deliveryStart).format('DD/MM/YYYY')} : vente {sale.deliveryAddressName}</li>
  }

  return <>
    <Stack alignItems="center" direction="row" gap={2}>
      <LocalShippingOutlined/>
      <Typography variant="subtitle1" component="span">Mes prochaines ventes</Typography>
    </Stack>
    {displayNextSales()}  
    <Button variant='contained' size='small' onClick={() => navigate('/sales')}>Gérer mes ventes</Button>
  </>
}
