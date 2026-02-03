#!/bin/bash

# Script pour mettre à jour les imports de @react-keycloak/web vers notre adapter

echo "Mise à jour des imports Keycloak..."

# Fichiers à mettre à jour (exclure les fichiers de coverage et de test)
FILES_TO_UPDATE=(
  "src/layouts/customer/CustomerLayout.tsx"
  "src/layouts/customer/PaymentLayout.tsx"
  "src/layouts/producer/AnonymousLayout.tsx"
  "src/layouts/producer/AuthenticatedLayout.tsx"
  "src/layouts/ViandeEnDirectRouterProvider.tsx"
  "src/authentication/views/NotAuthorizedForCustomers.tsx"
  "src/authentication/views/NotAuthorizedForProducers.tsx"
  "src/domains/sale/components/SaleCard.tsx"
  "src/domains/sale/components/SaleCardBeefProduction.tsx"
  "src/domains/sale/views/CustomerOrderForm.tsx"
  "src/domains/sale/views/ProducerOrderForm.tsx"
  "src/domains/sale/views/SaleForm.tsx"
  "src/domains/customer/views/CustomerCreationForm.tsx"
  "src/domains/producer/views/ProducerAccountView.tsx"
  "src/domains/dashboard/components/DashboardSales.tsx"
  "src/domains/dashboard/components/DashboardProductions.tsx"
  "src/domains/dashboard/components/DashboardPayments.tsx"
  "src/domains/dashboard/components/DashboardAccount.tsx"
  "src/domains/production/components/BeefProductionCard.tsx"
  "src/domains/production/views/beefProduction/BeefProductionView.tsx"
  "src/domains/production/views/beefProduction/BeefProductionCreator.tsx"
  "src/domains/production/views/beefProduction/PublicationBeefProductionToSale.tsx"
)

for file in "${FILES_TO_UPDATE[@]}"; do
  if [ -f "$file" ]; then
    echo "Mise à jour de $file..."
    
    # Remplacer l'import
    sed -i '' 's|import { useKeycloak } from ''@react-keycloak/web''|import { useKeycloak } from ''../../authentication/keycloak-adapter''|g' "$file"
    
    # Remplacer les imports avec guillemets doubles
    sed -i '' 's|import { useKeycloak } from "@react-keycloak/web"|import { useKeycloak } from "../../authentication/keycloak-adapter"|g' "$file"
    
    echo "✓ $file mis à jour"
  else
    echo "⚠ $file non trouvé"
  fi
done

echo "Mise à jour des imports terminée!"

# Mise à jour du fichier de test
if [ -f "src/domains/production/components/BeefProductionCard.test.tsx" ]; then
  echo "Mise à jour du fichier de test..."
  sed -i '' 's|jest.mock("@react-keycloak/web"|jest.mock("../../authentication/keycloak-adapter"|g' "src/domains/production/components/BeefProductionCard.test.tsx"
  echo "✓ Fichier de test mis à jour"
fi