import React from 'react'
import { useState } from 'react'

import { Button, Typography, CircularProgress } from "@mui/material"

import { useKeycloak } from '@react-keycloak/web';
import { Producer } from '@viandeendirect/api/dist/models/Producer.js';
import { ProducerService } from '../../commons/service/ProducerService.ts';
import { ApiBuilder } from '../../../api/ApiBuilder.ts';
import { StripeAccount } from '@viandeendirect/api/dist/models/StripeAccount';
import { useLoaderData } from 'react-router-dom';
import EditableTextField from '../../commons/components/EditableTextField.tsx';


export default function ProducerAccountView() {

  const WEB_SITE_URL_FIELD = 'websiteUrl';
  const SLIDE_SHOW_URL_FIELD = 'slideShowUrl';
  const FARM_NAME_FIELD = 'farmeName';

  const {keycloak} = useKeycloak()
  const apiBuilder = new ApiBuilder()
  const loadedProducer: Producer = useLoaderData()  
  const [producer, setProducer] = useState<Producer>(loadedProducer)
  const [stripeAccountCreationPending, setStripeAccountCreationPending] = useState<boolean>(false)
  const [currentlyEditedField, setCurrentlyEditedField] = useState<string | undefined>(undefined)

  return <>
            <Typography variant="h6">Gestion du compte</Typography>
            <br/>
            <Typography variant='subtitle1'>Configuration des paiements</Typography>
            {displayStripeAccount()}

            <Typography variant='subtitle1'>Présentation de la ferme</Typography>
            
            <EditableTextField 
              label="nom de l'exploitation agricole"
              initialValue={producer.farmName}
              validateCallback={async (updatedFarmName) => {
                const updatedProducer = { ...producer, farmName: updatedFarmName };
                await updateProducer(updatedProducer)
                setProducer(updatedProducer)
              }}
              editable={currentlyEditedField === undefined || currentlyEditedField === FARM_NAME_FIELD}
              toggleCallback={() => {
                if(currentlyEditedField) {
                  setCurrentlyEditedField(undefined)
                } else {
                  setCurrentlyEditedField(FARM_NAME_FIELD)
                }
              }}
              />
            
            <br/>

            <EditableTextField 
              label='adresse du site web' 
              initialValue={producer.websiteUrl}
              validateCallback={async (updatedWebSiteUrl) => {
                const updatedProducer = { ...producer, websiteUrl: updatedWebSiteUrl };
                await updateProducer(updatedProducer)
                setProducer(updatedProducer)
              }}
              editable={currentlyEditedField === undefined || currentlyEditedField === WEB_SITE_URL_FIELD}
              toggleCallback={() => {
                if(currentlyEditedField) {
                  setCurrentlyEditedField(undefined)
                } else {
                  setCurrentlyEditedField(WEB_SITE_URL_FIELD)
                }
              }}
              />

            <br/>

            <EditableTextField 
              label='adresse du diaporama' 
              initialValue={producer.slideShowUrl}
              validateCallback={async (updatedSlideShowUrl) => {
                const updatedProducer = { ...producer, slideShowUrl: updatedSlideShowUrl };
                await updateProducer(updatedProducer)
                setProducer(updatedProducer)
              }}
              editable={currentlyEditedField === undefined || currentlyEditedField === SLIDE_SHOW_URL_FIELD}
              toggleCallback={() => {
                if(currentlyEditedField) {
                  setCurrentlyEditedField(undefined)
                } else {
                  setCurrentlyEditedField(SLIDE_SHOW_URL_FIELD)
                }
              }}
              />
          </>

  function displayStripeAccount() {
    if (producer?.stripeAccount) {
      return <>
        <div>Votre numéro de compte Stripe est {producer.stripeAccount.stripeId}</div>
        {displayStripeAccountLink()}
        </>
    } else {
      return <Button variant='outlined' size='small' disabled={stripeAccountCreationPending} onClick={createStripeAccount}>
        Créer un compte de paiement Stripe
          {displayStripeAccountCreationProgress()}
        </Button>
    }
  }

  function displayStripeAccountLink() {
    if(producer?.stripeAccount) {
      if (!producer.stripeAccount.detailsSubmitted) {
        return <Button onClick={() => window.location.href = producer.stripeAccount.accountLink}>Saisissez votre RIB et vos informations réglementaires sur Stripe</Button>
      } else {
        return <>
          <div>
          <Button size='small' variant='outlined' onClick={() => window.open('https://dashboard.stripe.com/', '_blank')}>Consultez vos encaissements sur Stripe</Button>
          </div>
          <br/>
          <div>
          <Button size='small' variant='outlined' onClick={() => window.open(producer.stripeAccount.accountLink, '_self')}>Modifiez votre RIB et vos informations réglementaires sur Stripe</Button>
          </div>
          <br/>
        </>
      }
    }
  }

  function displayStripeAccountCreationProgress() {
    if (stripeAccountCreationPending) {
      return <CircularProgress/>
    }
  }

  async function updateProducer(updatedProducer: Producer) {
    const api = await apiBuilder.getAuthenticatedApi(keycloak)
    await api.updateProducer({producerId: producer.id, producer: updatedProducer})
  }

  async function createStripeAccount() {
    setStripeAccountCreationPending(true)
    const api = await apiBuilder.getAuthenticatedApi(keycloak)
    const stripeAccount = await api.createStripeAccount({producerId: +producer.id})
    setProducer({...producer, stripeAccount: stripeAccount})
    setStripeAccountCreationPending(false)
  }
}

export async function loadProducerAccountViewData(keycloak) {
  const producerService = new ProducerService(keycloak)
  const producer: Producer = await producerService.loadProducer()
  const apiBuilder = new ApiBuilder();
  const api = await apiBuilder.getAuthenticatedApi(keycloak);
  if (producer.stripeAccount) {
    const stripeAccount: StripeAccount = await api.getStripeAccount({producerId: +producer.id})
    return {...producer, stripeAccount: stripeAccount}
  }
  return producer
}