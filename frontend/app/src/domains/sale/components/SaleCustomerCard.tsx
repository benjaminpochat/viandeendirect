import React from 'react'
import { Button, Card, CardActions, CardContent } from '@mui/material'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';

import ProductionCustomerCard from '../../production/components/ProductionCustomerCard.tsx';
import { Production } from '@viandeendirect/api/dist/models/Production';

import './SaleCustomerCard.css'


export default function SaleCustomerCard({ sale: sale }) {

    const navigate = useNavigate()

    return <Card className="sale-customer-card">
        <CardContent>
            <div className="sale-customer-card__title">
                <div>Vente du {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}</div>
            </div>
            <div className="sale-customer-card__delivery-information">
                <div className="sale-customer-card__date">
                    <i className="icon time-icon"></i>
                    <span>
                        Livré entre {dayjs(sale.deliveryStart).format('HH:mm')} et {dayjs(sale.deliveryStop).format('HH:mm')}
                    </span>
                </div>
                <div className="sale-customer-card__address">
                    <i className="icon placeholder-icon"></i>
                    <span>
                        <div>{sale.deliveryAddressLine1}</div>
                        <div>{sale.deliveryAddressLine2}</div>
                        <div>{sale.deliveryZipCode} - {sale.deliveryCity}</div>
                    </span>
                </div>
            </div>
            {sale.productions.map(getProductionContent)}
        </CardContent>
        <CardActions>
            <Button onClick={() => navigate('/order/creation')}>Je commande</Button>
            <Button>Je visite la ferme</Button>
        </CardActions>
    </Card>

    function getProductionContent(production: Production) {
        return <ProductionCustomerCard production={production}></ProductionCustomerCard>
    }
}