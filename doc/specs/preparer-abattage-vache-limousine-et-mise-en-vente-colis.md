# Préparer l'abattage d'une vache limousine et mettre en vente la viande en colis

## User Story

**En tant que** producteur de viande
**Je veux** créer une production de viande de bœuf pour une vache limousine et la mettre en vente sous forme de colis
**Afin de** proposer différents types de colis de viande à mes clients

---

## Contexte

Le producteur dispose d'une vache limousine prête pour l'abattage. Il souhaite :
1. Enregistrer les informations d'élevage, d'abattage et de découpe
2. Définir les différents colis de viande issus de cette production
3. Mettre ces colis en vente pour une livraison à une date et un lieu spécifiques

---

## Scénario principal

### 1. Accès à la création de production

- **Point de départ** : Tableau de bord (`Dashboard.tsx`)
- **Action** : L'utilisateur accède à la section **Productions** via le composant `DashboardProductions`
- **Résultat** : Il clique sur le bouton pour créer une **nouvelle production de colis de viande de bœuf**

### 2. Saisie des informations d'élevage

- **Écran** : `BeefProductionCreator.tsx` - Étape "Informations sur l'élevage"
- **Champs à remplir** :
  - Type d'animal : `BOVIN` (sélectionné par défaut pour la viande de bœuf)
  - Race : **LIMOUSINE** (sélection dans la liste des races bovines)
  - Numéro d'identification de l'animal
  - Date de naissance
- **Action** : Cliquer sur **Valider**
- **Résultat** : Passage à l'étape suivante, affiche un résumé : *"Bovin de race LIMOUSINE n° [identifier]"*

### 3. Saisie des informations d'abattage

- **Écran** : `BeefProductionCreator.tsx` - Étape "Informations sur l'abattage"
- **Champs à remplir** :
  - Date d'abattage (doit être postérieure à la date de naissance)
  - Poids de carcasse chaude estimé (en kg)
- **Action** : Cliquer sur **Valider**
- **Résultat** : Passage à l'étape suivante, affiche un résumé : *"Abattage le [date] - [poids] kg de carcasse estimés"*

### 4. Saisie des informations de découpe

- **Écran** : `BeefProductionCreator.tsx` - Étape "Informations sur la découpe"
- **Champs à remplir** :
  - Date de découpe (doit être postérieure à la date d'abattage)
  - Nom du boucher
- **Action** : Cliquer sur **Valider**
- **Résultat** : Passage à l'étape suivante, affiche un résumé : *"Découpé le [date] par [nom du boucher]"*

### 5. Définition des colis de viande

- **Écran** : `BeefProductionCreator.tsx` - Étape "Produits préparés"
- **Composant** : `PackageLotsCreator`
- **Actions** :
  - Pour chaque modèle de colis disponible (ex: "Colis viandes à griller", "Colis viandes à mijoter", etc.) :
    - Définir la **quantité** de colis de ce type
    - Le **poids net** par colis est pré-rempli depuis le modèle
    - Le **poids total** (poids net × quantité) est calculé automatiquement
  - Vérification : Le poids total de tous les colis ne doit pas dépasser le poids de viande disponible (calculé depuis le poids de carcasse)
- **Action** : Cliquer sur **Valider**
- **Résultat** : La production est enregistrée et l'utilisateur est redirigé vers la liste des productions

### 6. Mise en vente des colis

- **Point de départ** : Tableau de bord (`Dashboard.tsx`)
- **Action** : L'utilisateur accède à la section **Ventes** via le composant `DashboardSales`
- **Action** : Il clique sur **Nouvelle vente**

#### 6.1 Sélection de la production

- **Écran** : `SaleForm.tsx` - Étape "Choisir une production"
- **Composant** : `SaleProductionSelector`
- **Action** : Sélectionner la production de vache limousine récemment créée
- **Résultat** : L'étape affiche : *"Mise en vente de colis de viande de boeuf pour Bovin n° [identifier] découpée le [date]"*

#### 6.2 Définition du lieu de livraison

- **Écran** : `SaleForm.tsx` - Étape "Définir le lieu de livraison"
- **Actions** :
  - Sélectionner une adresse existante ou en créer une nouvelle
  - Remplir les champs : Nom, Numéro et rue, Complément (optionnel), Code postal, Commune
- **Action** : Cliquer sur **Valider**
- **Résultat** : Passage à l'étape suivante, affiche un résumé : *"Lieu de livraison : [nom de l'adresse]"*

#### 6.3 Définition de la date et heure de livraison

- **Écran** : `SaleForm.tsx` - Étape "Définir la date et l'heure de livraison"
- **Champs à remplir** :
  - Date de livraison
  - Heure de début de livraison
  - Heure de fin de livraison
- **Action** : Cliquer sur **Valider**
- **Résultat** : Passage à l'étape suivante, affiche un résumé : *"Livraison le [date] entre [heure début] et [heure fin]"*

#### 6.4 Définition du type d'accès

- **Écran** : `SaleForm.tsx` - Étape "Définir le type d'accès"
- **Actions** :
  - Choisir entre **Vente publique** (par défaut) ou **Vente privée**
  - Si vente privée : définir un **code d'accès**
- **Action** : Cliquer sur **Valider**
- **Résultat** : Passage à l'étape de validation, affiche un résumé : *"Vente privée - code d'accès = '[code]'"* ou *"Vente publique"*

#### 6.5 Validation de la vente

- **Écran** : `SaleForm.tsx` - Étape "Validation"
- **Action** : Vérifier toutes les informations et cliquer sur **Valider**
- **Résultat** :
  - La vente est créée et publiée dans l'espace client
  - Notification : *"Vos productions sont mises en vente dans l'espace client pour la livraison du [date] - [nom de l'adresse]"*
  - Redirection vers la liste des ventes

---

## Schéma du flux utilisateur

```
Dashboard
    │
    ├─▶ Productions (DashboardProductions)
    │       │
    │       └─▶ Nouvelle production de colis de viande de bœuf (BeefProductionCreator)
    │               │
    │               ├─▶ Étape 1: Informations sur l'élevage (BreedingPropertiesForm)
    │               │       └─▶ Valider
    │               │
    │               ├─▶ Étape 2: Informations sur l'abattage (SlaughterPropertiesForm)
    │               │       └─▶ Valider
    │               │
    │               ├─▶ Étape 3: Informations sur la découpe (CuttingPropertiesForm)
    │               │       └─▶ Valider
    │               │
    │               └─▶ Étape 4: Produits préparés (PackageLotsCreator)
    │                       └─▶ Valider (création de la BeefProduction)
    │
    └─▶ Ventes (DashboardSales)
            │
            └─▶ Nouvelle vente (SaleForm)
                    │
                    ├─▶ Étape 1: Sélection de la production (SaleProductionSelector)
                    │       └─▶ Valider
                    │
                    ├─▶ Étape 2: Lieu de livraison
                    │       └─▶ Valider
                    │
                    ├─▶ Étape 3: Date et heure de livraison
                    │       └─▶ Valider
                    │
                    ├─▶ Étape 4: Type d'accès (public/privé)
                    │       └─▶ Valider
                    │
                    └─▶ Étape 5: Validation
                            └─▶ Valider (création de la Sale)
```

---

## Critères d'acceptation

### Création de la production (BeefProductionCreator)

- [ ] L'utilisateur peut sélectionner la race **LIMOUSINE** dans la liste des races bovines
- [ ] Les dates (naissance, abattage, découpe) doivent être cohérentes entre elles (abattage > naissance, découpe > abattage)
- [ ] Le poids de carcasse chaude doit être un nombre positif
- [ ] La somme des poids des colis (poids net × quantité) ne doit pas dépasser le poids de viande disponible (calculé depuis le poids de carcasse)
- [ ] L'utilisateur peut abandonner à n'importe quelle étape (bouton **Abandonner**)
- [ ] La production créée est enregistrée avec le statut `forSale: true`

### Mise en vente (SaleForm)

- [ ] Seules les productions avec `forSale: true` sont disponibles pour la sélection
- [ ] L'utilisateur peut sélectionner une adresse de livraison existante ou en créer une nouvelle
- [ ] Les champs date et heure de livraison sont obligatoires
- [ ] Le type d'accès par défaut est **Vente publique**
- [ ] Pour une vente privée, un code d'accès est obligatoire
- [ ] L'utilisateur peut abandonner à n'importe quelle étape (bouton **Abandonner**)
- [ ] Une notification de succès est affichée après validation
- [ ] La vente est associée au producteur connecté

---

## Données techniques

### Modèles impliqués

- **BeefProduction** : `animalType`, `cattleBreed` (LIMOUSINE), `animalIdentifier`, `birthDate`, `slaughterDate`, `warmCarcassWeight`, `cuttingDate`, `cuttingButcher`, `lots` (tableau de colis)
- **PackageTemplate** : Modèles de colis pré-définis (photo, netWeight, name, description)
- **Lot** : `templateId`, `quantity`, `netWeight`, `photoToUpload`
- **Sale** : `productions` (array), `deliveryAddress*`, `deliveryStart`, `deliveryStop`, `privateAccessKey` (optionnel)
- **Address** : `name`, `addressLine1`, `addressLine2`, `zipCode`, `city`

### Services API

- `api.createBeefProduction({beefProduction})`
- `api.getPackageTemplates()`
- `api.getBeefProduction({beefProductionId})`
- `api.getProductions({forSale: true})`
- `api.createProducerSale({producerId, sale})`
- `api.getAddresses()`
