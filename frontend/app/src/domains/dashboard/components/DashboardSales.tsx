import React, { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { Button } from "@mui/material"
import { Producer, Sale } from '@viandeendirect/api/dist/models'
import SaleCard from '../../sale/components/SaleCard.tsx'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { ProducerService } from '../../commons/service/ProducerService.ts'
import { useNavigate } from 'react-router-dom'


export default function DashboardSales() {

  const {keycloak} = useKeycloak()
  const [nextSale, setNextSale] = useState<Sale | undefined>(undefined)
  const apiBuilder = new ApiBuilder()
  const navigate = useNavigate()

  useEffect(() => {
    const loadNextSale = async () => {
      const producerService = new ProducerService(keycloak)
      const producer: Producer = await producerService.loadProducer()
      const api = await apiBuilder.getAuthenticatedApi(keycloak)
      const producerSales = await api.getProducerSales({producerId: +producer.id})
      const nextSale = producerSales
        .filter(sale => sale.deliveryStart && sale.deliveryStart > new Date())
        .sort((sale1, sale2) => (sale1.deliveryStart > sale2.deliveryStart) ? 1 : -1)[0]
      setNextSale(nextSale)
    }
    loadNextSale()
  }, [keycloak])

  function displayNextSaleCard(): React.ReactNode {
    if (nextSale) {
      return <SaleCard sale={nextSale}/>
    }
    return <div>Aucune vente programmée pour le moment.</div>
  }

  return <><div>Ma prochaine vente</div>
  <div className='card-list'>
    {displayNextSaleCard()}
  </div>
    <Button onClick={() => navigate('/sales')}>Gérer mes ventes</Button>
  </>
}
