import React, { useEffect, useState } from 'react'
import { Button, Typography } from "@mui/material"
import Producer from 'viandeendirect_eu/dist/model/Producer.js'
import { ApiInvoker } from '../../../api/ApiInvoker.ts'
import { useKeycloak } from '@react-keycloak/web'
import { AuthenticationService } from '../../../authentication/service/AuthenticationService.ts'
import { ProducerService } from '../../commons/service/ProducerService.ts'


function DashboardAccount() {

  const { keycloak } = useKeycloak()
  const producerService = new ProducerService(keycloak)
  const [producer, setProducer] = useState<Producer>()

  useEffect(() => {
    producerService.loadProducer(setProducer)
  }, [keycloak])


  return <>
    <div>Bienvenue {producer?.user.firstName}</div>
    <Button onClick={() => window.open('./account', '_self')}>Gérer mon compte</Button>
  </>
}

export default DashboardAccount