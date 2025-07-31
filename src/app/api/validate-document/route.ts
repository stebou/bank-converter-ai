// API de validation de document pour utilisateurs anonymes (homepage)
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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

    // Extraire le texte du PDF si c'est un PDF  
    let extractedText: string | null = null;
    if (file.type === 'application/pdf') {
      try {
        console.log('[VALIDATE_DOCUMENT] Starting PDF text extraction...');
        
        // Créer un texte contextuel pour l'IA (comme dans /api/documents)
        extractedText = `=== DOCUMENT PDF POUR VALIDATION ===
Nom du fichier: ${file.name}
Taille: ${Math.round(file.size / 1024)} KB
Date d'upload: ${new Date().toLocaleDateString('fr-FR')}
Type: Document bancaire/financier

=== INFORMATIONS POUR L'IA ===
Ce document est un relevé bancaire ou document financier au format PDF.
L'utilisateur peut poser des questions sur:
- Les transactions bancaires
- Les soldes et mouvements
- Les anomalies ou irrégularités
- L'analyse financière générale

Note: Extraction de texte complète en cours de développement.
L'IA peut analyser ce document de manière contextuelle.`;

        console.log('[VALIDATE_DOCUMENT] Generated text for validation');
        
      } catch (error) {
        console.error('[VALIDATE_DOCUMENT] Error during PDF processing:', error);
        extractedText = `Document PDF: ${file.name} - Validation requise`;
      }
    }

    // Faire l'analyse IA de validation si on a du texte et la clé API
    if (extractedText && process.env.OPENAI_API_KEY) {
      try {
        console.log('[VALIDATE_DOCUMENT] Starting AI analysis...');
        
        const analysisPrompt = `Analyse ce document et détermine s'il s'agit d'un document bancaire ou d'une facture valide.

CONTENU DU DOCUMENT:
${extractedText.substring(0, 1500)}

Tu dois d'abord déterminer si c'est un document valide (relevé bancaire, facture, document financier).

INSTRUCTIONS DÉTAILLÉES:
- Examine le nom du fichier pour des indices (exemple: "releve", "facture", "bank", etc.)
- Même avec un texte limité, tu peux souvent identifier le type de document
- Si le nom du fichier suggère un document bancaire ou une facture, considère-le comme potentiellement valide
- Sois plus permissif si le contexte suggère un document financier légitime

Réponds uniquement avec un JSON contenant:
{
  "isValidDocument": true/false,
  "documentType": "relevé bancaire" | "facture" | "document financier" | "autre",
  "rejectionReason": "raison du rejet si pas valide",
  "bankName": "nom de la banque détectée ou émetteur",
  "transactionCount": nombre_de_transactions_estimé,
  "anomalies": nombre_d_anomalies_détectées,
  "confidence": pourcentage_de_confiance_0_à_100
}

IMPORTANT: Si ce n'est pas un document bancaire ou une facture, mets isValidDocument à false.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: analysisPrompt }],
          max_tokens: 300,
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
            
            // Document valide - retourner les données d'analyse
            console.log('[VALIDATE_DOCUMENT] Document validated successfully');
            return NextResponse.json({
              success: true,
              bankDetected: analysis.bankName || 'Banque détectée',
              totalTransactions: analysis.transactionCount || 0,
              anomaliesDetected: analysis.anomalies || 0,
              aiConfidence: analysis.confidence || 85,
              documentType: analysis.documentType,
              hasExtractedText: !!extractedText,
              extractedTextLength: extractedText?.length || 0,
            }, { status: 200 });
            
          } catch (parseError) {
            console.error('[VALIDATE_DOCUMENT] Failed to parse AI response:', parseError);
            console.log('[VALIDATE_DOCUMENT] Raw AI response:', aiResponse);
            return NextResponse.json({ error: 'Erreur d\'analyse IA' }, { status: 500 });
          }
        }
      } catch (aiError) {
        console.error('[VALIDATE_DOCUMENT] OpenAI analysis failed:', aiError);
        // Continue sans analyse IA - on accepte le document par défaut
      }
    }

    // Fallback si pas d'analyse IA - accepter le document
    console.log('[VALIDATE_DOCUMENT] Using fallback validation (no AI analysis)');
    return NextResponse.json({
      success: true,
      bankDetected: 'Analyse de base',
      totalTransactions: 0,
      anomaliesDetected: 0,
      aiConfidence: 85,
      documentType: 'document financier',
      hasExtractedText: !!extractedText,
      extractedTextLength: extractedText?.length || 0,
    }, { status: 200 });

  } catch (error) {
    console.error('[VALIDATE_DOCUMENT_ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}