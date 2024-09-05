import React, { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export default function GeneralTermsAndConditions({closeCallback: closeCallback}) {

  return <>
    <Dialog
      fullScreen
      open
      onClose={closeCallback}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">Conditions générales d'utilisation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <h2>Description du service</h2>
          <div>
            ViandeEnDirect.eu est un service de vente et de livraison de produits alimentaires fermiers.
          </div>

          <h2>Livraison de la marchandise</h2>
          <div>
            La livraison de la marchandise est faite au lieu et à la date définie lors de la commande sur le site ViandeEnDirect.eu.

            Le vendeur et client s'engagent à se présenter au rendez-vous de livraison à l'adresse, à la date et aux horaires indiqués lors de la commande.
            <ul>
              <li>
                Si le client ne se présente au rendez-vous de livraison, la marchandise sera acheminée chez le vendeur et congelée.
                Le client pourra se rendre à l'adresse du vendeur pour récupérer sa marchandise jusqu'à 48h après le rendez-vous de livraison.
                Au delà du délai de 48h, la vente sera annulée, le montant d'achat sera remboursé à hauteur de 50%.
              </li>
              <li>
                Si le vendeur ne se présente pas au rendez-vous de livraison, il s'engage à prévenir le client pour convenir d'un autre rendez-vous de livraison.
              </li>
            </ul>
          </div>

          <h2>Réglement</h2>
          <div>
            Sauf mention explicite sur la présentation du produit, toute commande ne sera validée qu'après le réglement de la commande sur le site ViandeEnDirect.eu.
          </div>

          <h2>Respect de la chaîne du froid</h2>
          <div>
            Pour les produits frais vendus sur ViandeEnDirect.eu :
            <ul>
              <li>Le vendeur s'engage à respecter la chaîne du froid de la production à la livraison de la marchandise.</li>
              <li>Le client s'engage à respecter la chaîne du froid dès réception de la marchandise et jusqu'à sa consommation.</li>
            </ul>
          </div>

          <h2>Aucun retour de marchandise</h2>
          <div>
            Après réception de la marchandise par le client, tout retour de la marchandise au vendeur est impossible.
          </div>


        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={closeCallback}>
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  </>
}
