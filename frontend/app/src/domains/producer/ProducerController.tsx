import React from 'react'
import { useState, useEffect } from 'react'

import { Button, Typography } from "@mui/material"

import { ApiInvoker } from '../../api/ApiInvoker.ts';
import { useKeycloak } from '@react-keycloak/web';
import Producer from 'viandeendirect_eu/dist/model/Producer.js';
import { AuthenticationService } from '../../authentication/AuthenticationService.ts';


function ProducerController() {

  const apiInvoker = new ApiInvoker()
  const {keycloak} = useKeycloak()
  const authenticationService = new AuthenticationService(keycloak)

  useEffect(() => {
    apiInvoker.callApiAuthenticatedly(
      keycloak, 
      api => api.getProducer, 
      {'email': authenticationService.getCurrentUserEmail()}, 
      setProducer, 
      console.error)
  }, [keycloak])

  const [producer, setProducer] = useState<Producer>();

  return <>
          <Typography variant="h6">Gestion du compte</Typography>
          {displayStripeAccount()}
          </>
  
  function displayStripeAccount() {
    if(producer?.stripeAccountId) {
      return <div>Votre numéro de compte Stripe est {producer.stripeAccountId}</div>
    } else {
     return <Button onClick={createStripeAccount}>Créer un compte de paiement Stripe</Button> 
    }
  }

  function createStripeAccount() {
    apiInvoker.callApiAuthenticatedly(keycloak, api => api.createStripeAccount, producer?.id, setProducer, console.error)
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