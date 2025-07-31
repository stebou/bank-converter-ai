// Traitement PDF via fonction Vercel Python
// Remplace la dépendance Python locale par un appel à la fonction Vercel

export async function processPdfServerSide(pdfBuffer: Buffer, filename?: string): Promise<{
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
}> {
  console.log('[PDF_VERCEL] Starting Vercel Python function PDF processing...');
  console.log('[PDF_VERCEL] Buffer size:', pdfBuffer.length);
  console.log('[PDF_VERCEL] Filename:', filename || 'unknown');
  
  try {
    // Encoder le PDF en base64 pour l'envoi à la fonction Vercel
    const pdfBase64 = pdfBuffer.toString('base64');
    console.log('[PDF_VERCEL] PDF encoded to base64, length:', pdfBase64.length);
    
    // Préparer la requête
    const requestBody = {
      pdf_base64: pdfBase64,
      output_mode: 'hybrid'
    };
    
    // Déterminer l'URL de la fonction Vercel
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NODE_ENV === 'production' 
          ? 'https://bank-converter-fyxcas2m1-stebous-projects.vercel.app' 
          : 'http://localhost:3000');
    
    const functionUrl = `${baseUrl}/api/process-pdf-vercel`;
    
    // En développement local, utiliser un fallback simple si la fonction n'est pas disponible
    if (process.env.NODE_ENV === 'development') {
      console.log('[PDF_VERCEL] Development mode - attempting Vercel function, will fallback if unavailable');
    }
    console.log('[PDF_VERCEL] Calling function at:', functionUrl);
    
    // Appeler la fonction Vercel Python
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      // Timeout de 25 secondes (fonction Vercel a 30s max)
      signal: AbortSignal.timeout(25000)
    });
    
    console.log('[PDF_VERCEL] Function response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PDF_VERCEL] Function error response:', errorText);
      throw new Error(`Vercel function error: ${response.status} - ${errorText}`);
    }
    
    // Parser la réponse JSON
    const result = await response.json();
    console.log('[PDF_VERCEL] Function completed:', result.success);
    console.log('[PDF_VERCEL] Text extracted:', result.extracted_text?.length || 0, 'chars');
    console.log('[PDF_VERCEL] Image converted:', result.image_base64?.length || 0, 'chars base64');
    console.log('[PDF_VERCEL] Processing method:', result.metadata?.processing_method);
    console.log('[PDF_VERCEL] Detected bank:', result.metadata?.detected_bank || 'none');
    
    // Retourner le résultat dans le format attendu
    return {
      success: result.success,
      extracted_text: result.extracted_text || '',
      image_base64: result.image_base64 || '',
      metadata: {
        page_count: result.metadata?.page_count || 0,
        text_length: result.metadata?.text_length || 0,
        has_text: result.metadata?.has_text || false,
        has_image: result.metadata?.has_image || false,
        found_keywords: result.metadata?.found_keywords || [],
        keyword_count: result.metadata?.keyword_count || 0,
        processing_method: result.metadata?.processing_method || 'vercel_function',
        detected_bank: result.metadata?.detected_bank || ''
      },
      error: result.error
    };
    
  } catch (error) {
    console.error('[PDF_VERCEL] Error calling Vercel function:', error);
    
    // En développement, essayer un fallback simple avec des données fictives
    if (process.env.NODE_ENV === 'development') {
      console.log('[PDF_VERCEL] Development fallback activated');
      
      // Générer des données de test basiques
      const fallbackText = "RELEVE DE COMPTE\nSOCIETE GENERALE\nVIREMENT SALAIRE 2500.00€\nPAIEMENT CB SUPERMARCHE -67.30€\nPRELEVEMENT EDF -78.50€";
      
      return {
        success: true,
        extracted_text: fallbackText,
        image_base64: '',
        metadata: {
          page_count: 1,
          text_length: fallbackText.length,
          has_text: true,
          has_image: false,
          found_keywords: ['société générale', 'virement', 'compte', 'prélèvement', '€'],
          keyword_count: 5,
          processing_method: 'development_fallback',
          detected_bank: 'Société Générale'
        }
      };
    }
    
    // En production, retourner l'erreur
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
        processing_method: 'vercel_function_failed',
        detected_bank: ''
      },
      error: error instanceof Error ? error.message : String(error)
    };
  }
}