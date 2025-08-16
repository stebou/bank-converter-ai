// Extracteur de transactions spécialisé pour les images (JPEG/PNG)
// Utilise GPT-4o Vision avec des prompts optimisés pour l'analyse d'images financières

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TransactionData {
  id: number;
  date: string;
  description: string;
  originalDesc: string;
  amount: number;
  category: string;
  subcategory: string;
  confidence: number;
  anomalyScore: number;
}

export async function extractTransactionsFromImage(
  imageBase64: string,
  mimeType: string
): Promise<TransactionData[]> {
  console.log(
    '[IMAGE_TRANSACTION_EXTRACTOR] Starting transaction extraction from image...'
  );
  console.log(
    '[IMAGE_TRANSACTION_EXTRACTOR] Image size:',
    imageBase64.length,
    'characters'
  );

  try {
    const extractionPrompt = `Tu es un expert comptable spécialisé dans l'analyse de documents financiers par image.

ANALYSE cette image de document financier et EXTRAIS TOUTES les transactions visibles avec la PLUS GRANDE PRÉCISION.

INSTRUCTIONS CRITIQUES :
1. EXAMINE chaque ligne de transaction visible dans l'image
2. EXTRAIT les informations EXACTES telles qu'elles apparaissent
3. Pour les dates : utilise le format DD/MM ou DD/MM/YYYY si visible, sinon estime
4. Pour les montants : sois PRÉCIS au centime près, respecte les signes +/-
5. Pour les descriptions : copie le libellé EXACT tel qu'il apparaît
6. IDENTIFIE le type de transaction (débit/crédit) selon le signe ou la colonne

TYPES DE DOCUMENTS que tu peux rencontrer :
- Relevés bancaires (lignes de transactions)
- Captures d'écran d'applications bancaires
- Photos de reçus ou factures
- Extraits de compte
- Historiques de transactions

CATÉGORIES à utiliser intelligemment :
- "virement" : virements, VIR, SEPA
- "carte" : CB, carte bancaire, paiements
- "prélèvement" : PREL, prélèvements automatiques  
- "retrait" : retraits DAB, espèces
- "frais" : commissions, frais bancaires
- "autre" : autres opérations

FORMATAGE OBLIGATOIRE - Réponds UNIQUEMENT avec ce JSON :
{
  "transactions": [
    {
      "date": "DD/MM/YYYY ou DD/MM",
      "description": "Libellé EXACT tel qu'il apparaît",
      "originalDesc": "Description complète originale",
      "amount": montant_numérique_avec_signe,
      "type": "débit" | "crédit",
      "category": "virement|carte|prélèvement|retrait|frais|autre",
      "confidence": pourcentage_de_confiance_0_à_100
    }
  ],
  "summary": {
    "totalTransactions": nombre_total,
    "totalDebits": montant_total_débits,
    "totalCredits": montant_total_crédits,
    "dateRange": "période_couverte",
    "accountInfo": "informations_compte_si_visibles"
  }
}

EXEMPLE de sortie attendue :
{
  "transactions": [
    {
      "date": "15/06/2024",
      "description": "RETRAIT DAB SG PARIS",
      "originalDesc": "RETRAIT DAB SOCIETE GENERALE PARIS 15EME",
      "amount": -50.00,
      "type": "débit", 
      "category": "retrait",
      "confidence": 95
    },
    {
      "date": "16/06/2024",
      "description": "VIR SALAIRE ENTREPRISE",
      "originalDesc": "VIR SEPA SALAIRE ENTREPRISE ABC SARL",
      "amount": 2500.00,
      "type": "crédit",
      "category": "virement", 
      "confidence": 98
    }
  ],
  "summary": {
    "totalTransactions": 2,
    "totalDebits": -50.00,
    "totalCredits": 2500.00,
    "dateRange": "15-16/06/2024",
    "accountInfo": "Compte courant"
  }
}

Analyse maintenant l'image et extrais TOUTES les transactions visibles :`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: extractionPrompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    console.log('[IMAGE_TRANSACTION_EXTRACTOR] AI response received');

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    // Nettoyer la réponse JSON
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

    const aiResult = JSON.parse(cleanResponse);
    const extractedTransactions = aiResult.transactions || [];
    const summary = aiResult.summary || {};

    console.log(
      '[IMAGE_TRANSACTION_EXTRACTOR] Extracted transactions:',
      extractedTransactions.length
    );
    console.log('[IMAGE_TRANSACTION_EXTRACTOR] Summary:', summary);

    // Convertir au format attendu par l'application avec enrichissement intelligent
    const formattedTransactions = extractedTransactions.map(
      (transaction: any, index: number) => {
        // Déterminer la catégorie et sous-catégorie basée sur l'analyse IA + heuristiques
        const { category, subcategory } = determineTransactionCategory(
          transaction.category || '',
          transaction.description || '',
          transaction.amount || 0
        );

        // Calculer le score d'anomalie basé sur le montant et la confiance
        const anomalyScore = calculateAnomalyScore(
          transaction.amount || 0,
          transaction.confidence || 0
        );

        return {
          id: index + 1,
          date: formatTransactionDate(transaction.date),
          description: (transaction.description || 'TRANSACTION').substring(
            0,
            50
          ),
          originalDesc:
            transaction.originalDesc ||
            transaction.description ||
            'TRANSACTION EXTRAITE IMAGE',
          amount: parseFloat(transaction.amount) || 0,
          category: category,
          subcategory: subcategory,
          confidence: Math.min(100, Math.max(0, transaction.confidence || 80)),
          anomalyScore: anomalyScore,
        };
      }
    );

    console.log(
      '[IMAGE_TRANSACTION_EXTRACTOR] Formatted transactions:',
      formattedTransactions.length
    );

    // Log détaillé des transactions pour debug
    formattedTransactions.forEach((tx: TransactionData, i: number) => {
      console.log(`[IMAGE_TRANSACTION_EXTRACTOR] Transaction ${i + 1}:`, {
        date: tx.date,
        description: tx.description,
        amount: tx.amount,
        category: tx.category,
        confidence: tx.confidence,
      });
    });

    return formattedTransactions;
  } catch (error) {
    console.error('[IMAGE_TRANSACTION_EXTRACTOR] Error:', error);

    // Fallback en cas d'erreur - générer une transaction de base
    return [
      {
        id: 1,
        date: new Date().toISOString().split('T')[0],
        description: 'DOCUMENT IMAGE ANALYSÉ',
        originalDesc:
          'Transaction extraite depuis image - analyse manuelle requise',
        amount: 0,
        category: 'Autres',
        subcategory: 'Document image',
        confidence: 50,
        anomalyScore: 25,
      },
    ];
  }
}

// Fonction utilitaire pour déterminer la catégorie intelligente
function determineTransactionCategory(
  aiCategory: string,
  description: string,
  amount: number
): { category: string; subcategory: string } {
  const desc = description.toLowerCase();
  const cat = aiCategory.toLowerCase();

  // Virements
  if (
    cat === 'virement' ||
    desc.includes('vir') ||
    desc.includes('sepa') ||
    desc.includes('salaire')
  ) {
    return {
      category: amount > 0 ? 'Revenus' : 'Virements',
      subcategory: amount > 0 ? 'Virement reçu' : 'Virement émis',
    };
  }

  // Cartes bancaires
  if (
    cat === 'carte' ||
    desc.includes('cb') ||
    desc.includes('carte') ||
    desc.includes('paiement')
  ) {
    return {
      category: 'Dépenses',
      subcategory: 'Carte bancaire',
    };
  }

  // Prélèvements
  if (
    cat === 'prélèvement' ||
    desc.includes('prel') ||
    desc.includes('prelevement')
  ) {
    return {
      category: 'Prélèvements',
      subcategory: 'Prélèvement automatique',
    };
  }

  // Retraits
  if (
    cat === 'retrait' ||
    desc.includes('retrait') ||
    desc.includes('dab') ||
    desc.includes('espèces')
  ) {
    return {
      category: 'Retraits',
      subcategory: 'Espèces',
    };
  }

  // Frais bancaires
  if (
    cat === 'frais' ||
    desc.includes('frais') ||
    desc.includes('commission') ||
    desc.includes('cotisation')
  ) {
    return {
      category: 'Frais bancaires',
      subcategory: 'Commission',
    };
  }

  // Classification par montant si pas de catégorie claire
  if (amount < 0) {
    return {
      category: 'Dépenses',
      subcategory: 'Autres dépenses',
    };
  } else if (amount > 0) {
    return {
      category: 'Revenus',
      subcategory: 'Autres revenus',
    };
  }

  return {
    category: 'Autres',
    subcategory: 'Non classé',
  };
}

// Fonction utilitaire pour calculer le score d'anomalie
function calculateAnomalyScore(amount: number, confidence: number): number {
  let score = 0;

  // Montants élevés sont plus suspects
  if (Math.abs(amount) > 10000) score += 30;
  else if (Math.abs(amount) > 5000) score += 15;
  else if (Math.abs(amount) > 1000) score += 5;

  // Faible confiance augmente l'anomalie
  if (confidence < 70) score += 20;
  else if (confidence < 80) score += 10;
  else if (confidence < 90) score += 5;

  return Math.min(100, score);
}

// Fonction utilitaire pour formater les dates
function formatTransactionDate(dateStr: string): string {
  if (!dateStr) {
    return new Date().toISOString().split('T')[0];
  }

  // Si c'est déjà au bon format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }

  // Conversion DD/MM/YYYY vers YYYY-MM-DD
  if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Conversion DD/MM vers YYYY-MM-DD (année courante)
  if (dateStr.match(/^\d{1,2}\/\d{1,2}$/)) {
    const [day, month] = dateStr.split('/');
    const year = new Date().getFullYear();
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Fallback
  return new Date().toISOString().split('T')[0];
}
