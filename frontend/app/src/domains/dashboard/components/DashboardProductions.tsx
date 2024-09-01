import React, { useEffect, useState } from 'react'
import { Button, Typography } from "@mui/material"
import {Producer} from '@viandeendirect/api/dist/models/Producer.js'
import { useKeycloak } from '@react-keycloak/web'
import { Production } from '@viandeendirect/api/dist/models/Production'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { ProducerService } from '../../commons/service/ProducerService.ts'
import ProductionCard from '../../production/components/ProductionCard.tsx'
import { ProductionService } from '../../production/service/ProductionService.ts'
import { useNavigate } from 'react-router-dom'


function DashboardProductions() {
  const {keycloak} = useKeycloak()
  const [nextProduction, setNextProduction] = useState<Production | undefined>(undefined)
  const apiBuilder = new ApiBuilder()
  const navigate = useNavigate()

  useEffect(() => {
    const loadNextProduction = async () => {
      const producerService = new ProducerService(keycloak)
      const producer: Producer = await producerService.loadProducer()
      const api = await apiBuilder.getAuthenticatedApi(keycloak)
      const producerProductions = await api.getProductions({})
      const productionService = new ProductionService(keycloak)
      const productionsWithEndDate = []
      for (let production of producerProductions) {
        const productionEnd = await productionService.getProductionEnd(production)
        productionsWithEndDate.push({...production, productionEnd: productionEnd})
      }
      const nextProduction = productionsWithEndDate
        .filter(production => production.productionEnd && production.productionEnd > new Date())
        .sort((production1, production2) => (production1.productionEnd > production2.productionEnd) ? 1 : -1)[0]
      setNextProduction(nextProduction)
    }
    loadNextProduction()
  }, [keycloak])

  function displayNextProductionCard(): React.ReactNode {
    if (nextProduction) {
      return <ProductionCard production={nextProduction}
                showActions={true} 
                onClick={undefined} /> 
    }
    return <div>Aucune production programmée pour le moment.</div>
  }
    return <><div>Ma prochaine production</div>
      {displayNextProductionCard()}
      <Button onClick={() => navigate('/productions')}>Gérer mes productions</Button>
    </>
}

export default DashboardProductions