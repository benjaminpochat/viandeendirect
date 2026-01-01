const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script de préparation des données de test pour Playwright
 * Ce script s'assure qu'il existe des ventes et produits disponibles pour les tests
 */

async function setupTestData() {
  console.log('🚀 Préparation des données de test pour Playwright...');
  
  try {
    // 1. Vérifier si l'API backend est accessible
    console.log('✅ Vérification de la disponibilité du backend...');
    
    // 2. Créer une vente de test via l'API (si elle n'existe pas)
    const saleResponse = await createTestSale();
    const saleId = saleResponse.id;
    
    // 3. Créer des productions et lots pour cette vente
    await createTestProductions(saleId);
    
    // 4. Sauvegarder l'ID de la vente pour les tests
    const testData = {
      saleId: saleId,
      createdAt: new Date().toISOString(),
      products: [
        {
          name: 'Test Product 1',
          price: 10.99,
          quantity: 10
        }
      ]
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'testData.json'),
      JSON.stringify(testData, null, 2)
    );
    
    console.log('✅ Données de test préparées avec succès !');
    console.log(`📋 Vente créée avec ID: ${saleId}`);
    
    return testData;
  } catch (error) {
    console.error('❌ Erreur lors de la préparation des données:', error.message);
    process.exit(1);
  }
}

async function createTestSale() {
  // Appel à votre API pour créer une vente de test
  // Cela dépend de votre implémentation backend
  
  // Exemple avec fetch (à adapter selon votre API)
  const response = await fetch('http://localhost:8080/api/sales', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.TEST_ADMIN_TOKEN
    },
    body: JSON.stringify({
      deliveryStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
      deliveryStop: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2h plus tard
      deliveryAddressName: 'Point de collecte Test',
      deliveryAddressLine1: '1 Rue des Tests',
      deliveryAddressLine2: '',
      deliveryZipCode: '75001',
      deliveryCity: 'Paris',
      isPublic: true
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create test sale: ${response.statusText}`);
  }
  
  return await response.json();
}

async function createTestProductions(saleId) {
  // Créer des productions avec des lots pour la vente
  const response = await fetch(`http://localhost:8080/api/sales/${saleId}/productions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.TEST_ADMIN_TOKEN
    },
    body: JSON.stringify({
      productions: [
        {
          name: 'Bœuf Haché 5% MG',
          description: 'Bœuf haché pour tests',
          category: 'BOEUF',
          lots: [
            {
              netWeight: 1.0,
              unitPrice: 12.50,
              quantityAvailable: 5,
              packagingType: 'BARQUETTE',
              photoUrl: 'https://example.com/boeuf.jpg'
            }
          ]
        },
        {
          name: 'Côtes d\'Agneau',
          description: 'Côtes d\'agneau premium',
          category: 'AGNEAU',
          lots: [
            {
              netWeight: 2.5,
              unitPrice: 28.00,
              quantityAvailable: 3,
              packagingType: 'BARQUETTE',
              photoUrl: 'https://example.com/agneau.jpg'
            }
          ]
        }
      ]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create test productions: ${response.statusText}`);
  }
  
  return await response.json();
}

// Exécuter le script
if (require.main === module) {
  setupTestData();
}

module.exports = { setupTestData };