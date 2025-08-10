#!/usr/bin/env node
/**
 * Script de test pour la fonction Vercel Python déployée
 * Test la fonction via HTTP après déploiement
 */

const fs = require('fs');
const path = require('path');

// URL de base (sera mis à jour avec l'URL réelle après déploiement)
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://bank-converter-fyxcas2m1-stebous-projects.vercel.app';

const FUNCTION_URL = `${BASE_URL}/api/process-pdf-vercel`;

/**
 * Créer un PDF de test simple en base64
 */
function createTestPdfBase64() {
  // PDF minimal avec du texte "RELEVE BANCAIRE SOCIETE GENERALE"
  const pdfContent = Buffer.from(`%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Contents 4 0 R
/MediaBox [0 0 612 792]
>>
endobj
4 0 obj
<<
/Length 120
>>
stream
BT
/F1 12 Tf
100 700 Td
(RELEVE BANCAIRE) Tj
0 -20 Td
(SOCIETE GENERALE) Tj
0 -20 Td
(VIREMENT SALAIRE 2500.00 EUR) Tj
0 -20 Td
(PAIEMENT CB -67.30 EUR) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000185 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
350
%%EOF`);

  return pdfContent.toString('base64');
}

/**
 * Test de la fonction Vercel Python
 */
async function testVercelFunction() {
  console.log('🚀 Test de la fonction Vercel Python déployée');
  console.log('=' * 60);
  console.log(`📍 URL: ${FUNCTION_URL}`);
  console.log();

  try {
    // Préparer les données de test
    const pdfBase64 = createTestPdfBase64();
    console.log(`📄 PDF de test créé: ${pdfBase64.length} caractères base64`);

    const requestBody = {
      pdf_base64: pdfBase64,
      output_mode: 'hybrid',
    };

    console.log('📤 Envoi de la requête...');

    // Envoyer la requête
    const startTime = Date.now();
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️  Durée de la requête: ${duration}ms`);
    console.log(`📥 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur de la fonction:');
      console.error(errorText);
      return false;
    }

    // Parser la réponse
    const result = await response.json();

    console.log('\n📊 Résultat de la fonction:');
    console.log(`  ✅ Succès: ${result.success}`);
    console.log(
      `  📝 Texte extrait: ${result.extracted_text?.length || 0} caractères`
    );
    console.log(
      `  🖼️  Image générée: ${result.image_base64?.length || 0} caractères base64`
    );
    console.log(`  📈 Pages traitées: ${result.metadata?.page_count || 0}`);
    console.log(
      `  🏷️  Mots-clés trouvés: ${result.metadata?.keyword_count || 0}`
    );
    console.log(
      `  🔧 Méthode: ${result.metadata?.processing_method || 'unknown'}`
    );
    console.log(
      `  🏦 Banque détectée: ${result.metadata?.detected_bank || 'aucune'}`
    );

    if (result.extracted_text && result.extracted_text.length > 0) {
      console.log('\n📄 Aperçu du texte extrait:');
      console.log(result.extracted_text.substring(0, 200) + '...');
    }

    if (result.metadata?.found_keywords?.length > 0) {
      console.log('\n🔍 Mots-clés détectés:');
      console.log(result.metadata.found_keywords.slice(0, 10).join(', '));
    }

    if (result.error) {
      console.log(`\n⚠️  Erreur rapportée: ${result.error}`);
    }

    if (result.success) {
      console.log(
        '\n🎉 Test réussi! La fonction Vercel fonctionne correctement.'
      );
      return true;
    } else {
      console.log(
        "\n⚠️  La fonction a répondu mais n'a pas réussi le traitement."
      );
      return false;
    }
  } catch (error) {
    console.error('\n❌ Erreur lors du test:');
    console.error(error.message);

    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Vérifiez que:');
      console.error("  1. L'URL de déploiement est correcte");
      console.error('  2. La fonction est bien déployée sur Vercel');
      console.error('  3. Vous avez une connexion internet');
    }

    return false;
  }
}

/**
 * Test CORS
 */
async function testCORS() {
  console.log('\n🌐 Test CORS...');

  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'OPTIONS',
    });

    console.log(`📥 CORS Status: ${response.status}`);
    console.log('📋 Headers CORS:');

    const corsHeaders = [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
    ];

    corsHeaders.forEach(header => {
      const value = response.headers.get(header);
      console.log(`  ${header}: ${value || 'non défini'}`);
    });

    return response.ok;
  } catch (error) {
    console.error('❌ Erreur test CORS:', error.message);
    return false;
  }
}

// Exécution du script
async function main() {
  console.log('🔧 Test complet de la fonction Vercel Python');
  console.log('=' * 60);

  // Test CORS
  const corsOk = await testCORS();
  if (!corsOk) {
    console.log('⚠️  Problème CORS détecté');
  }

  console.log();

  // Test principal
  const success = await testVercelFunction();

  console.log('\n' + '=' * 60);
  if (success) {
    console.log(
      '🎉 Tous les tests sont passés! La fonction est opérationnelle.'
    );
    process.exit(0);
  } else {
    console.log('❌ Des problèmes ont été détectés.');
    process.exit(1);
  }
}

// Lancer le test si appelé directement
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testVercelFunction, testCORS };
