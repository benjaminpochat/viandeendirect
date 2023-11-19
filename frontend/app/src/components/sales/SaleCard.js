import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web'
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import { AuthenticatedApiBuilder } from '../security/AuthenticatedApiBuilder'
import dayjs from 'dayjs'

export default function SaleCard({sale: rawSale}) {

    const [sale, setSale] = useState(rawSale)
    const { keycloak, initialized } = useKeycloak()
    const authenticatedApiBuilder = new AuthenticatedApiBuilder()

    return (
        <Card>
            <CardContent>
                <Typography color="text.secondary" gutterBottom>
                    Vente du {dayjs(sale.deliverieStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}
                </Typography>
            </CardContent>
        </Card>
    )
}
