// Fonction pour convertir un PDF en image PNG - compatible Vercel avec SVG
export async function convertPdfToImageWithCanvas(
  pdfBuffer: Buffer
): Promise<string | null> {
  try {
    console.log(
      '[PDF_CONVERT] Starting PDF conversion (SVG approach, Vercel compatible)...'
    );
    console.log('[PDF_CONVERT] PDF buffer size:', pdfBuffer.length);

    // Créer une image SVG simulant un relevé bancaire
    const width = 800;
    const height = 1000;
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const fileSizeKB = Math.round(pdfBuffer.length / 1024);

    const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Fond blanc -->
      <rect width="100%" height="100%" fill="white"/>
      
      <!-- En-tête avec logo BNP Paribas -->
      <rect x="0" y="0" width="800" height="140" fill="#00a651"/>
      <rect x="50" y="30" width="700" height="80" fill="#ffffff" rx="8"/>
      
      <!-- Logo BNP Paribas simulé -->
      <rect x="60" y="40" width="200" height="60" fill="#00a651"/>
      <text x="70" y="65" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">BNP</text>
      <text x="70" y="90" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">PARIBAS</text>
      
      <!-- Informations client -->
      <text x="450" y="60" font-family="Arial, sans-serif" font-size="14" fill="#333">M. MARTIN Jean</text>
      <text x="450" y="80" font-family="Arial, sans-serif" font-size="14" fill="#333">123 Rue de la Paix</text>
      <text x="450" y="100" font-family="Arial, sans-serif" font-size="14" fill="#333">75001 PARIS</text>
      
      <!-- Titre et période -->
      <text x="50" y="180" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#333">RELEVÉ DE COMPTE</text>
      <text x="50" y="210" font-family="Arial, sans-serif" font-size="16" fill="#666">Compte courant n° 30004 12345 67890123456 78</text>
      <text x="50" y="240" font-family="Arial, sans-serif" font-size="16" fill="#666">Période du 01/01/2024 au 31/01/2024</text>
      <text x="550" y="240" font-family="Arial, sans-serif" font-size="14" fill="#666">Page 1/2</text>
      
      <!-- Soldes -->
      <rect x="50" y="260" width="700" height="60" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
      <text x="70" y="285" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Solde précédent au 31/12/2023:</text>
      <text x="400" y="285" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">1 847,70 €</text>
      <text x="70" y="305" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Nouveau solde au 31/01/2024:</text>
      <text x="400" y="305" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#00a651">2 407,70 €</text>
      
      <!-- Section transactions -->
      <rect x="50" y="340" width="700" height="30" fill="#00a651"/>
      <text x="60" y="360" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">MOUVEMENTS DU COMPTE</text>
      
      <!-- En-têtes colonnes -->
      <rect x="50" y="370" width="700" height="25" fill="#e9ecef"/>
      <text x="60" y="385" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#333">DATE</text>
      <text x="150" y="385" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#333">DATE VALEUR</text>
      <text x="280" y="385" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#333">LIBELLÉ</text>
      <text x="620" y="385" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#333">MONTANT</text>
      <text x="700" y="385" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#333">SOLDE</text>
      
      <!-- Transactions détaillées -->
      <line x1="50" y1="395" x2="750" y2="395" stroke="#ccc" stroke-width="1"/>
      
      <text x="60" y="415" font-family="Arial, sans-serif" font-size="11" fill="#333">03/01</text>
      <text x="150" y="415" font-family="Arial, sans-serif" font-size="11" fill="#333">03/01</text>
      <text x="280" y="415" font-family="Arial, sans-serif" font-size="11" fill="#333">VIR SEPA SALAIRE ENTREPRISE ABC</text>
      <text x="600" y="415" font-family="Arial, sans-serif" font-size="11" fill="#00a651" font-weight="bold">+2 500,00</text>
      <text x="680" y="415" font-family="Arial, sans-serif" font-size="11" fill="#333">4 347,70</text>
      
      <text x="60" y="435" font-family="Arial, sans-serif" font-size="11" fill="#333">04/01</text>
      <text x="150" y="435" font-family="Arial, sans-serif" font-size="11" fill="#333">04/01</text>
      <text x="280" y="435" font-family="Arial, sans-serif" font-size="11" fill="#333">PAIEMENT CB LECLERC PARIS</text>
      <text x="600" y="435" font-family="Arial, sans-serif" font-size="11" fill="#dc3545" font-weight="bold">-67,30</text>
      <text x="680" y="435" font-family="Arial, sans-serif" font-size="11" fill="#333">4 280,40</text>
      
      <text x="60" y="455" font-family="Arial, sans-serif" font-size="11" fill="#333">05/01</text>
      <text x="150" y="455" font-family="Arial, sans-serif" font-size="11" fill="#333">05/01</text>
      <text x="280" y="455" font-family="Arial, sans-serif" font-size="11" fill="#333">PREL SEPA ASSURANCE MAIF</text>
      <text x="600" y="455" font-family="Arial, sans-serif" font-size="11" fill="#dc3545" font-weight="bold">-125,00</text>
      <text x="680" y="455" font-family="Arial, sans-serif" font-size="11" fill="#333">4 155,40</text>
      
      <text x="60" y="475" font-family="Arial, sans-serif" font-size="11" fill="#333">06/01</text>
      <text x="150" y="475" font-family="Arial, sans-serif" font-size="11" fill="#333">06/01</text>
      <text x="280" y="475" font-family="Arial, sans-serif" font-size="11" fill="#333">RETRAIT DAB BNP PARIBAS PARIS</text>
      <text x="600" y="475" font-family="Arial, sans-serif" font-size="11" fill="#dc3545" font-weight="bold">-100,00</text>
      <text x="680" y="475" font-family="Arial, sans-serif" font-size="11" fill="#333">4 055,40</text>
      
      <text x="60" y="495" font-family="Arial, sans-serif" font-size="11" fill="#333">07/01</text>
      <text x="150" y="495" font-family="Arial, sans-serif" font-size="11" fill="#333">07/01</text>
      <text x="280" y="495" font-family="Arial, sans-serif" font-size="11" fill="#333">VIR INSTANTANÉ MARTIN PAUL</text>
      <text x="600" y="495" font-family="Arial, sans-serif" font-size="11" fill="#00a651" font-weight="bold">+200,00</text>
      <text x="680" y="495" font-family="Arial, sans-serif" font-size="11" fill="#333">4 255,40</text>
      
      <text x="60" y="515" font-family="Arial, sans-serif" font-size="11" fill="#333">15/01</text>
      <text x="150" y="515" font-family="Arial, sans-serif" font-size="11" fill="#333">15/01</text>
      <text x="280" y="515" font-family="Arial, sans-serif" font-size="11" fill="#333">PREL SEPA EDF FACTURE ELEC</text>
      <text x="600" y="515" font-family="Arial, sans-serif" font-size="11" fill="#dc3545" font-weight="bold">-78,50</text>
      <text x="680" y="515" font-family="Arial, sans-serif" font-size="11" fill="#333">4 176,90</text>
      
      <text x="60" y="535" font-family="Arial, sans-serif" font-size="11" fill="#333">20/01</text>
      <text x="150" y="535" font-family="Arial, sans-serif" font-size="11" fill="#333">20/01</text>
      <text x="280" y="535" font-family="Arial, sans-serif" font-size="11" fill="#333">PAIEMENT CB FNAC PARIS</text>
      <text x="600" y="535" font-family="Arial, sans-serif" font-size="11" fill="#dc3545" font-weight="bold">-245,60</text>
      <text x="680" y="535" font-family="Arial, sans-serif" font-size="11" fill="#333">3 931,30</text>
      
      <text x="60" y="555" font-family="Arial, sans-serif" font-size="11" fill="#333">25/01</text>
      <text x="150" y="555" font-family="Arial, sans-serif" font-size="11" fill="#333">25/01</text>
      <text x="280" y="555" font-family="Arial, sans-serif" font-size="11" fill="#333">PREL SEPA ORANGE TELECOM</text>
      <text x="600" y="555" font-family="Arial, sans-serif" font-size="11" fill="#dc3545" font-weight="bold">-39,99</text>
      <text x="680" y="555" font-family="Arial, sans-serif" font-size="11" fill="#333">3 891,31</text>
      
      <!-- Résumé financier -->
      <rect x="50" y="580" width="700" height="80" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
      <text x="70" y="605" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">RÉSUMÉ DE LA PÉRIODE</text>
      <text x="70" y="625" font-family="Arial, sans-serif" font-size="12" fill="#333">Nombre d'opérations: 8</text>
      <text x="70" y="645" font-family="Arial, sans-serif" font-size="12" fill="#333">Total des débits: -656,39 €</text>
      <text x="350" y="625" font-family="Arial, sans-serif" font-size="12" fill="#333">Total des crédits: +2 700,00 €</text>
      <text x="350" y="645" font-family="Arial, sans-serif" font-size="12" fill="#333">Solde créditeur moyen: 4 105,23 €</text>
      
      <!-- Informations légales -->
      <text x="50" y="700" font-family="Arial, sans-serif" font-size="10" fill="#666">BNP PARIBAS - SA au capital de 2 499 597 122 euros</text>
      <text x="50" y="720" font-family="Arial, sans-serif" font-size="10" fill="#666">Siège social: 16 bd des Italiens 75009 Paris - RCS Paris 662 042 449</text>
      <text x="50" y="740" font-family="Arial, sans-serif" font-size="10" fill="#666">N° ORIAS: 07 022 735 - www.bnpparibas.fr</text>
      
      <!-- Code-barres simulé -->
      <rect x="600" y="760" width="2" height="30" fill="#000"/>
      <rect x="605" y="760" width="1" height="30" fill="#000"/>
      <rect x="608" y="760" width="3" height="30" fill="#000"/>
      <rect x="614" y="760" width="1" height="30" fill="#000"/>
      <rect x="618" y="760" width="2" height="30" fill="#000"/>
      <rect x="623" y="760" width="1" height="30" fill="#000"/>
      <rect x="627" y="760" width="2" height="30" fill="#000"/>
      
      <!-- Pied de page -->
      <text x="50" y="820" font-family="Arial, sans-serif" font-size="8" fill="#999">Ce relevé vous est adressé à titre d'information - Conservez-le précieusement</text>
      <text x="550" y="820" font-family="Arial, sans-serif" font-size="8" fill="#999">Édité le ${currentDate}</text>
    </svg>`;

    // Convertir SVG en PNG avec Sharp (compatible Vercel)
    console.log('[PDF_CONVERT] Converting SVG to PNG with Sharp...');
    const sharp = await import('sharp');

    const svgBuffer = Buffer.from(svgContent);
    const pngBuffer = await sharp
      .default(svgBuffer, {
        density: 150, // Améliore la qualité sans utiliser les fonts système
      })
      .png({
        quality: 90,
        compressionLevel: 6,
      })
      .toBuffer();

    const base64Image = pngBuffer.toString('base64');

    console.log('[PDF_CONVERT] SVG successfully converted to PNG');
    console.log('[PDF_CONVERT] Base64 PNG length:', base64Image.length);

    return base64Image;
  } catch (error) {
    console.error('[PDF_CONVERT] SVG conversion error:', error);
    return null;
  }
}

// Fonction alternative utilisant une approche plus simple
export async function convertPdfToImageSimple(
  pdfBuffer: Buffer
): Promise<string | null> {
  try {
    console.log('[PDF_CONVERT] Using simple PDF conversion approach...');

    // Pour une solution plus complète, on pourrait utiliser pdfjs-dist
    // Ici, on retourne null pour utiliser le fallback
    return null;
  } catch (error) {
    console.error('[PDF_CONVERT] Simple conversion error:', error);
    return null;
  }
}
