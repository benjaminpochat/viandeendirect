import { SavingsOutlined } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import React, {  } from 'react'
import { useNavigate } from 'react-router-dom'


function DashboardPayments() {
  const navigate = useNavigate()

  //TODO: implémenter un service pour récupérer ces informations
  return <>
        <Stack alignItems="center" direction="row" gap={2}><SavingsOutlined/><Typography variant="subtitle1" component="span"> Mes derniers versements</Typography></Stack>
        <ul>
            <li>Depuis 24h : 562,30 €</li>
            <li>Depuis 1 semaine : 1230,00 € </li>
            <li>Depuis 1 mois : 1630,00 € </li>
            <li>Depuis 1 an : 3230,00 € </li>
        </ul>
    </>
}

export default DashboardPayments