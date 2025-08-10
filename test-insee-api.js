// Script de test direct de l'API INSEE Sirene
const API_KEY = "75fc671b-0576-45b9-bc67-1b0576b5b909";
const BASE_URL = 'https://api.insee.fr/api-sirene/3.11';

async function testInseeAPI() {
  console.log('🔍 Test de l\'API INSEE Sirene...');

  // Test 1: Recherche par nom d'entreprise
  try {
    console.log("\n1️⃣ Test recherche par nom : 'Renault'");
    const response = await fetch(`${BASE_URL}/siret?q=denominationUniteLegale:Renault&nombre=5`, {
      headers: {
        'Accept': 'application/json',
        'X-INSEE-Api-Key-Integration': API_KEY
      }
    });
    
    console.log("Statut:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Succès! Résultats:", data.header?.total || 0);
      console.log("Premier résultat:", data.etablissements?.[0]?.uniteLegale?.denominationUniteLegale);
    } else {
      const errorText = await response.text();
      console.log("❌ Erreur:", response.status, errorText);
    }
  } catch (error) {
    console.log("❌ Erreur réseau:", error.message);
  }

  // Test 2: Recherche par SIREN
  try {
    console.log("\n2️⃣ Test recherche par SIREN : '552120222' (Tesla Motors France)");
    const response2 = await fetch(`${BASE_URL}/siret?q=siren:552120222&nombre=5`, {
      headers: {
        'Accept': 'application/json',
        'X-INSEE-Api-Key-Integration': API_KEY
      }
    });
    
    console.log("Statut:", response2.status);
    
    if (response2.ok) {
      const data = await response2.json();
      console.log("✅ Succès! Résultats:", data.header?.total || 0);
      if (data.etablissements?.[0]) {
        console.log("Entreprise trouvée:", data.etablissements[0].uniteLegale?.denominationUniteLegale);
      }
    } else {
      const errorText = await response2.text();
      console.log("❌ Erreur:", response2.status, errorText);
    }
  } catch (error) {
    console.log("❌ Erreur réseau:", error.message);
  }

  // Test 3: Test de validation de la clé API
  try {
    console.log("\n3️⃣ Test authentification API...");
    const testResponse = await fetch(`${BASE_URL}/siret?q=*&nombre=1`, {
      headers: {
        'Accept': 'application/json',
        'X-INSEE-Api-Key-Integration': API_KEY
      }
    });
    
    console.log("Statut:", testResponse.status);
    
    if (testResponse.ok) {
      console.log("✅ Clé API valide et fonctionnelle");
    } else {
      console.log("❌ Clé API invalide ou expirée");
    }
  } catch (error) {
    console.log("❌ Erreur réseau:", error.message);
  }
}

// Exécution du test
testInseeAPI().catch(console.error);
