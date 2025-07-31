// Utilitaire pour l'extraction hybride PDF sans appels HTTP
// Utilise la même logique que la fonction Python mais en TypeScript

export async function extractPdfContent(pdfBuffer: Buffer): Promise<{
  success: boolean;
  extracted_text: string;  
  text_length: number;
  contains_financial_data: boolean;
  bank_keywords_found: string[];
  error?: string;
}> {
  console.log('[PDF_PROCESSING] Starting PDF text extraction...');
  
  try {
    // Tentative d'import dynamique de pdf-parse pour l'extraction de texte
    const pdfParse = await import('pdf-parse').catch(() => null);
    
    if (!pdfParse) {
      console.log('[PDF_PROCESSING] pdf-parse not available, using fallback');
      return {
        success: false,
        extracted_text: '',
        text_length: 0,
        contains_financial_data: false,
        bank_keywords_found: [],
        error: 'pdf-parse not available'
      };
    }
    
    // Extraction du texte avec pdf-parse
    const data = await pdfParse.default(pdfBuffer);
    const extractedText = data.text || '';
    
    console.log('[PDF_PROCESSING] Text extracted:', extractedText.length, 'characters');
    
    // Analyse du contenu pour détecter des données financières
    const text_lower = extractedText.toLowerCase();
    
    // Mots-clés bancaires français
    const bankKeywords = [
      'bnp', 'paribas', 'crédit agricole', 'société générale', 'lcl',
      'crédit mutuel', 'banque populaire', 'caisse d\'épargne', 'hsbc',
      'la banque postale', 'ing', 'boursorama', 'hello bank', 'n26',
      'revolut', 'orange bank', 'fortuneo', 'relevé', 'compte', 'solde',
      'virement', 'prélèvement', 'carte bancaire', 'transaction'
    ];
    
    // Mots-clés financiers généraux
    const financialKeywords = [
      '€', 'euro', 'euros', 'solde', 'débit', 'crédit', 'virement',
      'prélèvement', 'carte', 'retrait', 'facture', 'montant', 'total'
    ];
    
    const foundBankKeywords = bankKeywords.filter(keyword => text_lower.includes(keyword));
    const foundFinancialKeywords = financialKeywords.filter(keyword => text_lower.includes(keyword));
    
    const contains_financial_data = foundFinancialKeywords.length > 0 || foundBankKeywords.length > 0;
    
    console.log('[PDF_PROCESSING] Bank keywords found:', foundBankKeywords);
    console.log('[PDF_PROCESSING] Financial data detected:', contains_financial_data);
    
    return {
      success: true,
      extracted_text: extractedText,
      text_length: extractedText.length,
      contains_financial_data,
      bank_keywords_found: foundBankKeywords
    };
    
  } catch (error) {
    console.error('[PDF_PROCESSING] Error during text extraction:', error);
    return {
      success: false,
      extracted_text: '',
      text_length: 0,
      contains_financial_data: false,
      bank_keywords_found: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Fonction pour générer du contenu de test basé sur les mots-clés trouvés
export function generateTestBankContent(bankKeywords: string[], fileName: string): string {
  console.log('[PDF_PROCESSING] Generating test content based on keywords:', bankKeywords);
  
  // Déterminer la banque principale
  let mainBank = 'Banque Générique';
  
  if (bankKeywords.some(k => k.includes('bnp') || k.includes('paribas'))) {
    mainBank = 'BNP Paribas';
  } else if (bankKeywords.some(k => k.includes('crédit') && k.includes('agricole'))) {
    mainBank = 'Crédit Agricole';
  } else if (bankKeywords.some(k => k.includes('société') || k.includes('générale'))) {
    mainBank = 'Société Générale';
  } else if (bankKeywords.some(k => k.includes('lcl'))) {
    mainBank = 'LCL';
  } else if (bankKeywords.some(k => k.includes('revolut'))) {
    mainBank = 'Revolut';
  } else if (bankKeywords.some(k => k.includes('boursorama'))) {
    mainBank = 'Boursorama';
  }
  
  // Générer un contenu de relevé bancaire réaliste
  const content = `${mainBank}
SA au capital de 2 499 597 122 euros
Siège social: 16 bd des Italiens 75009 Paris

RELEVÉ DE COMPTE - ${mainBank}
M. MARTIN Jean
123 Rue de la Paix
75001 PARIS

Compte courant n° 30004 12345 67890123456 78
Période du 01/01/2024 au 31/01/2024
Page 1/2

DÉTAIL DES OPÉRATIONS
Solde précédent au 31/12/2023: 1 847,70 €

MOUVEMENTS DU COMPTE
DATE    DATE VALEUR    LIBELLÉ                           MONTANT      SOLDE
03/01   03/01         VIR SEPA SALAIRE ENTREPRISE ABC   +2 500,00   4 347,70
04/01   04/01         PAIEMENT CB LECLERC PARIS          -67,30     4 280,40
05/01   05/01         PREL SEPA ASSURANCE MAIF          -125,00     4 155,40
06/01   06/01         RETRAIT DAB ${mainBank.toUpperCase()}     -100,00     4 055,40
07/01   07/01         VIR INSTANTANÉ MARTIN PAUL        +200,00     4 255,40
15/01   15/01         PREL SEPA EDF FACTURE ELEC         -78,50     4 176,90
20/01   20/01         PAIEMENT CB FNAC PARIS            -245,60     3 931,30
25/01   25/01         PREL SEPA ORANGE TELECOM           -39,99     3 891,31

RÉSUMÉ DE LA PÉRIODE
Nombre d'opérations: 8
Total des débits: -656,39 €
Total des crédits: +2 700,00 €
Nouveau solde au 31/01/2024: 2 407,70 €

${mainBank} - Votre banque de référence`;

  return content;
}