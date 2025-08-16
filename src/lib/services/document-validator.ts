// Service centralisé pour la validation de documents avec IA
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface DocumentAnalysis {
  isValidDocument: boolean;
  documentType: string;
  rejectionReason?: string;
  bankName: string;
  transactionCount: number;
  anomalies: number;
  confidence: number;
  analysisMethod: string;
}

export interface DocumentValidationResult {
  success: boolean;
  analysis?: DocumentAnalysis;
  error?: string;
}

/**
 * Valide un document financier avec GPT-4 Vision ou texte seul
 */
export async function validateDocument(
  extractedText: string,
  imageBase64?: string
): Promise<DocumentValidationResult> {
  console.log('[DOCUMENT_VALIDATOR] Starting document validation...');
  console.log('[DOCUMENT_VALIDATOR] Text length:', extractedText.length);
  console.log('[DOCUMENT_VALIDATOR] Has image:', !!imageBase64);

  try {
    const analysisPrompt = `Tu es un expert en analyse de documents financiers avec une approche TRÈS PERMISSIVE. Tu disposes du TEXTE EXTRAIT du document${imageBase64 ? ' et de son IMAGE' : ''}. Ton objectif est d'ACCEPTER le maximum de documents financiers légitimes.

TEXTE EXTRAIT DU DOCUMENT:
${extractedText}

APPROCHE PERMISSIVE - ACCEPTER SI:
✅ Le document contient des montants en euros (€) ou des chiffres financiers
✅ Il y a des dates qui pourraient être des transactions
✅ Le document mentionne des termes financiers (compte, solde, virement, etc.)
✅ Il ressemble à un document bancaire ou financier même sans logo visible
✅ Le nom de banque n'est pas obligatoire - accepter si c'est un document financier
✅ Les relevés peuvent être dans différents formats (PDF, scan, photo)
✅ Même les documents partiellement lisibles peuvent être valides

REJETER SEULEMENT SI:
❌ C'est clairement un document d'identité (carte ID, passeport, permis)
❌ C'est manifestement une photo personnelle ou un selfie
❌ Le document est complètement illisible ou corrompu
❌ Il n'y a aucun élément financier visible (pas de montants, dates de transactions)

INSTRUCTIONS ESSENTIELLES:
- PRIORISE L'ACCEPTATION des documents qui pourraient être financiers
- Un relevé bancaire PEUT ne pas avoir le nom de la banque visible (scan partiel, etc.)
- ACCEPTE même si le format n'est pas parfait
- En cas de doute, ACCEPTE le document
- Les documents financiers peuvent avoir différentes présentations

Réponds UNIQUEMENT avec un JSON valide:
{
  "isValidDocument": true/false,
  "documentType": "relevé bancaire" | "facture" | "document financier" | "autre",
  "rejectionReason": "raison précise du rejet si pas valide",
  "bankName": "nom de la banque détectée ou 'Document Financier' si non visible",
  "transactionCount": nombre_de_transactions_visibles,
  "anomalies": nombre_d_anomalies_détectées,
  "confidence": pourcentage_de_confiance_0_à_100,
  "analysisMethod": ${imageBase64 ? '"hybrid_text_and_vision"' : '"text_analysis_integrated"'}
}`;

    // Préparer le contenu du message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messageContent: any[] = [
      {
        type: 'text',
        text: analysisPrompt,
      },
    ];

    // Ajouter l'image si disponible
    if (imageBase64 && imageBase64.length > 100) {
      messageContent.push({
        type: 'image_url',
        image_url: {
          url: `data:image/png;base64,${imageBase64}`,
          detail: 'high',
        },
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: messageContent,
        },
      ],
      max_tokens: 500,
      temperature: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    console.log('[DOCUMENT_VALIDATOR] AI analysis completed');

    if (aiResponse) {
      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse
          .replace(/```json\s*/, '')
          .replace(/```\s*$/, '');
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse
          .replace(/```\s*/, '')
          .replace(/```\s*$/, '');
      }

      const analysis = JSON.parse(cleanResponse) as DocumentAnalysis;
      console.log(
        '[DOCUMENT_VALIDATOR] Analysis result:',
        analysis.isValidDocument
      );
      console.log('[DOCUMENT_VALIDATOR] Bank detected:', analysis.bankName);

      return {
        success: true,
        analysis,
      };
    }

    return {
      success: false,
      error: 'No response from AI analysis',
    };
  } catch (error) {
    console.error('[DOCUMENT_VALIDATOR] Analysis failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validation spécialisée pour les images avec GPT-4 Vision
 */
export async function validateImageDocument(
  imageBase64: string,
  fileType: string
): Promise<DocumentValidationResult> {
  console.log('[DOCUMENT_VALIDATOR] Starting image validation...');

  try {
    const analysisPrompt = `Tu es un expert comptable spécialisé dans l'analyse de documents financiers.

ANALYSE cette image de document financier et détermine :

1. S'il s'agit d'un document financier valide (relevé bancaire, facture, reçu, etc.)
2. Le type exact de document
3. La banque ou institution si visible
4. Le nombre approximatif de transactions visibles
5. Toute anomalie détectée

CONTEXTE IMPORTANT:
- Les documents financiers peuvent être des photos, scans partiels, ou captures d'écran
- ACCEPTE les documents même si la qualité n'est pas parfaite
- Un relevé peut ne pas montrer le nom de la banque (recadrage, etc.)
- Les factures et reçus sont aussi des documents financiers valides

INSTRUCTIONS ESSENTIELLES:
- PRIORISE L'ACCEPTATION des documents qui pourraient être financiers
- Un document financier PEUT ne pas avoir tous les éléments visibles (photo partielle, etc.)
- ACCEPTE même si le format n'est pas parfait
- En cas de doute, ACCEPTE le document
- Les documents financiers peuvent avoir différentes présentations

Réponds UNIQUEMENT avec un JSON valide:
{
  "isValidDocument": true/false,
  "documentType": "relevé bancaire" | "facture" | "reçu" | "document financier" | "autre",
  "rejectionReason": "raison précise du rejet si pas valide",
  "bankName": "nom de la banque/institution détectée ou 'Document Financier' si non visible",
  "transactionCount": nombre_de_transactions_visibles,
  "anomalies": nombre_d_anomalies_détectées,
  "confidence": pourcentage_de_confiance_0_à_100,
  "analysisMethod": "gpt4_vision_analysis"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: analysisPrompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${fileType};base64,${imageBase64}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    console.log('[DOCUMENT_VALIDATOR] AI image analysis completed');

    if (aiResponse) {
      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse
          .replace(/```json\s*/, '')
          .replace(/```\s*$/, '');
      }
      if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse
          .replace(/```\s*/, '')
          .replace(/```\s*$/, '');
      }

      const analysis = JSON.parse(cleanResponse) as DocumentAnalysis;
      console.log(
        '[DOCUMENT_VALIDATOR] Image analysis result:',
        analysis.isValidDocument
      );

      return {
        success: true,
        analysis,
      };
    }

    return {
      success: false,
      error: 'No response from AI image analysis',
    };
  } catch (error) {
    console.error('[DOCUMENT_VALIDATOR] Image analysis failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}