// Test simple de l'API de recherche d'entreprises
const API_BASE = 'http://localhost:3000';

async function testCompanySearch() {
    console.log('🧪 Test de l\'API de recherche d\'entreprises...');
    
    try {
        // Test 1: Recherche simple par nom
        console.log('\n📌 Test 1: Recherche simple par nom "LVMH"');
        const response1 = await fetch(`${API_BASE}/api/company-search?q=LVMH`);
        
        if (!response1.ok) {
            const errorText = await response1.text();
            console.error('❌ Erreur:', response1.status, errorText);
            return;
        }
        
        const result1 = await response1.json();
        console.log('✅ Résultat 1:', {
            count: result1.results?.length || 0,
            source: result1.source,
            pagination: result1.pagination
        });
        
        if (result1.results?.length > 0) {
            console.log('📊 Premier résultat:', result1.results[0]);
        }
        
        // Test 2: Recherche avec critères
        console.log('\n📌 Test 2: Recherche avec SIREN');
        const response2 = await fetch(`${API_BASE}/api/company-search?siren=775672272`);
        
        if (response2.ok) {
            const result2 = await response2.json();
            console.log('✅ Résultat 2:', {
                count: result2.results?.length || 0,
                source: result2.source
            });
        } else {
            const errorText = await response2.text();
            console.error('❌ Erreur test 2:', response2.status, errorText);
        }
        
    } catch (error) {
        console.error('❌ Erreur de test:', error);
    }
}

// Exécuter le test
testCompanySearch();
