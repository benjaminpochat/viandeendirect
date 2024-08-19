import React, { useEffect, useState } from 'react'
import { Button, Typography } from "@mui/material"


export default function DashboardSales() {

    return <><div>Mes prochaines ventes</div>
      <Button onClick={() => window.open('./sales', '_self')}>Gérer mes ventes</Button>
    </>
}
