import { PDFDocument } from 'pdf-lib';

// Fonction pour convertir un PDF en image base64 (compatible Vercel)
export async function convertPdfToImage(
  pdfBuffer: Buffer
): Promise<string | null> {
  try {
    console.log('[PDF_TO_IMAGE] Starting PDF conversion with pdf-lib...');
    console.log('[PDF_TO_IMAGE] PDF buffer size:', pdfBuffer.length);

    // Utiliser pdf-lib pour extraire la première page
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();

    if (pages.length === 0) {
      console.log('[PDF_TO_IMAGE] No pages found in PDF');
      return null;
    }

    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    console.log('[PDF_TO_IMAGE] PDF page dimensions:', { width, height });

    // Créer un nouveau document PDF avec seulement la première page
    const singlePageDoc = await PDFDocument.create();
    const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [0]);
    singlePageDoc.addPage(copiedPage);

    // Convertir en bytes pour le rendu
    const pdfBytes = await singlePageDoc.save();

    // Pour l'instant, on retourne une représentation base64 du PDF
    // (GPT-4 Vision peut analyser des PDFs directement)
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    console.log('[PDF_TO_IMAGE] PDF converted to base64 successfully');
    console.log('[PDF_TO_IMAGE] Base64 length:', base64Pdf.length);

    return base64Pdf;
  } catch (error) {
    console.error('[PDF_TO_IMAGE] Error converting PDF with pdf-lib:', error);
    return null;
  }
}
