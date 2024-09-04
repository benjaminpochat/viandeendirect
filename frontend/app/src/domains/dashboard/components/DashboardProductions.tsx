import React, { useEffect, useState } from 'react'
import { Button, Stack, Typography } from "@mui/material"
import { Inventory2Outlined } from "@mui/icons-material"
import {Producer} from '@viandeendirect/api/dist/models/Producer.js'
import { useKeycloak } from '@react-keycloak/web'
import { Production } from '@viandeendirect/api/dist/models/Production'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { ProductionService } from '../../production/service/ProductionService.ts'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { ProductionTypeUtils } from '../../../enum/ProductionTypeUtils.ts'


function DashboardProductions() {
  const {keycloak} = useKeycloak()
  const [nextProductions, setNextProductions] = useState<Array<Production> | undefined>(undefined)
  const apiBuilder = new ApiBuilder()
  const navigate = useNavigate()
  const productionTypeUtils = new ProductionTypeUtils()

  useEffect(() => {
    const loadNextProduction = async () => {
      const api = await apiBuilder.getAuthenticatedApi(keycloak)
      const producerProductions = await api.getProductions({})
      const productionService = new ProductionService(keycloak)
      const productionsWithEndDate = []
      for (let production of producerProductions) {
        const productionEnd = await productionService.getProductionEnd(production)
        productionsWithEndDate.push({...production, productionEnd: productionEnd})
      }
      const nextProductions = productionsWithEndDate
        .filter(production => production.productionEnd && production.productionEnd > new Date())
        .sort((production1, production2) => (production1.productionEnd > production2.productionEnd) ? 1 : -1)
      setNextProductions(nextProductions)
    }
    loadNextProduction()
  }, [keycloak])

  function displayNextProductionCard(): React.ReactNode {
    if (nextProductions?.length > 0) {
      return <ul>{nextProductions.map(displayProduction)}</ul> 
    }
    return <div>Aucune production programmée pour le moment.</div>
  }

  function displayProduction(production: Production) {
    return <li>{dayjs(production.productionEnd).format('DD/MM/YYYY')} : {productionTypeUtils.getLabel(production.productionType)}</li>
  }

  return <>
      <Stack alignItems="center" direction="row" gap={2}>
        <Inventory2Outlined/>
        <Typography variant="subtitle1" component="span">Mes prochaines productions</Typography>
      </Stack>
      {displayNextProductionCard()}
      <Button variant='contained' size='small' onClick={() => navigate('/productions')}>Gérer mes productions</Button>
    </>
}

export default DashboardProductions