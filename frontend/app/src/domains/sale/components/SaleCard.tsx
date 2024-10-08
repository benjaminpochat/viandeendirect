import React, { useEffect, useState, MouseEvent } from 'react'

import { Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Chip, Typography, Stack, Menu, MenuItem } from "@mui/material"
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import dayjs from 'dayjs'
import SaleCardBeefProduction from './SaleCardBeefProduction.tsx';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import { ApiBuilder } from '../../../api/ApiBuilder.ts';
import { Order } from '@viandeendirect/api/dist/models/Order'
import { Production } from '@viandeendirect/api/dist/models/Production'
import { ProducerService } from '../../commons/service/ProducerService.ts';
import { useSnackbar } from '../../commons/components/SnackbarProvider.tsx'
import { Sale } from '@viandeendirect/api/dist/models/Sale';
import { DownloadFileService } from '../../commons/service/DownloadFileService.ts';


export default function SaleCard({sale: sale}) {

    const {keycloak} = useKeycloak()
    const navigate = useNavigate()
    const apiBuilder = new ApiBuilder()
    const showSnackbar = useSnackbar()

    const [orders, setOrders] = useState<Array<Order>>([])
    const [productions, setProductions] = useState<Array<Production>>([])
    const [currentSale, setCurrentSale] = useState<Sale>(sale)
    const [salePreparationMenuAnchor, setSalePreparationMenuAnchor] = useState<HTMLElement | undefined>(undefined)


    useEffect(() => {
        const loadData = async () => {
            const api = await apiBuilder.getAuthenticatedApi(keycloak)
            const loadedOrders = await api.getSaleOrders({saleId: +currentSale.id})
            setOrders(loadedOrders)
            const loadedProductions = await api.getSaleProductions({saleId: +currentSale.id})
            setProductions(loadedProductions)
        }
        loadData()
    }, [keycloak])

    return (
        <Card>
            <CardHeader 
                title={<Stack alignItems="center" direction="row" gap={2} justifyContent='space-between'>
                    <div>{`Vente du ${dayjs(currentSale.deliveryStart).format('DD/MM/YYYY')}`}</div>
                    {getChips()}
                    </Stack>
                } 
                subheader={currentSale.deliveryAddressName}>
            </CardHeader>
            <CardContent>
                <div className='sale-card-line-1'>
                    <div>
                        <Typography color="text.secondary">
                            Livraison
                        </Typography>
                        <Typography>
                            <div>{currentSale.deliveryAddressLine1}</div>
                            <div>{currentSale.deliveryAddressLine2}</div>
                            <div>{currentSale.deliveryZipCode} - {currentSale.deliveryCity}</div>
                            <div>entre {dayjs(currentSale.deliveryStart).format('HH:mm')} et {dayjs(currentSale.deliveryStop).format('HH:mm')}</div>
                        </Typography>
                    </div>
                    <div>
                        <Typography color="text.secondary">
                            Commandes
                        </Typography>
                        <Typography>
                            {orders.length} commandes client
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
                        {productions.map(getProduction)}
                    </div>
                </div>
            </CardContent>
            <CardActions>
                <ButtonGroup>
                    {getPublicationButton()}                    
                    <Button size="small" onClick={() => navigate(`/sale/${currentSale.id}/orders`)}>Voir les commandes</Button>
                    <Button size="small" onClick={openSalePreparationMenu}>Préparer la vente</Button>
                </ButtonGroup>
            </CardActions>
            {getSalePreparationMenu()}
        </Card>
    )

    function getProduction(production) {
        switch (production.productionType) {
            case 'BeefProduction':
                return <SaleCardBeefProduction key={`beef-production-card-${production.id}`} production={production}/>
            default:
                return <></>
        }
    }

    function getQuantitySold() {
        return orders
            .flatMap(order => order.items)
            .map(item => item.packageLot.netWeight * item.quantity)
            .reduce((totalQuantity, orderItemQuantity) => totalQuantity + orderItemQuantity, 0)
    }

    function getAmountSold() {
        return orders
            .flatMap(order => order.items)
            .map(item => item.unitPrice * item.quantity)
            .reduce((totalAmout, orderItemAmout) => totalAmout + orderItemAmout, 0)
    }

    function getChips() {
        let publishStatutChip = <></>
        if (currentSale.publishedToCustomers) {
            publishStatutChip = <Chip icon={<VisibilityIcon/>} size='small' color='success' label="publié"/>
        } else {
            publishStatutChip = <Chip icon={<VisibilityOffIcon/>} size='small' color='warning' label='non publié'/>
        }
        let privateAccessChip = <></>
        if (currentSale.privateAccessKey) {
            privateAccessChip = <Chip icon={<LockIcon/>} size='small' color='warning' label={(`${currentSale.privateAccessKey}`)}/>
        }
        return <Stack direction='column' alignItems='flex-end' gap='0.2rem'>{publishStatutChip}{privateAccessChip}</Stack>
    }

    function getPublicationButton(): React.ReactNode {
        if (currentSale.publishedToCustomers) {
            return <Button size="small" onClick={() => setPublishedToCustomers(false)}>Retirer la vente</Button>
        }
        return <Button size="small" onClick={() => setPublishedToCustomers(true)}>Publier la vente</Button>
    }

    async function setPublishedToCustomers(published: boolean): Promise<void> {
        const producerService = new ProducerService(keycloak)
        const producer = await producerService.loadProducer()
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        try {
            await api.setSalePublishedToCustomers({saleId: currentSale.id, producerId: +producer.id, publishedToCustomers: published})
            setCurrentSale({...currentSale, publishedToCustomers: published})
            if (published) {
                showSnackbar(`La vente livrée le ${dayjs(currentSale.deliveryStart).format('DD/MM/YYYY')} - ${currentSale.deliveryAddressName} a été publiée sur l'espace client`, 'success');
            } else {
                showSnackbar(`La vente livrée le ${dayjs(currentSale.deliveryStart).format('DD/MM/YYYY')} - ${currentSale.deliveryAddressName} a été retirée de l'espace client`, 'success');
            }
        } catch {
            showSnackbar(`Oops... une erreur s'est produite`, 'error');
        }
    }

    function getSalePreparationMenu(): React.ReactNode {
        return <Menu
            id={`sale-preparation-menu-${currentSale.id}`}
            anchorEl={salePreparationMenuAnchor}
            open={Boolean(salePreparationMenuAnchor)}
            onClose={closeSalePreparationMenu}>
            <MenuItem onClick={downloadOrdersSummaries}>Imprimer les récapitulatifs des commandes</MenuItem>
            <MenuItem onClick={downloadOrdersInvoices}>Imprimer les factures</MenuItem>
        </Menu>
    }

    function openSalePreparationMenu(event: MouseEvent<HTMLElement>): void {
        setSalePreparationMenuAnchor(event.currentTarget)
    }

    function closeSalePreparationMenu(): void {
        setSalePreparationMenuAnchor(undefined)
    }

    async function downloadOrdersSummaries(): Promise<void> {
        const api = await apiBuilder.getAuthenticatedApi(keycloak);
        const pdfByteArray = await api.getSaleOrdersSummaries({saleId: currentSale.id})
        DownloadFileService.produceDownloadPdfFile(pdfByteArray, 'recapitulatifs_commandes.pdf');
        closeSalePreparationMenu()
    }

    async function downloadOrdersInvoices(): Promise<void> {
        const api = await apiBuilder.getAuthenticatedApi(keycloak);
        const pdfByteArray = await api.getSaleOrdersInvoices({saleId: currentSale.id})
        DownloadFileService.produceDownloadPdfFile(pdfByteArray, 'factures_commandes.pdf');
        closeSalePreparationMenu()
    }
}
