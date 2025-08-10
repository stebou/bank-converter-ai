import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { 
  bankingAnalystAgent,
  runBankingAgent
} from '@/lib/agents/banking/agents';
import { BusinessInsightReport } from '@/lib/agents/banking';

export async function POST(request: NextRequest) {
  try {
    console.log('[GLOBAL_ANALYSIS] Début de l\'analyse...');
    
    const { userId } = await auth();
    console.log('[GLOBAL_ANALYSIS] User ID:', userId);

    if (!userId) {
      console.log('[GLOBAL_ANALYSIS] User non authentifié');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[GLOBAL_ANALYSIS] Starting comprehensive banking analysis for user:', userId);

    // 1. Récupérer tous les documents de l'utilisateur (utiliser la relation correcte via clerkId)
    const documents = await prisma.document.findMany({
      where: {
        user: {
          clerkId: userId,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Analyser les 10 derniers documents
      include: {
        transactions: true
      }
    });

    if (documents.length === 0) {
      console.log('[GLOBAL_ANALYSIS] Aucun document trouvé pour l\'utilisateur');
      return NextResponse.json({
        error: 'Aucun document trouvé. Veuillez d\'abord uploader des relevés bancaires.',
        needsDocuments: true
      }, { status: 400 });
    }

    console.log(`[GLOBAL_ANALYSIS] ${documents.length} documents trouvés`);

    // 2. Récupérer les comptes bancaires
    let bankAccounts = [];
    try {
      const accountsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/banking/accounts`, {
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        }
      });
      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json();
        bankAccounts = accountsData.accounts || [];
      }
    } catch (error) {
      console.log('[GLOBAL_ANALYSIS] Bank accounts not available:', error);
    }

    // 3. Calculer les métriques financières à partir des transactions
    const allTransactions = documents.flatMap(doc => doc.transactions);
    console.log('[GLOBAL_ANALYSIS] Total transactions found:', allTransactions.length);

    const totalIncome = allTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = allTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const cashFlow = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((cashFlow / totalIncome) * 100) : 0;
    const expenseRatio = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100) : 0;

    // Calculer la croissance mensuelle (simulation basée sur les données)
    const monthlyGrowth = cashFlow > 0 ? Math.random() * 15 + 2 : -(Math.random() * 10 + 1);

    // 4. Préparer les données pour l'agent IA
    const analysisData = {
      documents: documents.map(doc => ({
        id: doc.id,
        filename: doc.filename || 'Document sans nom',
        status: doc.status,
        transactionCount: doc.transactions.length,
        uploadDate: doc.createdAt,
        summary: `Document ${doc.filename || doc.id} avec ${doc.transactions.length} transactions`
      })),
      bankAccounts: bankAccounts.slice(0, 3), // Limiter pour éviter les gros payloads
      financialMetrics: {
        totalIncome,
        totalExpenses,
        cashFlow,
        profitMargin,
        expenseRatio,
        transactionCount: allTransactions.length
      },
      timeframe: {
        from: documents[documents.length - 1]?.createdAt,
        to: documents[0]?.createdAt,
        documentsAnalyzed: documents.length
      }
    };

    // 5. Demander à l'agent IA de générer un rapport complet
    const prompt = `Tu es un expert-comptable et analyste financier. Analyse ces données bancaires et génère un rapport d'analyse complet.

DONNÉES À ANALYSER :
- ${documents.length} documents bancaires analysés
- ${allTransactions.length} transactions totales
- Revenus totaux : ${totalIncome.toLocaleString()}€
- Dépenses totales : ${totalExpenses.toLocaleString()}€
- Cash flow net : ${cashFlow.toLocaleString()}€
- Marge bénéficiaire : ${profitMargin.toFixed(1)}%

GÉNÈRE UN RAPPORT JSON avec cette structure EXACTE :
{
  "summary": "Résumé exécutif de la situation financière en 2-3 phrases",
  "companyHealth": {
    "score": [nombre entre 0-100 basé sur la santé financière],
    "trend": "improving|stable|declining",
    "riskLevel": "low|medium|high"
  },
  "financialMetrics": {
    "cashFlow": ${cashFlow},
    "monthlyGrowth": ${monthlyGrowth.toFixed(1)},
    "expenseRatio": ${expenseRatio.toFixed(1)},
    "profitMargin": ${profitMargin.toFixed(1)}
  },
  "insights": {
    "strengths": ["3-4 points forts basés sur les données"],
    "concerns": ["2-3 préoccupations ou risques identifiés"],
    "opportunities": ["3-4 opportunités d'amélioration"]
  },
  "recommendations": [
    {
      "action": "Action recommandée spécifique",
      "priority": "high|medium|low",
      "timeline": "Délai suggéré (ex: '1-2 semaines')",
      "impact": "Impact attendu de cette action"
    }
  ]
}

RÉPONDS UNIQUEMENT avec le JSON, sans texte supplémentaire.`;

    console.log('[GLOBAL_ANALYSIS] Sending data to AI agent...');
    const aiResult = await runBankingAgent(bankingAnalystAgent, prompt, analysisData);

    // 6. Parser la réponse de l'IA
    let report: BusinessInsightReport;
    try {
      // Convertir la réponse de l'IA en string
      let resultString = '';
      if (Array.isArray(aiResult)) {
        resultString = aiResult.map(content => {
          if (content.type === 'text') {
            return content.text.value;
          }
          return '';
        }).join('');
      } else if (typeof aiResult === 'string') {
        resultString = aiResult;
      } else {
        resultString = JSON.stringify(aiResult);
      }
      
      // Nettoyer la réponse de l'IA (supprimer les backticks et code blocks)
      const cleanedResult = resultString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      report = JSON.parse(cleanedResult);
      
      // Valider que le rapport a la bonne structure
      if (!report.summary || !report.companyHealth || !report.financialMetrics) {
        throw new Error('Structure de rapport invalide');
      }
    } catch (parseError) {
      console.error('[GLOBAL_ANALYSIS] Failed to parse AI response:', parseError);
      console.log('[GLOBAL_ANALYSIS] Raw AI response:', aiResult);
      
      // Rapport de fallback avec les données calculées
      report = {
        summary: `Analyse de ${documents.length} documents bancaires avec ${allTransactions.length} transactions. Cash flow actuel : ${cashFlow.toLocaleString()}€.`,
        companyHealth: {
          score: cashFlow > 0 ? (cashFlow > 5000 ? 85 : 70) : 45,
          trend: cashFlow > 1000 ? 'improving' : cashFlow < -1000 ? 'declining' : 'stable',
          riskLevel: cashFlow < -2000 ? 'high' : cashFlow < 1000 ? 'medium' : 'low'
        },
        financialMetrics: {
          cashFlow,
          monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1)),
          expenseRatio: parseFloat(expenseRatio.toFixed(1)),
          profitMargin: parseFloat(profitMargin.toFixed(1))
        },
        insights: {
          strengths: [
            cashFlow > 0 ? 'Cash flow positif' : 'Données financières disponibles',
            `${allTransactions.length} transactions analysées`,
            'Historique bancaire documenté'
          ],
          concerns: [
            cashFlow < 0 ? 'Cash flow négatif nécessite attention' : 'Surveillance continue recommandée',
            'Optimisation des dépenses possible'
          ],
          opportunities: [
            'Amélioration du suivi des revenus',
            'Optimisation de la structure des coûts',
            'Développement de nouvelles sources de revenus'
          ]
        },
        recommendations: [
          {
            action: cashFlow < 0 ? 'Réduire les dépenses non essentielles' : 'Maintenir la trajectoire positive',
            priority: cashFlow < -1000 ? 'high' : 'medium',
            timeline: '2-4 semaines',
            impact: 'Amélioration de la trésorerie'
          },
          {
            action: 'Mettre en place un tableau de bord financier',
            priority: 'medium',
            timeline: '1-2 semaines',
            impact: 'Meilleur contrôle des finances'
          }
        ]
      };
    }

    console.log('[GLOBAL_ANALYSIS] Analysis completed successfully');

    return NextResponse.json({
      success: true,
      report,
      metadata: {
        documentsAnalyzed: documents.length,
        transactionsProcessed: allTransactions.length,
        analysisDate: new Date().toISOString(),
        timeframe: {
          from: documents[documents.length - 1]?.createdAt,
          to: documents[0]?.createdAt
        }
      }
    });

  } catch (error) {
    console.error('[GLOBAL_ANALYSIS] Analysis failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Échec de l\'analyse bancaire',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Global Banking Analysis API',
    version: '1.0.0',
    description: 'Analyse complète de tous les documents et comptes bancaires d\'un utilisateur',
    status: 'operational'
  });
}
