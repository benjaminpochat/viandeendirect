import React, { useState } from "react";
import { ApiBuilder } from "../../../../api/ApiBuilder.ts";
import { ProducerService } from "../../../commons/service/ProducerService.ts";
import { Producer } from "@viandeendirect/api/dist/models/Producer.ts";
import { BeefProduction } from "@viandeendirect/api/dist/models/BeefProduction.ts";
import { Sale } from "@viandeendirect/api/dist/models/Sale.ts";
import { Box, Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, Switch, Typography } from "@mui/material";
import { AnimalTypeUtils } from "../../../../enum/AnimalTypeUtils.ts";
import dayjs from "dayjs";
import { useLoaderData, useNavigate } from "react-router-dom";

export default function PublicationBeefProductionToSale(){

    const data: PublicationBeefProductionToSaleData = useLoaderData()
    const beefProduction = data.beefProduction
    const existingSales = data.existingSales

    const [publishToNewSale, setPublishToNewSale] = useState<boolean>(true)
    const [selectedSale, setSelectedSale] = useState<Sale | undefined>(undefined)
    const [selectedSaleMissing, setSelectedSaleMissing] = useState<boolean>(false)
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const navigate = useNavigate()

    return <Stack direction='column' gap='1rem'>
            <Typography variant="h6">Mise en vente de colis de viande de boeuf</Typography>
            <Typography>{`${new AnimalTypeUtils().getLabel(beefProduction.animalType, true)} n°${beefProduction.animalIdentifier}` }</Typography>
            <Typography>{`Découpée le ${dayjs(beefProduction.slaughterDate).format('DD/MM/YYYY')}` }</Typography>
            <Stack alignItems="center" direction="row" justifyContent='center'>
                Créer une nouvelle vente 
                <Switch checked={!publishToNewSale} onChange={event => setPublishToNewSale(!event.target.checked)}/> 
                Publier pour une vente existante
            </Stack>
            {displaySaleSelection()}
            <ButtonGroup>
                <Button size='small' variant='contained' onClick={() => validatePublication()}>{getPublicationValidationLabel()}</Button>
                <Button size='small' variant='outlined' onClick={() => navigate(-1)}>Abandonner</Button>
            </ButtonGroup>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                    message="This Snackbar will be dismissed in 5 seconds."
                />
    </Stack>

    function getPublicationValidationLabel(): React.ReactNode {
        return publishToNewSale ? 'Créer une nouvelle vente' : 'Publier pour la vente sélectionnée';
    }

    function displaySaleSelection(): React.ReactNode {
        if (!publishToNewSale) {
            return <FormControl required error={selectedSaleMissing}>
                <InputLabel id="select-sale-label">Vente sélectionnée</InputLabel>
                <Select 
                    sx={{width:'20rem'}}
                    labelId="select-sale-label"
                    label="Vente sélectionnée" onChange={(event) => {
                    setSelectedSale(existingSales?.filter(sale => sale.id === event.target.value).pop())
                    setSelectedSaleMissing(false)
                    }}>
                    {existingSales?.map(sale => <MenuItem value={sale.id}>Vente du {dayjs(sale.deliveryStart).format('DD/MM/YYYY')} - {sale.deliveryAddressName}</MenuItem>)}
                </Select>
            </FormControl>
        }
        return <></>
    }

    function validatePublication() {
        if(publishToNewSale) {
            console.log('create new sale')
            setSnackbarOpen(true)
            navigate(-1)
        } else {
            if(!selectedSale) {
                setSelectedSaleMissing(true)
            } else {
                console.log(`publish to sale ${selectedSale?.id}`)
            }
            
        }
        
    }

}

class PublicationBeefProductionToSaleData {
    beefProduction: BeefProduction
    existingSales: Array<Sale>
}

export async function loadPublicationBeefProductionToSaleData(productionId: number, keycloakClient): Promise<PublicationBeefProductionToSaleData> {
    const apiBuilder = new ApiBuilder()
    const api = await apiBuilder.getAuthenticatedApi(keycloakClient)
    const producerService = new ProducerService(keycloakClient)
    const producer: Producer = await producerService.loadProducer() 
    const existingSales = await api.getProducerSales({producerId: producer.id})
    const beefProduction: BeefProduction = await api.getBeefProduction({beefProductionId: productionId})
    return {beefProduction: beefProduction, existingSales: existingSales}
}

