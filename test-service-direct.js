#!/usr/bin/env node

// Test direct du service de données d'entreprise
const { searchCompanies } = require('./src/services/companyDataService.ts');

console.log('🔍 Test direct du service de données d\'entreprise...\n');

async function testService() {
  try {
    console.log('📡 Appel API avec searchCompanies("rest")...');
    const result = await searchCompanies('rest');
    
    console.log('✅ Résultat reçu:');
    console.log('Nombre d\'entreprises:', result.length);
    
    if (result.length > 0) {
      console.log('\n📊 Première entreprise:');
      console.log('SIRET:', result[0].siret);
      console.log('Nom:', result[0].nom);
      console.log('Adresse:', result[0].adresse);
      console.log('Code postal:', result[0].codePostal);
      console.log('Ville:', result[0].ville);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testService();
