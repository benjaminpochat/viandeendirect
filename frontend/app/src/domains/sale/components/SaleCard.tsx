import { Button, ButtonGroup, Card, CardActions, CardContent, Typography } from "@mui/material"
import dayjs from 'dayjs'
import SaleCardBeefProduction from './SaleCardBeefProduction.js';

export default function SaleCard({ sale: sale, manageOrdersCallback: manageOrdersCallback}) {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Vente du {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}
                </Typography>
                <div className='sale-card-line-1'>
                    <div>
                        <Typography color="text.secondary">
                            Livraison
                        </Typography>
                        <Typography>
                            <div>{sale.deliveryAddressLine1}</div>
                            <div>{sale.deliveryAddressLine2}</div>
                            <div>{sale.deliveryZipCode} - {sale.deliveryCity}</div>
                            <div>entre {dayjs(sale.deliveryStart).format('HH:mm')} et {dayjs(sale.deliveryStop).format('HH:mm')}</div>
                        </Typography>
                    </div>
                    <div>
                        <Typography color="text.secondary">
                            Commandes
                        </Typography>
                        <Typography>
                            {sale.orders.length} commandes client
                        </Typography>
                        <Typography>
                            {getQuantitySold()} kg commandés
                        </Typography>
                        <Typography>
                            {getAmountSold()} €<sup>TTC</sup> commandés
                        </Typography>
                    </div>
                </div>
                <div className='sale-card-line-2'>
                    <div>
                        <Typography color="text.secondary">
                            Productions mises en vente
                        </Typography>
                        {sale.productions.map(getProduction)}
                    </div>
                </div>
            </CardContent>
            <CardActions>
                <ButtonGroup>
                    <Button size="small">Publier la vente</Button>
                    <Button size="small" onClick={() => manageOrdersCallback(sale)}>Gérer les commandes</Button>
                    <Button size="small">Préparer la livraison</Button>
                </ButtonGroup>
            </CardActions>
        </Card>
    )

    function getProduction(production) {
        switch (production.productionType) {
            case 'BeefProduction':
                return <SaleCardBeefProduction production={production}/>
            default:
                return <></>

        }
    }

    function getQuantitySold() {
        return sale.orders
            .flatMap(order => order.items)
            .map(item => item.packageLot.netWeight * item.quantity)
            .reduce((totalQuantity, orderItemQuantity) => totalQuantity + orderItemQuantity)
    }

    function getAmountSold() {
        return sale.orders
            .flatMap(order => order.items)
            .map(item => item.unitPrice * item.quantity)
            .reduce((totalAmout, orderItemAmout) => totalAmout + orderItemAmout)
    }
}
