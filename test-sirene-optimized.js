// Test direct du service SIRENE avec la nouvelle implémentation optimisée
import { SireneApiService } from './src/lib/services/sirene-api.js';

async function testSireneOptimized() {
  console.log('🧪 Test du service SIRENE optimisé avec documentation INSEE v3.11');
  console.log('='.repeat(70));

  try {
    const service = new SireneApiService();
    
    // Test 1: Recherche simple avec la nouvelle implémentation
    console.log('\n📋 Test 1: Recherche PEUGEOT avec champs optimisés');
    const searchResult = await service.searchCompanies({
      q: 'denominationUniteLegale:PEUGEOT*',
      nombre: 3
    });
    
    console.log(`✅ Trouvé ${searchResult.results.length} résultats sur ${searchResult.meta.total} total`);
    console.log('📊 Premier résultat:');
    if (searchResult.results[0]) {
      const company = searchResult.results[0];
      console.log(`   - SIREN: ${company.siren}`);
      console.log(`   - Dénomination: ${company.denomination}`);
      console.log(`   - Activité: ${company.activitePrincipale}`);
      console.log(`   - Adresse: ${company.adresse?.codePostal} ${company.adresse?.commune}`);
      console.log(`   - État: ${company.etatAdministratif}`);
    }

    // Test 2: Interrogation unitaire SIREN PEUGEOT (552100554)
    console.log('\n📋 Test 2: Interrogation unitaire SIREN PEUGEOT');
    const unitResult = await service.getUniteLegale('552100554');
    if (unitResult.uniteLegale) {
      const ul = unitResult.uniteLegale;
      console.log(`✅ Unité légale: ${ul.denominationUniteLegale}`);
      console.log(`   - État: ${ul.etatAdministratifUniteLegale}`);
      console.log(`   - Activité: ${ul.activitePrincipaleUniteLegale}`);
      console.log(`   - Siège: ${ul.nicSiegeUniteLegale}`);
      console.log(`   - Historique: ${ul.nombrePeriodesUniteLegale} périodes`);
    }

    // Test 3: Query builder avec critères multiples
    console.log('\n📋 Test 3: Constructeur de requête avec critères multiples');
    const query = SireneApiService.buildQueryFromCriteria({
      denomination: 'CARREFOUR',
      commune: 'BOULOGNE-BILLANCOURT'
    }, 'magasin');
    
    console.log(`🔍 Requête générée: ${query}`);
    
    const multiResult = await service.searchCompanies({
      q: query,
      nombre: 2
    });
    
    console.log(`✅ Résultats multiples: ${multiResult.results.length}/${multiResult.meta.total}`);

    console.log('\n🎉 Tous les tests réussis !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

testSireneOptimized();
