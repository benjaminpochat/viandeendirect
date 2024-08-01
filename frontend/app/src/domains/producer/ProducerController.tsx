import React from 'react'
import { useState, useEffect } from 'react'

import { Button, Link, Typography, CircularProgress } from "@mui/material"

import { ApiInvoker } from '../../api/ApiInvoker.ts';
import { useKeycloak } from '@react-keycloak/web';
import Producer from 'viandeendirect_eu/dist/model/Producer.js';
import { AuthenticationService } from '../../authentication/service/AuthenticationService.ts';
import AuthenticatedLayout from '../../layouts/producer/AuthenticatedLayout.tsx';
import { ProducerService } from '../commons/service/ProducerService.ts';


function ProducerController() {

  const apiInvoker = new ApiInvoker()
  const {keycloak} = useKeycloak()
  const producerService = new ProducerService(keycloak)
  const authenticationService = new AuthenticationService(keycloak)
  const [producer, setProducer] = useState<Producer>()
  const [stripeAccountCreationPending, setStripeAccountCreationPending] = useState<boolean>(false)

  useEffect(() => {
    producerService.loadProducer(producer => {
      setProducer(producer)
      if(producer.stripeAccount) {
        loadStripeAccount(producer.id)
      }
    })
  })

  return <AuthenticatedLayout>
            <Typography variant="h6">Gestion du compte</Typography>
            {displayStripeAccount()}
          </AuthenticatedLayout>
  
  function loadStripeAccount(producerId: number) {
    apiInvoker.callApiAuthenticatedly(
      keycloak,
      api => api.getStripeAccount,
      producerId,
      stripeAccount => setProducer({...producer, stripeAccount: stripeAccount}),
      console.error
    )
  }

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

  function createStripeAccount() {
    setStripeAccountCreationPending(true)
    apiInvoker.callApiAuthenticatedly(
      keycloak, 
      api => api.createStripeAccount, 
      producer?.id, 
      stripeAccount => {
        setProducer({...producer, stripeAccount: stripeAccount})
        setStripeAccountCreationPending(false)
        loadStripeAccount(producer.id)
      }, 
      console.error)
  }

/*
    const [accountCreatePending, setAccountCreatePending] = useState(false);
    const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
    const [stripeAccountId, setStripeAccountId] = useState();
    const [stripeError, setStripeError] = useState();

    return <>
        <Typography variant="h6">Gestion du compte</Typography>
        {!stripeAccountId && <h2>Get ready for take off</h2>}
        {!stripeAccountId && <p>viandeendirect.eu is the world's leading air travel platform: join our team of pilots to help people travel faster.</p>}
        {stripeAccountId && <h2>Add information to start accepting money</h2>}
        {stripeAccountId && <p>Matt's Mats partners with Stripe to help you receive payments and keep your personal bank and details secure.</p>}
        {!accountCreatePending && !stripeAccountId && (
          <Button onClick={createStripeAccount}>Créer un compte de paiement Stripe</Button>
        )}
        {stripeAccountId && !accountLinkCreatePending && (
          <Button onClick={finalizeStripeAccount}>Ajouter des informations pour finaliser la création de votre compte de paiement Stripe</Button>
        )}
        {stripeError && <p className="error">Something went wrong!</p>}
        {(stripeAccountId || accountCreatePending || accountLinkCreatePending) && (
          <div className="dev-callout">
            {stripeAccountId && <p>Your connected account ID is: <code className="bold">{stripeAccountId}</code></p>}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
          </div>
        )}
    </>

    async function createStripeAccount() {
        setAccountCreatePending(true);
        setStripeError(false);
        const apiBuilder = new ApiBuilder()
        const backendUrl = await apiBuilder.getBackendUrl()
        fetch(backendUrl + "/payments/stripe/account", {
            method: "POST",
        })
        .then((response) => response.json())
        .then((json) => {
          setAccountCreatePending(false);
          const {account, error} = json
          if (account) {
            setStripeAccountId(account.accountId)
          }
          if (error) {
            setStripeError(true)
          }
        })
    }

    async function finalizeStripeAccount() {
        setAccountLinkCreatePending(true);
        setStripeError(false);
        const apiBuilder = new ApiBuilder()
        const backendUrl = await apiBuilder.getBackendUrl()
        fetch(backendUrl + "/payments/stripe/accountLink", {
          method: "POST",
          body: JSON.stringify({accountId: stripeAccountId}),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((json) => {
            setAccountLinkCreatePending(false);
            const {account, error} = json
            if(account) {
              window.location.href = account.onBoardingUrl
            }
            if (error) {
              setStripeError(true)
            }
        })
    }
    */
}


export default ProducerController
