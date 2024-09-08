import React from 'react'
import { useState } from 'react'

import { Button, Typography, CircularProgress, Stack, TextField, InputAdornment } from "@mui/material"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';

import { useKeycloak } from '@react-keycloak/web';
import { Producer } from '@viandeendirect/api/dist/models/Producer.js';
import { ProducerService } from '../../commons/service/ProducerService.ts';
import { ApiBuilder } from '../../../api/ApiBuilder.ts';
import { StripeAccount } from '@viandeendirect/api/dist/models/StripeAccount';
import { useLoaderData } from 'react-router-dom';
import { CheckOutlined } from '@mui/icons-material';
import EditableTextField from '../../commons/components/EditableTextField.tsx';


export default function ProducerAccountView() {

  const {keycloak} = useKeycloak()
  const apiBuilder = new ApiBuilder()
  const loadedProducer: Producer = useLoaderData()  
  const [producer, setProducer] = useState<Producer>(loadedProducer)
  const [stripeAccountCreationPending, setStripeAccountCreationPending] = useState<boolean>(false)
  const [websiteUrlWritable, setWebsiteUrlWritable] = useState<boolean>(false)
  const [currentlyEditedField, setCurrentlyEditedField] = useState<string | undefined>(undefined)

  return <>
            <Typography variant="h6">Gestion du compte</Typography>
            <Typography variant='subtitle1'>Configuration des paiements</Typography>
            {displayStripeAccount()}

            <Typography variant='subtitle1'>Présentation de la ferme</Typography>
            
            <EditableTextField 
              label='adresse du site web' 
              initialValue={producer.websiteUrl}
              validateCallback={() => console.log('test')}
              editable={currentlyEditedField === undefined || currentlyEditedField === 'websiteUrl'}
              toggleCallback={() => {
                if(currentlyEditedField) {
                  setCurrentlyEditedField(undefined)
                } else {
                  setCurrentlyEditedField('websiteUrl')
                }
              }}
              />

            <EditableTextField 
              label='adresse du diaporama' 
              initialValue={producer.slideShowUrl}
              validateCallback={() => console.log('test')}
              editable={currentlyEditedField === undefined || currentlyEditedField === 'slideShowUrl'}
              toggleCallback={() => {
                if(currentlyEditedField) {
                  setCurrentlyEditedField(undefined)
                } else {
                  setCurrentlyEditedField('slideShowUrl')
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
      return <Button disabled={stripeAccountCreationPending} onClick={createStripeAccount}>
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
          <Button onClick={() => window.open('https://dashboard.stripe.com/', '_blank')}>Consultez vos encaissements sur Stripe</Button>
          <Button onClick={() => window.open(producer.stripeAccount.accountLink, '_self')}>Modifier votre RIB et vos informations réglementaires sur Stripe</Button>
        </>
      }
    }
  }

  function displayStripeAccountCreationProgress() {
    if (stripeAccountCreationPending) {
      return <CircularProgress/>
    }
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