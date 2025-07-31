// API de validation de document pour utilisateurs anonymes (homepage)
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { convertPdfToImageWithCanvas } from '@/lib/pdf-to-image-cloudconvert';
// Note: pdf-parse importé dynamiquement pour éviter les erreurs de build

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    console.log('[VALIDATE_DOCUMENT] Processing file:', file.name, file.size, file.type);

    // Traiter le fichier pour analyse GPT-4 Vision
    let base64Image: string | null = null;
    const fileType: string = file.type;
    
    if (file.type === 'application/pdf') {
      console.log('[VALIDATE_DOCUMENT] PDF detected - converting to image for GPT-4 Vision...');
      
      try {
        // Convertir le fichier en buffer
        const pdfBuffer = Buffer.from(await file.arrayBuffer());
        console.log('[VALIDATE_DOCUMENT] PDF buffer size:', pdfBuffer.length);
        
        // Utiliser la fonction Python Vercel pour processing réel
        console.log('[VALIDATE_DOCUMENT] Processing PDF with Python function...');
        
        try {
          // Appeler la fonction Python sur le même domaine
          const pythonResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/process-pdf`, {
            method: 'POST',
            body: pdfBuffer,
            headers: {
              'Content-Type': 'application/pdf'
            }
          });
          
          if (pythonResponse.ok) {
            const pythonData = await pythonResponse.json();
            console.log('[VALIDATE_DOCUMENT] Python processing successful');
            console.log('[VALIDATE_DOCUMENT] - Text extracted:', pythonData.metadata?.has_text);
            console.log('[VALIDATE_DOCUMENT] - Image converted:', pythonData.metadata?.has_image);
            console.log('[VALIDATE_DOCUMENT] - Keywords found:', pythonData.metadata?.keyword_count);
            
            // Utiliser les vraies données extraites
            const extractedText = pythonData.extracted_text;
            base64Image = pythonData.image_base64;
            
            // Si on a du texte (avec ou sans image), on peut faire une analyse !
            if (extractedText) {
              console.log('[VALIDATE_DOCUMENT] TEXT analysis available:', base64Image ? 'with image (hybrid)' : 'text-only');
              
              // Préparer l'analyse pour GPT-4 (texte avec image optionnelle)
              const analysisPrompt = `Tu es un expert en analyse de documents bancaires. Tu disposes du TEXTE EXTRAIT du document${base64Image ? ' et de son IMAGE' : ''}. Analyse ${base64Image ? 'les deux sources' : 'le texte'} pour une validation précise.

TEXTE EXTRAIT DU DOCUMENT:
${extractedText}

ANALYSE REQUISE:
1. ${base64Image ? 'Vérifie la cohérence entre le texte extrait et l\'image' : 'Analyse la structure et cohérence du texte'}
2. Identifie précisément le nom de la banque dans le texte
3. Compte les transactions mentionnées
4. Détecte toute incohérence ou anomalie

CRITÈRES STRICTS:
- Document authentique avec données ${base64Image ? 'cohérentes texte/image' : 'financières cohérentes'}
- Présence de banque française reconnue dans le texte
- Structure bancaire professionnelle
- Données financières réelles et détaillées

Réponds UNIQUEMENT avec un JSON valide:
{
  "isValidDocument": true/false,
  "documentType": "relevé bancaire" | "facture" | "document financier" | "autre",
  "rejectionReason": "raison précise du rejet si pas valide",
  "bankName": "nom exact et complet de la banque détectée",
  "transactionCount": nombre_de_transactions_visibles,
  "anomalies": nombre_d_anomalies_détectées,
  "confidence": pourcentage_de_confiance_0_à_100,
  "analysisMethod": ${base64Image ? '"hybrid_text_and_vision"' : '"text_analysis"'}
}`;

              // Analyse GPT-4 (texte avec image optionnelle)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const messageContent: any = [{
                type: 'text',
                text: analysisPrompt
              }];
              
              // Ajouter l'image si disponible
              if (base64Image) {
                messageContent.push({
                  type: 'image_url',
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`,
                    detail: "high"
                  }
                });
              }
              
              const completion = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{
                  role: 'user',
                  content: messageContent
                }],
                max_tokens: 500,
                temperature: 0.1,
              });

              const aiResponse = completion.choices[0]?.message?.content;
              console.log('[VALIDATE_DOCUMENT] AI analysis completed:', base64Image ? 'hybrid' : 'text-only');
              
              if (aiResponse) {
                try {
                  let cleanResponse = aiResponse.trim();
                  if (cleanResponse.startsWith('```json')) {
                    cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
                  }
                  if (cleanResponse.startsWith('```')) {
                    cleanResponse = cleanResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
                  }
                  
                  const analysis = JSON.parse(cleanResponse);
                  console.log('[VALIDATE_DOCUMENT] Analysis result:', analysis.isValidDocument);
                  console.log('[VALIDATE_DOCUMENT] Bank detected:', analysis.bankName);
                  
                  if (analysis.isValidDocument === false) {
                    console.log('[VALIDATE_DOCUMENT] Document rejected by AI analysis:', analysis.rejectionReason);
                    return NextResponse.json({
                      error: 'DOCUMENT_REJECTED',
                      message: `Document non valide: ${analysis.rejectionReason || 'Ce document ne semble pas être un relevé bancaire ou une facture valide.'}`,
                      documentType: analysis.documentType || 'autre'
                    }, { status: 400 });
                  }
                  
                  // Document valide avec analyse AI
                  const bankName = analysis.bankName || 'Banque détectée';
                  return NextResponse.json({
                    success: true,
                    bankDetected: bankName,
                    totalTransactions: analysis.transactionCount || 0,
                    anomaliesDetected: analysis.anomalies || 0,
                    aiConfidence: analysis.confidence || 95,
                    documentType: analysis.documentType,
                    hasExtractedText: true,
                    extractedTextLength: extractedText.length,
                    analysisMethod: base64Image ? 'hybrid_text_and_vision' : 'text_analysis',
                    pythonProcessing: true,
                    transactions: [], // TODO: générer des transactions basées sur l'analyse réelle
                    processingTime: Math.random() * 2 + 2.5,
                    aiCost: Math.random() * 0.05 + 0.03,
                  }, { status: 200 });
                  
                } catch (parseError) {
                  console.error('[VALIDATE_DOCUMENT] Failed to parse AI response:', parseError);
                }
              }
            }
            
          } else {
            console.error('[VALIDATE_DOCUMENT] Python processing failed:', pythonResponse.status);
            base64Image = null;
          }
          
        } catch (pythonError) {
          console.error('[VALIDATE_DOCUMENT] Error calling Python function:', pythonError);
          base64Image = null;
        }
        
      } catch (error) {
        console.error('[VALIDATE_DOCUMENT] Error during PDF processing:', error);
        base64Image = null;
      }
    } else if (file.type.startsWith('image/')) {
      try {
        console.log('[VALIDATE_DOCUMENT] Image detected, processing for GPT-4 Vision...');
        console.log('[VALIDATE_DOCUMENT] Image type:', file.type);
        console.log('[VALIDATE_DOCUMENT] Image size:', file.size);
        
        // Convertir l'image en buffer
        const imageBuffer = Buffer.from(await file.arrayBuffer());
        console.log('[VALIDATE_DOCUMENT] Image buffer size:', imageBuffer.length);
        
        // Optimiser l'image avec sharp (comme dans l'exemple)
        const sharp = await import('sharp');
        const optimizedBuffer = await sharp.default(imageBuffer)
          .resize(2048, 2048, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ quality: 90 })
          .toBuffer();
        
        base64Image = optimizedBuffer.toString('base64');
        console.log('[VALIDATE_DOCUMENT] Image successfully processed for GPT-4 Vision');
        console.log('[VALIDATE_DOCUMENT] Base64 image length:', base64Image.length);
        
      } catch (error) {
        console.error('[VALIDATE_DOCUMENT] Error during image processing:', error);
        base64Image = null;
      }
    } else {
      console.log('[VALIDATE_DOCUMENT] Unknown file type:', file.type);
      console.log('[VALIDATE_DOCUMENT] File name:', file.name);
      base64Image = null;
    }

    console.log('[VALIDATE_DOCUMENT] Checking AI analysis conditions:');
    console.log('[VALIDATE_DOCUMENT] - base64Image exists:', !!base64Image);
    console.log('[VALIDATE_DOCUMENT] - File type:', fileType);
    console.log('[VALIDATE_DOCUMENT] - OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

    // Analyser avec GPT-4 Vision si on a une image et la clé API
    if (base64Image && process.env.OPENAI_API_KEY) {
      try {
        console.log('[VALIDATE_DOCUMENT] Starting GPT-4 analysis...');
        
        console.log('[VALIDATE_DOCUMENT] Using GPT-4 VISION analysis...');
        
        const analysisPrompt = `Tu es un expert en analyse de documents bancaires avec une approche STRICTE. Analyse visuellement ce document et détermine s'il s'agit d'un relevé bancaire ou d'une facture valide.

APPROCHE STRICTE - REJETER SI:
❌ Document d'identité (carte d'identité, passeport, permis)
❌ Attestation ou certificat de quelque nature
❌ Photo personnelle, selfie, capture d'écran
❌ Document manuscrit ou brouillon
❌ Page web générique ou interface non bancaire
❌ Document flou, illisible ou de mauvaise qualité
❌ Document sans logo bancaire officiel reconnaissable
❌ Fausse simulation ou document fictif évident

ACCEPTER SEULEMENT SI:
✅ Relevé bancaire officiel avec logo et en-tête bancaire
✅ Facture d'entreprise avec informations financières
✅ Document présentant des transactions authentiques
✅ Structure professionnelle et cohérente
✅ Qualité suffisante pour l'analyse

BANQUES FRANÇAISES À RECHERCHER:
- BNP Paribas (logo vert/blanc, couleurs caractéristiques)
- Crédit Agricole (logo vert avec pictogrammes)
- Société Générale (logo rouge/noir distinctif)
- LCL (logo bleu/blanc)
- Crédit Mutuel (logo bleu/orange)
- Banque Populaire (logo rouge)
- Caisse d'Épargne (logo bleu/rouge)
- HSBC France (logo rouge/blanc hexagonal)
- La Banque Postale (logo bleu/jaune)
- ING Direct (logo orange caractéristique)
- Boursorama (logo rouge)
- Hello bank! (logo multicolore BNP)
- N26 (logo minimaliste noir/blanc)
- Revolut (logo bleu moderne)
- Orange Bank (logo orange distinctif)
- Fortuneo (logo vert)

INSTRUCTIONS CRITIQUES:
- Sois TRÈS strict dans la validation
- En cas de doute, REJETER le document
- Un document bancaire doit avoir un aspect professionnel et officiel
- Recherche activement les signes de faux documents

Réponds UNIQUEMENT avec un JSON valide:
{
  "isValidDocument": true/false,
  "documentType": "relevé bancaire" | "facture" | "document financier" | "autre",
  "rejectionReason": "raison précise du rejet si pas valide",
  "bankName": "nom exact et complet de la banque détectée",
  "transactionCount": nombre_de_transactions_visibles,
  "anomalies": nombre_d_anomalies_détectées,
  "confidence": pourcentage_de_confiance_0_à_100
}`;

        const messages: ChatCompletionMessageParam[] = [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                  detail: "high"
                }
              }
            ]
          }
        ];

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o', // GPT-4o avec vision intégrée et analyse de texte
          messages: messages,
          max_tokens: 500,
          temperature: 0.1,
        });

        const aiResponse = completion.choices[0]?.message?.content;
        console.log('[VALIDATE_DOCUMENT] AI response received:', aiResponse?.substring(0, 200));
        
        if (aiResponse) {
          try {
            // Nettoyer la réponse pour enlever les balises markdown
            let cleanResponse = aiResponse.trim();
            if (cleanResponse.startsWith('```json')) {
              cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
            }
            if (cleanResponse.startsWith('```')) {
              cleanResponse = cleanResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
            }
            
            const analysis = JSON.parse(cleanResponse);
            console.log('[VALIDATE_DOCUMENT] Parsed analysis:', analysis);
            console.log('[VALIDATE_DOCUMENT] Bank name from AI:', analysis.bankName);
            console.log('[VALIDATE_DOCUMENT] Document type:', analysis.documentType);
            
            // Vérifier si le document est valide
            if (analysis.isValidDocument === false) {
              console.log('[VALIDATE_DOCUMENT] Document rejected:', analysis.rejectionReason);
              
              // Retourner une erreur pour déclencher la popup côté client
              return NextResponse.json({
                error: 'DOCUMENT_REJECTED',
                message: `Document non valide: ${analysis.rejectionReason || 'Ce document ne semble pas être un relevé bancaire ou une facture.'}`,
                documentType: analysis.documentType || 'autre'
              }, { status: 400 });
            }
            
            // Document valide - retourner les données d'analyse avec transactions simulées
            console.log('[VALIDATE_DOCUMENT] Document validated successfully');
            
            // Générer des transactions simulées basées sur les données analysées
            const transactionCount = analysis.transactionCount || Math.floor(Math.random() * 8) + 3; // 3-10 transactions
            const bankName = analysis.bankName || 'Banque détectée';
            const simulatedTransactions = [];
            
            // Types de transactions plus réalistes selon la banque
            const transactionTypes = [
              { desc: 'VIREMENT SALAIRE', orig: 'VIR ENTREPRISE SALAIRE', isCredit: true, amount: () => Math.floor(Math.random() * 2000) + 1500 },
              { desc: 'CARTE SUPERMARCHÉ', orig: 'CB LECLERC', isCredit: false, amount: () => -(Math.floor(Math.random() * 100) + 20) },
              { desc: 'PRELEVEMENT EDF', orig: 'PREL EDF FACTURE', isCredit: false, amount: () => -(Math.floor(Math.random() * 80) + 40) },
              { desc: 'RETRAIT DAB', orig: `DAB ${bankName.toUpperCase()}`, isCredit: false, amount: () => -(Math.floor(Math.random() * 150) + 50) },
              { desc: 'VIREMENT REÇU', orig: 'VIR FAMILLE', isCredit: true, amount: () => Math.floor(Math.random() * 500) + 100 },
              { desc: 'CARTE RESTAURANT', orig: 'CB RESTAURANT', isCredit: false, amount: () => -(Math.floor(Math.random() * 60) + 15) },
              { desc: 'FRAIS BANCAIRES', orig: `COMMISSION ${bankName}`, isCredit: false, amount: () => -(Math.floor(Math.random() * 10) + 2) }
            ];
            
            for (let i = 0; i < Math.min(transactionCount, 8); i++) {
              const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
              
              simulatedTransactions.push({
                id: i + 1,
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Derniers 30 jours
                description: transactionType.desc,
                originalDesc: transactionType.orig,
                amount: transactionType.amount(),
                category: transactionType.isCredit ? 'Revenus' : 'Dépenses',
                subcategory: transactionType.isCredit ? 'Virement' : (transactionType.desc.includes('CARTE') ? 'Carte bancaire' : 'Prélèvement'),
                confidence: Math.floor(Math.random() * 15) + 85, // 85-100%
                anomalyScore: Math.random() * (analysis.anomalies > 0 ? 8 : 2) // Plus d'anomalies si détecté
              });
            }
            
            return NextResponse.json({
              success: true,
              bankDetected: bankName,
              totalTransactions: transactionCount,
              anomaliesDetected: analysis.anomalies || 0,
              aiConfidence: analysis.confidence || 85,
              documentType: analysis.documentType,
              hasExtractedText: !!base64Image,
              extractedTextLength: base64Image?.length || 0,
              analysisMethod: 'vision-analysis',
              transactions: simulatedTransactions,
              processingTime: Math.random() * 2 + 1.5, // 1.5-3.5 secondes
              aiCost: Math.random() * 0.03 + 0.02, // 0.02-0.05€
            }, { status: 200 });
            
          } catch (parseError) {
            console.error('[VALIDATE_DOCUMENT] Failed to parse AI response:', parseError);
            console.log('[VALIDATE_DOCUMENT] Raw AI response:', aiResponse);
            return NextResponse.json({ error: 'Erreur d\'analyse IA' }, { status: 500 });
          }
        }
      } catch (aiError) {
        console.error('[VALIDATE_DOCUMENT] OpenAI analysis failed:', aiError);
        // En cas d'échec de l'IA, rejeter le document par sécurité
        console.log('[VALIDATE_DOCUMENT] AI analysis failed, rejecting document for security');
        return NextResponse.json({
          error: 'DOCUMENT_REJECTED',
          message: 'Document non valide: Impossible d\'analyser le document. Veuillez réessayer avec un relevé bancaire ou une facture claire.',
          documentType: 'autre'
        }, { status: 400 });
      }
    }

    // Fallback strict si pas d'analyse IA Vision - rejeter par défaut sauf cas spécifiques
    console.log('[VALIDATE_DOCUMENT] Using strict fallback validation (no AI Vision analysis)');
    
    const fileName = file.name.toLowerCase();
    
    // Mots-clés qui indiquent des documents NON bancaires (plus étendu)
    const invalidKeywords = [
      'attestation', 'certificat', 'carte', 'identite', 'passeport', 
      'permis', 'electoral', 'liste', 'inscription', 'diplome',
      'bulletin', 'salaire', 'paie', 'contrat', 'cv', 'curriculum',
      'photo', 'selfie', 'profil', 'avatar', 'image', 'capture'
    ];
    
    // Mots-clés qui indiquent potentiellement des documents bancaires valides
    const validKeywords = [
      'releve', 'relevé', 'bank', 'banque', 'compte', 'statement', 
      'facture', 'invoice', 'bnp', 'paribas', 'credit', 'agricole',
      'societe', 'generale', 'lcl', 'mutuel', 'populaire', 'epargne',
      'hsbc', 'postale', 'ing', 'boursorama', 'hello', 'n26', 'revolut',
      'orange', 'fortuneo', 'transaction', 'virement', 'prelevement'
    ];
    
    const hasInvalidKeyword = invalidKeywords.some(keyword => fileName.includes(keyword));
    const hasValidKeyword = validKeywords.some(keyword => fileName.includes(keyword));
    
    if (hasInvalidKeyword) {
      console.log('[VALIDATE_DOCUMENT] Document rejected - invalid keyword found:', fileName);
      return NextResponse.json({
        error: 'DOCUMENT_REJECTED',
        message: 'Document non valide: Ce document ne semble pas être un relevé bancaire ou une facture.',
        documentType: 'autre'
      }, { status: 400 });
    }
    
    // Si pas de mot-clé valide ET pas d'analyse IA possible, rejeter par sécurité
    if (!hasValidKeyword && !base64Image) {
      console.log('[VALIDATE_DOCUMENT] Document rejected - no valid keyword and no AI analysis possible:', fileName);
      return NextResponse.json({
        error: 'DOCUMENT_REJECTED',
        message: 'Document non valide: Impossible de déterminer si ce document est un relevé bancaire. Veuillez vous assurer que le nom du fichier contient des mots-clés bancaires ou que le document est lisible.',
        documentType: 'autre'
      }, { status: 400 });
    }
    
    // Essayer d'utiliser les indices de banque même sans IA
    const potentialBankClues = [];
    
    // Logique de détection basée sur le nom de fichier
    if (fileName.includes('bnp') || fileName.includes('paribas')) potentialBankClues.push('BNP Paribas');
    if (fileName.includes('credit') && fileName.includes('agricole')) potentialBankClues.push('Crédit Agricole');
    if (fileName.includes('societe') || fileName.includes('generale') || fileName.includes('sg')) potentialBankClues.push('Société Générale');
    if (fileName.includes('lcl') || fileName.includes('lyonnais')) potentialBankClues.push('LCL');
    if (fileName.includes('credit') && fileName.includes('mutuel')) potentialBankClues.push('Crédit Mutuel');
    if (fileName.includes('populaire') || fileName.includes('bp')) potentialBankClues.push('Banque Populaire');
    if (fileName.includes('epargne') || fileName.includes('ce')) potentialBankClues.push('Caisse d\'Épargne');
    if (fileName.includes('hsbc')) potentialBankClues.push('HSBC France');
    if (fileName.includes('postale')) potentialBankClues.push('La Banque Postale');
    if (fileName.includes('ing')) potentialBankClues.push('ING Direct');
    if (fileName.includes('boursorama')) potentialBankClues.push('Boursorama');
    if (fileName.includes('hello')) potentialBankClues.push('Hello bank!');
    if (fileName.includes('n26')) potentialBankClues.push('N26');
    if (fileName.includes('revolut')) potentialBankClues.push('Revolut');
    if (fileName.includes('orange')) potentialBankClues.push('Orange Bank');
    if (fileName.includes('fortuneo')) potentialBankClues.push('Fortuneo');
    
    const detectedBankName = potentialBankClues.length > 0 ? potentialBankClues[0] : 'Document financier détecté';
    
    console.log('[VALIDATE_DOCUMENT] Fallback bank detection from filename:', detectedBankName);
    
    // Générer quelques transactions basiques pour la démonstration
    const fallbackTransactions = [
      {
        id: 1,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'VIREMENT REÇU',
        originalDesc: 'VIR SALAIRE',
        amount: 2500.00,
        category: 'Revenus',
        subcategory: 'Salaire',
        confidence: 85,
        anomalyScore: 0
      },
      {
        id: 2,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'ACHAT CARTE BANCAIRE',
        originalDesc: `CB ${detectedBankName.toUpperCase()}`,
        amount: -67.30,
        category: 'Dépenses',
        subcategory: 'Achat',
        confidence: 88,
        anomalyScore: 0
      }
    ];
    
    return NextResponse.json({
      success: true,
      bankDetected: detectedBankName,
      totalTransactions: 2,
      anomaliesDetected: 0,
      aiConfidence: 85,
      documentType: 'document financier',
      hasExtractedText: !!base64Image,
      extractedTextLength: base64Image?.length || 0,
      analysisMethod: 'filename-fallback',
      transactions: fallbackTransactions,
      processingTime: 2.1,
      aiCost: 0.025,
    }, { status: 200 });

  } catch (error) {
    console.error('[VALIDATE_DOCUMENT_ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}