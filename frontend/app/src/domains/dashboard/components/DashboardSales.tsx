import React, { useEffect, useState } from 'react'
import { Button, Typography } from "@mui/material"
import Producer from 'viandeendirect_eu/dist/model/Producer.js'
import { ApiInvoker } from '../../../api/ApiInvoker.ts'
import { useKeycloak } from '@react-keycloak/web'
import { AuthenticationService } from '../../../authentication/service/AuthenticationService.ts'


function DashboardSales() {

    return <><div>Mes prochaines ventes</div>
      <Button onClick={() => window.open('./sales', '_self')}>Gérer mes ventes</Button>
    </>
}

export default DashboardSales