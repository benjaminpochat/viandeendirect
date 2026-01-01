# Tests End-to-End avec Playwright pour ViandeEnDirect

## Introduction

Ce dossier contient les tests end-to-end (e2e) pour l'application ViandeEnDirect utilisant [Playwright](https://playwright.dev/). Ces tests simulent le comportement réel des utilisateurs pour valider les fonctionnalités critiques de l'application.

## Structure

```
frontend/app/
└── tests/
    └── e2e/
        ├── order-flow.spec.ts      # Tests du flux de commande
        ├── setupTestData.js        # Script de préparation des données
        ├── testData.json           # Données générées (ignoré par git)
        └── ...                     # Autres fichiers de test
```

## Fichiers clés

### setupTestData.js

Script Node.js qui :
- Crée une vente de test via l'API backend
- Ajoute des productions et lots disponibles
- Sauvegarde les informations dans `testData.json`
- Utilise le token admin pour les opérations

### testData.json

Fichier généré contenant :
```json
{
  "saleId": "123",
  "createdAt": "2023-11-15T10:00:00.000Z",
  "products": [
    {
      "name": "Bœuf Haché 5% MG",
      "price": 12.50,
      "quantity": 5
    }
  ]
}
```

### order-flow.spec.ts

Tests Playwright qui :
- Chargent les données depuis `testData.json`
- Exécutent les scénarios de commande
- Utilisent les locators adaptés au `CustomerOrderForm`

## Prérequis

### Environnement

- Node.js v16 ou supérieur
- npm ou yarn
- L'application backend doit être en cours d'exécution
- Keycloak doit être configuré avec des utilisateurs de test

### Variables d'environnement

Pour que le script de setup fonctionne, vous devez définir :

```bash
# Dans votre environnement ou dans un fichier .env
export TEST_ADMIN_TOKEN="votre_token_admin_pour_creer_des_donnees"
```

Le token admin doit avoir les permissions pour :
- Créer des ventes (`POST /api/sales`)
- Créer des productions (`POST /api/sales/{id}/productions`)

### Utilisateurs de test

Le script utilise un utilisateur client pour les tests :

- **Email** : `client-test@example.com`
- **Mot de passe** : `motdepasse123`
- **Rôle** : `client`

Cet utilisateur doit être créé dans Keycloak avant d'exécuter les tests.

## Installation

### Dépendances

```bash
# Installer Playwright et les browsers
npm install
npx playwright install
```

### Configuration supplémentaire

Ajoutez ces lignes à votre fichier `.gitignore` :

```gitignore
# Fichiers de test Playwright
tests/e2e/testData.json
tests/e2e/authSetup.json
test-results/
```

Créez un fichier `.env` pour les variables d'environnement :

```bash
touch tests/e2e/.env
echo "TEST_ADMIN_TOKEN=votre_token_ici" > tests/e2e/.env
```

## Configuration

Le fichier `playwright.config.ts` contient la configuration principale :

- **Base URL** : `http://localhost:3000` (application frontend)
- **Dossier de tests** : `./tests/e2e`
- **Navigateurs testés** : Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Timeout** : 30 secondes par test
- **Rapport** : HTML (disponible après exécution)

## Utilisateurs de test

Pour exécuter les tests, vous devez configurer des utilisateurs de test dans Keycloak :

- **Email** : `client-test@example.com`
- **Mot de passe** : `motdepasse123`
- **Rôle** : `client`

## Exécution des tests

### Préparation des données de test

Avant d'exécuter les tests, vous devez préparer les données nécessaires :

```bash
# Exécuter le script de setup des données
node tests/e2e/setupTestData.js
```

Ce script crée :
- Une vente de test avec des produits disponibles
- Des productions et lots associés
- Sauvegarde les informations dans `tests/e2e/testData.json`

### Exécuter tous les tests

```bash
npm run test:e2e
```

### Exécuter avec interface utilisateur

```bash
npm run test:e2e:ui
```

### Exécuter en mode headed (visible)

```bash
npm run test:e2e:headed
```

### Exécuter un test spécifique

```bash
npx playwright test tests/e2e/order-flow.spec.ts
```

### Voir le rapport

```bash
npm run test:e2e:report
```

### Exécuter avec données fraîches

```bash
# Nettoyer les anciennes données et en créer de nouvelles
rm -f tests/e2e/testData.json
node tests/e2e/setupTestData.js
npm run test:e2e
```

## Scénarios de test implémentés

### 1. Passage de commande complet

Ce test couvre tout le flux de commande basé sur le `CustomerOrderForm` :

1. **Préparation** : Utilisation des données créées par `setupTestData.js`
2. **Navigation** : Accès direct à une vente spécifique (`/sales/{id}`)
3. **Sélection** : Utilisation du `PackageSelector` pour choisir des produits
4. **Quantité** : Gestion des quantités avec les boutons `+`/`+`
5. **Validation** : Progression à travers les étapes du Stepper
6. **Authentification** : Connexion avec Keycloak (utilisateur de test)
7. **Conditions** : Acceptation des conditions générales
8. **Paiement** : Simulation du processus de paiement Stripe

### 2. Vérification du formulaire de commande

Teste spécifiquement la structure du `CustomerOrderForm` :

- Vérification du titre et du Stepper MUI
- Validation que les 4 étapes sont présentes
- Test de l'état initial des boutons
- Vérification de l'affichage des packages

### 3. Validation des étapes du formulaire

Teste la logique de navigation entre les étapes :

- Progression de l'étape 1 (sélection) à l'étape 4 (paiement)
- Validation que chaque étape est correctement activée/désactivée
- Test de la checkbox d'acceptation des conditions
- Vérification des boutons de continuation

### 4. Gestion des quantités

Teste le composant `PackageSelector` :

- Vérification de la quantité initiale (0)
- Test des boutons d'incrémentation/décrémentation
- Validation de l'état du bouton "Valider la commande"
- Gestion des quantités disponibles

### 5. Annulation de commande

Teste le bouton "Abandonner" :

- Vérification de la redirection vers la page d'accueil
- Nettoyage du cookie `pendingOrder`
- Retour à l'état initial

## Bonnes pratiques

### Sélecteurs

Utilisez des sélecteurs stables et sémantiques :

```typescript
// ✅ Bon - sélecteurs sémantiques
await page.click('button:has-text("Ajouter au panier")');
await page.fill('input[name="firstName"]', 'Jean');

// ❌ Évitez - sélecteurs trop génériques ou basés sur la structure
await page.click('.btn:nth-child(3)');
```

### Attentes

Utilisez toujours des attentes pour les éléments dynamiques :

```typescript
await expect(page.locator('text=Produit ajouté')).toBeVisible();
await page.waitForURL('/checkout');
```

### Données de test

Utilisez des données de test réalistes mais clairement identifiables :

```typescript
// Utilisez des noms comme "Jean Test" pour faciliter le débogage
// Évitez les données aléatoires qui rendent les tests non reproductibles
```

## Débogage

### Mode headed

```bash
npx playwright test --headed
```

### Trace des tests

Les traces sont automatiquement capturées lors des échecs :

```bash
npx playwright show-trace test-results/order-flow-passage-de-commande-complet-chromium/trace.zip
```

### Screenshots

Les screenshots sont capturés automatiquement en cas d'échec dans `test-results/`.

### Problèmes courants avec les données de test

#### "Aucun produit disponible"

Si vous voyez ce message :

1. Vérifiez que le script de setup a bien été exécuté :
   ```bash
   node tests/e2e/setupTestData.js
   ```

2. Vérifiez que le fichier `testData.json` existe et contient un `saleId` valide

3. Assurez-vous que le backend est accessible et que la vente existe

#### "Token admin invalide"

Si le script de setup échoue avec une erreur d'authentification :

1. Vérifiez que `TEST_ADMIN_TOKEN` est défini
2. Assurez-vous que le token est valide et non expiré
3. Vérifiez que le token a les permissions nécessaires

#### "La vente n'est pas publique"

Si la vente existe mais n'est pas accessible :

1. Vérifiez dans le script `setupTestData.js` que `isPublic: true`
2. Ou modifiez manuellement la vente dans la base de données

### Vérification manuelle

Vous pouvez vérifier que les données de test sont correctes :

```bash
# Vérifier que la vente existe
curl -H "Authorization: Bearer $TEST_ADMIN_TOKEN" http://localhost:8080/api/sales/1

# Vérifier les productions
curl -H "Authorization: Bearer $TEST_ADMIN_TOKEN" http://localhost:8080/api/sales/1/productions
```

## Intégration CI/CD

Les tests sont configurés pour s'exécuter en CI avec :

- 2 retries en cas d'échec
- 1 worker (pas de parallélisme en CI)
- Échec si des tests sont marqués avec `.only`

## Maintenance

### Mise à jour des tests

Lorsque l'interface change :

1. Identifiez les sélecteurs cassés
2. Mettez à jour les sélecteurs dans les tests
3. Vérifiez que les assertions sont toujours valides
4. Exécutez les tests localement avant de commiter

### Ajout de nouveaux tests

Pour ajouter un nouveau test :

1. Créez un nouveau fichier dans `tests/e2e/`
2. Suivez la structure existante
3. Utilisez des noms de test descriptifs
4. Documentez le scénario dans le fichier README

## Problèmes courants

### "Element not found"

- Vérifiez que l'application est bien démarrée
- Assurez-vous que les sélecteurs sont corrects
- Augmentez le timeout si nécessaire

### "Navigation timeout"

- Vérifiez que le backend répond correctement
- Assurez-vous que Keycloak est accessible
- Vérifiez les logs du serveur

### "Authentication failed"

- Vérifiez que l'utilisateur de test existe dans Keycloak
- Assurez-vous que le mot de passe est correct
- Vérifiez que le realm Keycloak est configuré

## Ressources

- [Documentation Playwright](https://playwright.dev/docs/intro)
- [API Playwright](https://playwright.dev/docs/api/class-playwright)
- [Bonnes pratiques](https://playwright.dev/docs/best-practices)
