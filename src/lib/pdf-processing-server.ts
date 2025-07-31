// Traitement PDF côté serveur avec PyMuPDF via subprocess Python
// Utilise les librairies Python installées dans requirements.txt

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

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
  console.log('[PDF_SERVER] Starting PyMuPDF-based PDF processing...');
  console.log('[PDF_SERVER] Buffer size:', pdfBuffer.length);
  console.log('[PDF_SERVER] Filename:', filename || 'unknown');
  
  let extractedText = '';
  let imageBase64 = '';
  let pageCount = 0;
  let processingMethod = 'unknown';
  let detectedBank = '';
  
  // 1. CRÉATION FICHIER TEMPORAIRE
  const tempDir = os.tmpdir();
  const tempPdfPath = path.join(tempDir, `pdf_${Date.now()}.pdf`);
  
  try {
    // Écrire le buffer PDF dans un fichier temporaire
    fs.writeFileSync(tempPdfPath, pdfBuffer);
    console.log('[PDF_SERVER] Temporary PDF created:', tempPdfPath);
    
    // 2. EXÉCUTION DU SCRIPT PYTHON
    const pythonScriptPath = path.join(process.cwd(), 'python-pdf-processor.py');
    const pythonCommand = `python3 "${pythonScriptPath}" "${tempPdfPath}" hybrid`;
    
    console.log('[PDF_SERVER] Executing Python script:', pythonCommand);
    
    const { stdout, stderr } = await execAsync(pythonCommand, {
      timeout: 30000, // 30 secondes timeout
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer max
    });
    
    if (stderr) {
      console.log('[PDF_SERVER] Python stderr:', stderr);
    }
    
    // 3. PARSER LA RÉPONSE JSON
    const pythonResult = JSON.parse(stdout);
    console.log('[PDF_SERVER] Python processing completed:', pythonResult.success);
    
    if (pythonResult.success) {
      extractedText = pythonResult.extracted_text || '';
      imageBase64 = pythonResult.image_base64 || '';
      pageCount = pythonResult.metadata?.page_count || 0;
      processingMethod = pythonResult.metadata?.processing_method || 'python_success';
      detectedBank = pythonResult.metadata?.detected_bank || '';
      
      console.log('[PDF_SERVER] Text extracted:', extractedText.length, 'chars');
      console.log('[PDF_SERVER] Image converted:', imageBase64.length, 'chars base64');
      console.log('[PDF_SERVER] Pages:', pageCount);
      console.log('[PDF_SERVER] Processing method:', processingMethod);
      console.log('[PDF_SERVER] Detected bank:', detectedBank);
    } else {
      console.error('[PDF_SERVER] Python processing failed:', pythonResult.error);
      processingMethod = 'python_failed';
    }
    
  } catch (error) {
    console.error('[PDF_SERVER] Python execution error:', error);
    processingMethod = 'python_execution_failed';
  } finally {
    // Nettoyer le fichier temporaire
    try {
      if (fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
        console.log('[PDF_SERVER] Temporary file cleaned up');
      }
    } catch (cleanupError) {
      console.error('[PDF_SERVER] Cleanup error:', cleanupError);
    }
  }
  
  // 2. ANALYSE ET VALIDATION DES RÉSULTATS
  const hasText = extractedText.length > 50;
  const hasImage = imageBase64.length > 1000;
  
  // Analyser les mots-clés depuis le texte extrait
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
  
  console.log('[PDF_SERVER] Final processing results:');
  console.log('[PDF_SERVER] - Has text:', hasText, `(${extractedText.length} chars)`);
  console.log('[PDF_SERVER] - Has image:', hasImage, `(${imageBase64.length} chars base64)`);
  console.log('[PDF_SERVER] - Keywords found:', foundKeywords.length);
  console.log('[PDF_SERVER] - Processing method:', processingMethod);
  console.log('[PDF_SERVER] - Detected bank:', detectedBank || 'none');
  
  const willSucceed = hasText || hasImage || foundKeywords.length > 0;
  console.log('[PDF_SERVER] - Final success decision:', willSucceed);
  
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