// Traitement PDF natif avec pdf-parse + pdf2pic
// Remplace complètement la dépendance Python PyMuPDF

import pdf from 'pdf-parse';

export interface PDFProcessingResult {
  success: boolean;
  extracted_text: string;
  image_base64?: string;
  metadata: {
    page_count: number;
    text_length: number;
    has_text: boolean;
    has_image: boolean;
    found_keywords: string[];
    keyword_count: number;
    processing_method: string;
    detected_bank?: string;
  };
  error?: string;
}

/**
 * Traitement PDF principal avec pdf-parse + pdf2pic
 * Remplace processPdfServerSide de Python
 */
export async function processPdfNative(pdfBuffer: Buffer, filename?: string): Promise<PDFProcessingResult> {
  console.log('[PDF_NATIVE] Starting JavaScript PDF processing...');
  console.log('[PDF_NATIVE] Buffer size:', pdfBuffer.length);
  console.log('[PDF_NATIVE] Filename:', filename || 'unknown');
  
  let extractedText = '';
  const imageBase64 = ''; // Pas d'image pour éviter les problèmes de dépendances
  let pageCount = 0;
  let processingMethod = 'pdf_parse_text_only';
  let detectedBank = '';
  
  try {
    // 1. EXTRACTION DE TEXTE AVEC PDF-PARSE
    console.log('[PDF_NATIVE] Extracting text with pdf-parse...');
    
    const pdfData = await pdf(pdfBuffer, {
      // Options pour optimiser l'extraction
      max: 0, // Pas de limite de pages
      version: 'v1.10.100' // Version de PDF.js
    });
    
    extractedText = pdfData.text || '';
    pageCount = pdfData.numpages || 0;
    
    console.log('[PDF_NATIVE] Text extracted:', extractedText.length, 'chars from', pageCount, 'pages');
    
    // 2. DÉTECTION DE BANQUE (même logique que Python)
    
    const bankPatterns = {
      'bnp paribas': /bnp|paribas/i,
      'société générale': /société générale|societe generale/i,
      'crédit agricole': /crédit agricole|credit agricole/i,
      'lcl': /\blcl\b/i,
      'crédit mutuel': /crédit mutuel|credit mutuel/i,
      'banque populaire': /banque populaire/i,
      'caisse d\'épargne': /caisse d'épargne|caisse d epargne/i,
      'hsbc': /hsbc/i,
      'la banque postale': /banque postale/i,
      'ing': /\bing\b/i,
      'boursorama': /boursorama/i,
      'hello bank': /hello bank/i,
      'n26': /n26/i,
      'revolut': /revolut/i,
      'orange bank': /orange bank/i,
      'fortuneo': /fortuneo/i
    };
    
    for (const [bankName, pattern] of Object.entries(bankPatterns)) {
      if (pattern.test(extractedText)) {
        detectedBank = bankName.charAt(0).toUpperCase() + bankName.slice(1);
        break;
      }
    }
    
    console.log('[PDF_NATIVE] Detected bank:', detectedBank || 'none');
    
  } catch (error) {
    console.error('[PDF_NATIVE] Processing error:', error);
    processingMethod = 'native_js_failed';
    return {
      success: false,
      extracted_text: '',
      image_base64: '',
      metadata: {
        page_count: 0,
        text_length: 0,
        has_text: false,
        has_image: false,
        found_keywords: [],
        keyword_count: 0,
        processing_method: processingMethod,
        detected_bank: ''
      },
      error: error instanceof Error ? error.message : String(error)
    };
  }
  
  // 3. ANALYSE DES MOTS-CLÉS (même logique que Python)
  const text_lower = extractedText.toLowerCase();
  const bankingKeywords = [
    'bnp', 'paribas', 'crédit agricole', 'société générale', 'lcl',
    'crédit mutuel', 'banque populaire', 'caisse d\'épargne', 'hsbc',
    'la banque postale', 'ing', 'boursorama', 'hello bank', 'n26',
    'revolut', 'orange bank', 'fortuneo', 'relevé', 'compte', 'solde',
    'virement', 'prélèvement', 'carte bancaire', 'transaction', 'euro',
    '€', 'débit', 'crédit', 'facture', 'montant', 'total'
  ];
  
  const foundKeywords = bankingKeywords.filter(keyword => text_lower.includes(keyword));
  
  // 4. RÉSULTATS FINAUX
  const hasText = extractedText.length > 50;
  const hasImage = imageBase64.length > 1000;
  
  console.log('[PDF_NATIVE] Final processing results:');
  console.log('[PDF_NATIVE] - Has text:', hasText, `(${extractedText.length} chars)`);
  console.log('[PDF_NATIVE] - Has image:', hasImage, `(${imageBase64.length} chars base64)`);
  console.log('[PDF_NATIVE] - Keywords found:', foundKeywords.length);
  console.log('[PDF_NATIVE] - Processing method:', processingMethod);
  console.log('[PDF_NATIVE] - Detected bank:', detectedBank || 'none');
  
  const willSucceed = hasText || hasImage || foundKeywords.length > 0;
  console.log('[PDF_NATIVE] - Final success decision:', willSucceed);
  
  return {
    success: willSucceed,
    extracted_text: extractedText,
    image_base64: imageBase64,
    metadata: {
      page_count: pageCount,
      text_length: extractedText.length,
      has_text: hasText,
      has_image: hasImage,
      found_keywords: foundKeywords,
      keyword_count: foundKeywords.length,
      processing_method: processingMethod,
      detected_bank: detectedBank
    }
  };
}