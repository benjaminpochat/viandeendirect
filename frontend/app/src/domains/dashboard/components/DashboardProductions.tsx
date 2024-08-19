import React, { useEffect, useState } from 'react'
import { Button, Typography } from "@mui/material"
import Producer from '@viandeendirect/api/dist/models/Producer.js'
import { useKeycloak } from '@react-keycloak/web'
import { AuthenticationService } from '../../../authentication/service/AuthenticationService.ts'


function DashboardProductions() {

    return <><div>Mes prochaines productions</div>
      <Button onClick={() => window.open('./productions', '_self')}>Gérer mes productions</Button>
    </>
}

export default DashboardProductions