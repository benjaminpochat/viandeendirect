import React, { MouseEvent } from 'react';
import { Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Menu, MenuItem, Typography } from "@mui/material"
import { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';
import { BeefProduction } from '@viandeendirect/api/dist/models/BeefProduction';
import { AnimalTypeUtils } from '../../../enum/AnimalTypeUtils.ts';
import { DownloadFileService } from '../../commons/service/DownloadFileService.ts';
 

export default function BeefProductionCard({
    production: production, 
    showActions: showActions,
    onClick: onClick = undefined}) {

    const navigate = useNavigate()
    const [beefProduction, setBeefProduction] = useState<BeefProduction>(production)
    const [orderPreparationMenuAnchor, setOrderPreparationMenuAnchor] = useState<HTMLElement | undefined>(undefined)
    const { keycloak } = useKeycloak()
    const apiBuilder = new ApiBuilder()
    
    useEffect(() => {
        const loadBeefProduction = async () => {
            const api = await apiBuilder.getAuthenticatedApi(keycloak)
            const loadBeefProduction = await api.getBeefProduction({beefProductionId: production.id})
            setBeefProduction(loadBeefProduction)            
        }
        loadBeefProduction()
    }, [keycloak])

    return <Card>
                <CardHeader title='Colis de viande de boeuf'
                    subheader={`${new AnimalTypeUtils().getLabel(beefProduction.animalType)} n°${beefProduction.animalIdentifier}` }/>
                <CardContent>
                    <Typography variant="subtitle1" component="div">
                        Abattage le {dayjs(beefProduction.slaughterDate).format('DD/MM/YYYY')}
                    </Typography>
                    <Typography component="div">
                        Poids de carcasse chaude estimé : {beefProduction.warmCarcassWeight} kg
                    </Typography>
                </CardContent>
                {getActions()}
                {getOrderPreparationMenu()}
            </Card>

    function getActions() {
        if (showActions) {
            return <CardActions>
                <ButtonGroup>
                    <Button variant='outlined' size="small" onClick={() => navigate(`/beefProduction/${production.id}`)}>Voir le détail</Button>
                    <Button variant='outlined' size="small" onClick={() => navigate(`/beefProduction/${production.id}/publicationToSale`)}>Mettre en vente</Button>
                    <Button size="small" onClick={openOrderPreparationMenu}>Préparer les colis</Button>
                </ButtonGroup>
            </CardActions>
        }
    }

    function getOrderPreparationMenu(): React.ReactNode {
        return <Menu
            id={`package-preparation-menu-${beefProduction.id}`}
            anchorEl={orderPreparationMenuAnchor}
            open={Boolean(orderPreparationMenuAnchor)}
            onClose={closeOrderPreparationMenu}>
            <MenuItem onClick={downloadLabels}>Imprimer les étiquettes</MenuItem>
        </Menu>
    }

    function openOrderPreparationMenu(event: MouseEvent<HTMLElement>): void {
        setOrderPreparationMenuAnchor(event.currentTarget)
    }

    function closeOrderPreparationMenu(): void {
        setOrderPreparationMenuAnchor(undefined)
    }

    async function downloadLabels(): Promise<void> {
        const api = await apiBuilder.getAuthenticatedApi(keycloak)
        const pdfByteArray = await api.getBeefProductionPackageElementsLabels({beefProductionId: production.id})
        DownloadFileService.produceDownloadPdfFile(pdfByteArray, 'etiquettes_colis.pdf')
        closeOrderPreparationMenu()
    }
}
