import { promises as fs } from 'fs';
import path from 'path';

// Fonction pour convertir un PDF en image base64
export async function convertPdfToImage(pdfBuffer: Buffer): Promise<string | null> {
  try {
    console.log('[PDF_TO_IMAGE] Starting PDF conversion...');
    console.log('[PDF_TO_IMAGE] PDF buffer size:', pdfBuffer.length);
    
    // Méthode 1: Essayer avec pdf-poppler (nécessite poppler-utils installé)
    try {
      const pdf = await import('pdf-poppler');
      
      // Créer un fichier temporaire
      const tempDir = '/tmp';
      const tempPdfPath = path.join(tempDir, `temp-${Date.now()}.pdf`);
      
      // Écrire le PDF
      await fs.writeFile(tempPdfPath, pdfBuffer);
      
      // Configuration pour la conversion
      const options = {
        format: 'jpeg',
        out_dir: tempDir,
        out_prefix: `page-${Date.now()}`,
        page: 1, // Première page seulement
        single_file: true,
        resolution: 300 // DPI
      };
      
      console.log('[PDF_TO_IMAGE] Converting with pdf-poppler...');
      const result = await pdf.convert(tempPdfPath, options);
      
      if (result && result.length > 0) {
        // Lire l'image générée
        const imagePath = result[0]; // Premier fichier généré
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        // Nettoyer les fichiers temporaires
        await fs.unlink(tempPdfPath).catch(() => {});
        await fs.unlink(imagePath).catch(() => {});
        
        console.log('[PDF_TO_IMAGE] Conversion successful with pdf-poppler');
        return base64Image;
      }
    } catch (popplerError) {
      console.log('[PDF_TO_IMAGE] pdf-poppler failed:', popplerError);
    }
    
    // Méthode 2: Fallback avec pdf2pic (nécessite GraphicsMagick/ImageMagick)
    try {
      const pdf2pic = await import('pdf2pic');
      const tempDir = '/tmp';
      const tempPdfPath = path.join(tempDir, `temp-${Date.now()}.pdf`);
      
      await fs.writeFile(tempPdfPath, pdfBuffer);
      
      const convert = pdf2pic.default.fromPath(tempPdfPath, {
        density: 300,
        saveFilename: "page",
        savePath: tempDir,
        format: "jpeg",
        width: 2048,
        height: 2048
      });
      
      console.log('[PDF_TO_IMAGE] Converting with pdf2pic...');
      const result = await convert(1);
      
      if (result && result.path) {
        const imageBuffer = await fs.readFile(result.path);
        const base64Image = imageBuffer.toString('base64');
        
        await fs.unlink(tempPdfPath).catch(() => {});
        await fs.unlink(result.path).catch(() => {});
        
        console.log('[PDF_TO_IMAGE] Conversion successful with pdf2pic');
        return base64Image;
      }
    } catch (pdf2picError) {
      console.log('[PDF_TO_IMAGE] pdf2pic failed:', pdf2picError);
    }
    
    // Si toutes les méthodes échouent, retourner null pour utiliser le fallback
    console.log('[PDF_TO_IMAGE] All conversion methods failed, using text-based fallback');
    return null;
    
  } catch (error) {
    console.error('[PDF_TO_IMAGE] Error converting PDF:', error);
    return null;
  }
}