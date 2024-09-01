import React, { useEffect, useState } from 'react'
import { Button, Typography } from "@mui/material"
import { Producer } from '@viandeendirect/api/dist/models/Producer.js'
import { useKeycloak } from '@react-keycloak/web'
import { ProducerService } from '../../commons/service/ProducerService.ts'
import { useNavigate } from 'react-router-dom'


function DashboardAccount() {

  const { keycloak } = useKeycloak()
  const producerService = new ProducerService(keycloak)
  const [producer, setProducer] = useState<Producer>()
  const navigate = useNavigate()

  useEffect(() => {
    producerService.loadProducer().then(loadedProducer => setProducer(loadedProducer))
  }, [keycloak])


  return <>
    <div>Bienvenue {producer?.user.firstName}</div>
    <Button onClick={() => navigate('/account')}>Gérer mon compte</Button>
  </>
}

export default DashboardAccount