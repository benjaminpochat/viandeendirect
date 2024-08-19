import React, { useEffect, useState } from 'react'
import { Button, Typography } from "@mui/material"
import { Producer } from '@viandeendirect/api/dist/models/Producer.js'
import { useKeycloak } from '@react-keycloak/web'
import { ProducerService } from '../../commons/service/ProducerService.ts'


function DashboardAccount() {

  const { keycloak } = useKeycloak()
  const producerService = new ProducerService(keycloak)
  const [producer, setProducer] = useState<Producer>()

  useEffect(() => {
    producerService.loadProducer().then(loadedProducer => setProducer(loadedProducer))
  }, [keycloak])


  return <>
    <div>Bienvenue {producer?.user.firstName}</div>
    <Button onClick={() => window.open('./account', '_self')}>Gérer mon compte</Button>
  </>
}

export default DashboardAccount