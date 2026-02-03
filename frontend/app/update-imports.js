const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/layouts/customer/CustomerLayout.tsx",
  "src/layouts/customer/PaymentLayout.tsx",
  "src/layouts/producer/AnonymousLayout.tsx",
  "src/layouts/producer/AuthenticatedLayout.tsx",
  "src/layouts/ViandeEnDirectRouterProvider.tsx",
  "src/authentication/views/NotAuthorizedForCustomers.tsx",
  "src/authentication/views/NotAuthorizedForProducers.tsx",
  "src/domains/sale/components/SaleCard.tsx",
  "src/domains/sale/components/SaleCardBeefProduction.tsx",
  "src/domains/sale/views/CustomerOrderForm.tsx",
  "src/domains/sale/views/ProducerOrderForm.tsx",
  "src/domains/sale/views/SaleForm.tsx",
  "src/domains/customer/views/CustomerCreationForm.tsx",
  "src/domains/producer/views/ProducerAccountView.tsx",
  "src/domains/dashboard/components/DashboardSales.tsx",
  "src/domains/dashboard/components/DashboardProductions.tsx",
  "src/domains/dashboard/components/DashboardPayments.tsx",
  "src/domains/dashboard/components/DashboardAccount.tsx",
  "src/domains/production/components/BeefProductionCard.tsx",
  "src/domains/production/views/beefProduction/BeefProductionView.tsx",
  "src/domains/production/views/beefProduction/BeefProductionCreator.tsx",
  "src/domains/production/views/beefProduction/PublicationBeefProductionToSale.tsx"
];

console.log('Mise à jour des imports Keycloak...');

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remplacer les imports avec guillemets simples
    const updatedContent = content
      .replace(/import { useKeycloak } from '@react-keycloak\/web'/g, "import { useKeycloak } from '../../authentication/keycloak-adapter'")
      .replace(/import { useKeycloak } from "@react-keycloak\/web"/g, 'import { useKeycloak } from "../../authentication/keycloak-adapter"');
    
    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      console.log(`✓ ${filePath} mis à jour`);
    } else {
      console.log(`- ${filePath} aucun changement nécessaire`);
    }
  } else {
    console.log(`⚠ ${filePath} non trouvé`);
  }
});

// Mise à jour du fichier de test
const testFilePath = path.join(__dirname, 'src/domains/production/components/BeefProductionCard.test.tsx');
if (fs.existsSync(testFilePath)) {
  let content = fs.readFileSync(testFilePath, 'utf8');
  const updatedContent = content.replace(
    'jest.mock("@react-keycloak/web", () => ({ useKeycloak: mockUseKeycloak }));',
    'jest.mock("../../authentication/keycloak-adapter", () => ({ useKeycloak: mockUseKeycloak }));'
  );
  
  if (content !== updatedContent) {
    fs.writeFileSync(testFilePath, updatedContent, 'utf8');
    console.log(`✓ BeefProductionCard.test.tsx mis à jour`);
  }
}

console.log('Mise à jour des imports terminée!');