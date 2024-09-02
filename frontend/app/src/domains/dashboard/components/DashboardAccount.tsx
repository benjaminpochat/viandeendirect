import React, { useEffect, useState } from 'react'
import { Button, Stack, Typography } from "@mui/material"
import { Producer } from '@viandeendirect/api/dist/models/Producer.js'
import { useKeycloak } from '@react-keycloak/web'
import { ProducerService } from '../../commons/service/ProducerService.ts'
import { useNavigate } from 'react-router-dom'
import { PersonOutlineOutlined } from '@mui/icons-material'


function DashboardAccount() {

  const { keycloak } = useKeycloak()
  const producerService = new ProducerService(keycloak)
  const [producer, setProducer] = useState<Producer>()
  const navigate = useNavigate()

  useEffect(() => {
    producerService.loadProducer().then(loadedProducer => setProducer(loadedProducer))
  }, [keycloak])


  return <>
    <Stack alignItems="center" direction="row" gap={2}>
      <PersonOutlineOutlined/>
      <Typography variant="subtitle1" component="span">Bienvenue {producer?.user.firstName}</Typography>
    </Stack>
    <Button size='small' onClick={() => navigate('/account')}>Gérer mon compte</Button>
  </>
}

export default DashboardAccount