import React from 'react'
import { useState } from 'react'

import { Button, Typography, CircularProgress } from "@mui/material"

import { useKeycloak } from '@react-keycloak/web';
import { Producer } from '@viandeendirect/api/dist/models/Producer.js';
import { ProducerService } from '../../commons/service/ProducerService.ts';
import { ApiBuilder } from '../../../api/ApiBuilder.ts';
import { StripeAccount } from '@viandeendirect/api/dist/models/StripeAccount';
import { useLoaderData } from 'react-router-dom';


export default function ProducerAccountView() {

  const {keycloak} = useKeycloak()
  const apiBuilder = new ApiBuilder()
  const loadedProducer: Producer = useLoaderData()  
  const [producer, setProducer] = useState<Producer>(loadedProducer)
  const [stripeAccountCreationPending, setStripeAccountCreationPending] = useState<boolean>(false)

  return <>
            <Typography variant="h6">Gestion du compte</Typography>
            {displayStripeAccount()}
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
  const producer: Producer = await producerService.asyncLoadProducer()
  const apiBuilder = new ApiBuilder();
  const api = await apiBuilder.getAuthenticatedApi(keycloak);
  if (producer.stripeAccount) {
    const stripeAccount: StripeAccount = await api.getStripeAccount({producerId: +producer.id})
    return {...producer, stripeAccount: stripeAccount}
  }
  return producer
}