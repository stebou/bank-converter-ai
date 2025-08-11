// Service de traitement d'images JPEG/PNG pour l'analyse financière
// Utilise GPT-4o Vision pour extraire le texte et analyser le contenu

export async function processImageContent(imageBuffer: Buffer, mimeType: string): Promise<{
  success: boolean;
  extracted_text: string;
  image_base64: string;
  text_length: number;
  contains_financial_data: boolean;
  bank_keywords_found: string[];
  error?: string;
}> {
  console.log('[IMAGE_PROCESSING] Starting image processing...');
  console.log('[IMAGE_PROCESSING] Image buffer size:', imageBuffer.length);
  console.log('[IMAGE_PROCESSING] MIME type:', mimeType);

  try {
    // Convertir l'image en base64
    const imageBase64 = imageBuffer.toString('base64');
    console.log('[IMAGE_PROCESSING] Image converted to base64:', imageBase64.length, 'characters');

    // Validation de la taille de l'image
    if (imageBuffer.length > 20 * 1024 * 1024) { // 20MB max
      throw new Error('Image trop volumineuse (max 20MB)');
    }

    if (imageBuffer.length < 1000) { // Minimum viable
      throw new Error('Image trop petite ou corrompue');
    }

    // Pour les images, l'extraction de texte sera faite par GPT-4o Vision
    // donc on marque comme "potentiellement financier" si c'est une image valide
    const extractedText = ''; // Sera rempli par GPT-4o Vision lors de l'analyse
    
    // Analyser si l'image est potentiellement financière basé sur la taille et format
    const containsFinancialData = imageBuffer.length > 5000; // Images significatives
    
    // Mots-clés bancaires français pour la validation finale
    const bankKeywords = [
      'bnp', 'paribas', 'crédit agricole', 'société générale', 'lcl',
      'crédit mutuel', 'banque populaire', 'caisse d\'épargne', 'la banque postale',
      'cic', 'hsbc', 'monabanq', 'boursorama', 'ing', 'hello bank', 'revolut',
      'relevé', 'compte', 'solde', 'débit', 'crédit', 'virement', 'transactions',
      'carte bancaire', 'transaction', 'euro', '€', 'facture', 'montant', 'total',
      'rib', 'iban', 'prélèvement', 'retrait', 'dab', 'commission'
    ];

    console.log('[IMAGE_PROCESSING] Image processing completed successfully');
    console.log('[IMAGE_PROCESSING] Contains financial data estimate:', containsFinancialData);

    return {
      success: true,
      extracted_text: extractedText,
      image_base64: imageBase64,
      text_length: extractedText.length,
      contains_financial_data: containsFinancialData,
      bank_keywords_found: [], // Sera rempli par l'analyse GPT-4o Vision
      error: undefined
    };

  } catch (error) {
    console.error('[IMAGE_PROCESSING] Error processing image:', error);
    
    return {
      success: false,
      extracted_text: '',
      image_base64: '',
      text_length: 0,
      contains_financial_data: false,
      bank_keywords_found: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Fonction utilitaire pour valider les types d'images supportés
export function isValidImageType(mimeType: string): boolean {
  const supportedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ];
  
  return supportedTypes.includes(mimeType.toLowerCase());
}

// Fonction utilitaire pour obtenir l'extension de fichier basée sur le MIME type
export function getImageExtension(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      return '.jpg'; // Fallback
  }
}
