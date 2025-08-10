// AI Agent Orchestration System for Company Account Analysis
import OpenAI from 'openai';
import { bankingService } from '../../banking';
import { prisma } from '../../prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AgentTask {
  id: string;
  type: 'data_retrieval' | 'verification' | 'analysis' | 'reporting';
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface AgentWorkflow {
  id: string;
  userId: string;
  status: 'initializing' | 'running' | 'completed' | 'failed';
  tasks: AgentTask[];
  finalReport?: BusinessInsightReport;
  createdAt: Date;
  completedAt?: Date;
}

export interface BusinessInsightReport {
  companyHealth: {
    score: number; // 0-100
    trend: 'improving' | 'stable' | 'declining';
    riskLevel: 'low' | 'medium' | 'high';
  };
  financialMetrics: {
    cashFlow: number;
    monthlyGrowth: number;
    expenseRatio: number;
    profitMargin: number;
  };
  insights: {
    strengths: string[];
    concerns: string[];
    opportunities: string[];
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    timeline: string;
  }[];
  summary: string;
}

// Agent 1: Data Retrieval Agent
class DataRetrievalAgent {
  async execute(userId: string): Promise<any> {
    console.log('[DATA_AGENT] Starting data retrieval for user:', userId);

    try {
      // Récupérer les données bancaires via le service existant
      const [accounts, transactions, analytics] = await Promise.all([
        bankingService.getUserBankAccounts(userId),
        bankingService.getUserBankTransactions(userId, undefined, 500), // Plus de transactions pour une analyse complète
        bankingService.getFinancialAnalytics(userId, '90d'), // 3 mois d'analyse
      ]);

      // Enrichir avec les données des documents analysés
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
          documents: {
            where: { status: 'COMPLETED' },
            include: {
              transactions: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      const enrichedData = {
        bankAccounts: accounts,
        bankTransactions: transactions,
        financialAnalytics: analytics,
        documentTransactions:
          user?.documents.flatMap(doc => doc.transactions) || [],
        documentCount: user?.documents.length || 0,
        dataQuality: this.assessDataQuality(accounts, transactions),
        timestamp: new Date().toISOString(),
      };

      console.log('[DATA_AGENT] Retrieved:', {
        accounts: accounts.length,
        transactions: transactions.length,
        documents: user?.documents.length || 0,
      });

      return enrichedData;
    } catch (error) {
      console.error('[DATA_AGENT] Error:', error);
      throw new Error(
        `Data retrieval failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private assessDataQuality(
    accounts: any[],
    transactions: any[]
  ): {
    score: number;
    completeness: number;
    recency: number;
    consistency: number;
  } {
    let score = 0;
    let completeness = 0;
    let recency = 0;
    let consistency = 0;

    // Évaluer la complétude des données
    if (accounts.length > 0) completeness += 30;
    if (transactions.length > 10) completeness += 40;
    if (transactions.length > 100) completeness += 30;

    // Évaluer la récence des données
    const now = new Date();
    const recentTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transactionDate || t.date);
      const daysDiff =
        (now.getTime() - transactionDate.getTime()) / (1000 * 3600 * 24);
      return daysDiff <= 30;
    });

    if (recentTransactions.length > 0)
      recency = Math.min(
        100,
        (recentTransactions.length / transactions.length) * 100
      );

    // Évaluer la cohérence des données
    const hasBalanceInfo = accounts.some(acc => acc.balance !== undefined);
    const hasCategories = transactions.some(t => t.category);
    consistency = (hasBalanceInfo ? 50 : 0) + (hasCategories ? 50 : 0);

    score = (completeness + recency + consistency) / 3;

    return { score, completeness, recency, consistency };
  }
}

// Agent 2: Verification & Classification Agent
class VerificationAgent {
  async execute(data: any): Promise<any> {
    console.log(
      '[VERIFICATION_AGENT] Starting data verification and classification'
    );

    try {
      const prompt = `Tu es un expert-comptable spécialisé dans l'analyse de données financières d'entreprise. Tu dois VÉRIFIER et CLASSER les données bancaires suivantes.

DONNÉES À ANALYSER:
- Comptes: ${data.bankAccounts?.length || 0}
- Transactions: ${data.bankTransactions?.length || 0}
- Documents analysés: ${data.documentCount || 0}
- Qualité des données: ${data.dataQuality?.score || 0}/100

ÉCHANTILLON DE TRANSACTIONS (${Math.min(20, data.bankTransactions?.length || 0)} premières):
${JSON.stringify(data.bankTransactions?.slice(0, 20) || [], null, 2)}

TÂCHES DE VÉRIFICATION:
1. COHÉRENCE: Vérifier la cohérence des montants, dates et descriptions
2. CLASSIFICATION: Classer les transactions par type (revenus, charges, investissements, etc.)
3. ANOMALIES: Identifier les transactions suspectes ou inhabituelles
4. PATTERNS: Détecter les schémas récurrents (salaires, charges fixes, etc.)

ANALYSE ATTENDUE:
- Évaluation de la fiabilité des données (0-100)
- Classification détaillée des transactions
- Liste des anomalies détectées
- Identification des flux récurrents

Réponds en JSON avec cette structure:
{
  "dataReliability": {
    "score": 0-100,
    "issues": ["liste des problèmes détectés"],
    "strengths": ["points forts des données"]
  },
  "transactionClassification": {
    "revenue": { "count": 0, "total": 0, "categories": [] },
    "expenses": { "count": 0, "total": 0, "categories": [] },
    "transfers": { "count": 0, "total": 0 },
    "investments": { "count": 0, "total": 0 }
  },
  "anomalies": [
    {
      "type": "unusual_amount" | "suspicious_transaction" | "data_inconsistency",
      "description": "description de l'anomalie",
      "severity": "low" | "medium" | "high",
      "recommendation": "action recommandée"
    }
  ],
  "recurringPatterns": [
    {
      "type": "salary" | "rent" | "utilities" | "subscription",
      "amount": 0,
      "frequency": "monthly" | "weekly" | "quarterly",
      "description": "description du pattern"
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.1,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) throw new Error('No response from AI');

      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse
          .replace(/```json\s*/, '')
          .replace(/```\s*$/, '');
      }

      const verificationResult = safeJsonParse(aiResponse);

      // Vérifier si c'est un résultat de fallback
      if (verificationResult.error) {
        console.error(
          '[VERIFICATION_AGENT] Received fallback result due to JSON parsing error'
        );
        throw new Error(
          `Verification failed: ${verificationResult.originalError}`
        );
      }

      console.log(
        '[VERIFICATION_AGENT] Completed with reliability score:',
        verificationResult.dataReliability?.score
      );

      return {
        ...verificationResult,
        processedAt: new Date().toISOString(),
        dataVolume: {
          accounts: data.bankAccounts?.length || 0,
          transactions: data.bankTransactions?.length || 0,
          documents: data.documentCount || 0,
        },
      };
    } catch (error) {
      console.error('[VERIFICATION_AGENT] Error:', error);
      throw new Error(
        `Verification failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

// Agent 3: Analysis Agent
class AnalysisAgent {
  async execute(data: any, verificationResult: any): Promise<any> {
    console.log('[ANALYSIS_AGENT] Starting financial analysis');

    try {
      const prompt = `Tu es un analyste financier senior spécialisé dans l'analyse d'entreprise. Tu dois analyser les données financières vérifiées pour générer des insights business stratégiques.

DONNÉES FINANCIÈRES VÉRIFIÉES:
${JSON.stringify(
  {
    analytics: data.financialAnalytics,
    classification: verificationResult.transactionClassification,
    patterns: verificationResult.recurringPatterns,
    reliability: verificationResult.dataReliability.score,
  },
  null,
  2
)}

ANALYSE DEMANDÉE:
1. SANTÉ FINANCIÈRE: Évaluer la situation financière globale (score 0-100)
2. TENDANCES: Analyser les tendances de croissance et de performance
3. RATIOS CLÉS: Calculer les ratios financiers importants
4. RISQUES: Identifier les risques financiers potentiels
5. OPPORTUNITÉS: Détecter les opportunités d'amélioration

FOCUS BUSINESS:
- Analyse de la trésorerie et du cash-flow
- Évaluation de la rentabilité
- Analyse des coûts et optimisation
- Prévisions et recommandations stratégiques

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans commentaires ni explications supplémentaires.

Structure JSON exacte attendue:
{
  "financialHealth": {
    "overallScore": 75,
    "trend": "improving",
    "riskLevel": "medium",
    "factors": ["facteur 1", "facteur 2"]
  },
  "keyMetrics": {
    "cashFlow": 12500,
    "monthlyGrowthRate": 2.5,
    "expenseRatio": 65.0,
    "profitabilityIndex": 8.5,
    "liquidityRatio": 1.2
  },
  "trends": {
    "revenue": { "direction": "up", "rate": 5.2 },
    "expenses": { "direction": "stable", "rate": 0.8 },
    "profitability": { "direction": "up", "analysis": "Amélioration constante" }
  },
  "riskAnalysis": [
    {
      "risk": "cash_flow",
      "severity": "medium",
      "description": "Description du risque",
      "mitigation": "Stratégie de mitigation"
    }
  ],
  "opportunities": [
    {
      "category": "cost_optimization",
      "potential": "high",
      "description": "Description de l'opportunité",
      "implementation": "Étapes de mise en œuvre"
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2500,
        temperature: 0.2,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) throw new Error('No response from AI');

      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse
          .replace(/```json\s*/, '')
          .replace(/```\s*$/, '');
      }

      const analysisResult = safeJsonParse(aiResponse);

      // Vérifier si c'est un résultat de fallback
      if (analysisResult.error) {
        console.error(
          '[ANALYSIS_AGENT] Received fallback result due to JSON parsing error'
        );
        throw new Error(`AI analysis failed: ${analysisResult.originalError}`);
      }

      console.log(
        '[ANALYSIS_AGENT] Completed with health score:',
        analysisResult.financialHealth?.overallScore
      );

      return {
        ...analysisResult,
        analysisDate: new Date().toISOString(),
        dataReliability: verificationResult.dataReliability.score,
      };
    } catch (error) {
      console.error('[ANALYSIS_AGENT] Error:', error);
      throw new Error(
        `Analysis failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

// Agent 4: Reporting Agent
class ReportingAgent {
  async execute(
    data: any,
    verification: any,
    analysis: any
  ): Promise<BusinessInsightReport> {
    console.log('[REPORTING_AGENT] Generating business insights report');

    try {
      const prompt = `Tu es un consultant en stratégie d'entreprise. Tu dois créer un rapport exécutif synthétique à partir des analyses financières pour aider un chef d'entreprise à prendre des décisions stratégiques.

ANALYSE COMPLÈTE:
${JSON.stringify(
  {
    healthScore: analysis.financialHealth?.overallScore,
    metrics: analysis.keyMetrics,
    risks: analysis.riskAnalysis,
    opportunities: analysis.opportunities,
    dataQuality: verification.dataReliability.score,
  },
  null,
  2
)}

OBJECTIF DU RAPPORT:
Créer un rapport exécutif actionnable avec:
1. SYNTHÈSE: Résumé de la situation en 2-3 phrases
2. POINTS FORTS: Ce qui fonctionne bien dans l'entreprise
3. PRÉOCCUPATIONS: Points d'attention nécessitant une action
4. RECOMMANDATIONS: Actions concrètes à mettre en place

Le rapport doit être compréhensible par un dirigeant non-financier et orienter vers l'action.

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide, sans commentaires ni texte supplémentaire.

Structure JSON exacte:
{
  "executiveSummary": "Synthèse de la situation financière en 2-3 phrases claires",
  "strengths": [
    "Force 1 identifiée",
    "Force 2 identifiée"
  ],
  "concerns": [
    "Point d'attention 1",
    "Point d'attention 2"
  ],
  "opportunities": [
    "Opportunité 1",
    "Opportunité 2"
  ],
  "recommendations": [
    {
      "priority": "high",
      "action": "Action concrète à entreprendre",
      "impact": "Impact attendu sur l'entreprise",
      "timeline": "Délai de mise en œuvre recommandé",
      "difficulty": "medium"
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      });

      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) throw new Error('No response from AI');

      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse
          .replace(/```json\s*/, '')
          .replace(/```\s*$/, '');
      }

      const reportData = safeJsonParse(aiResponse);

      // Vérifier si c'est un résultat de fallback
      if (reportData.error) {
        console.error(
          '[REPORTING_AGENT] Received fallback result due to JSON parsing error'
        );
        throw new Error(
          `Report generation failed: ${reportData.originalError}`
        );
      }

      // Construire le rapport final structuré
      const finalReport: BusinessInsightReport = {
        companyHealth: {
          score: analysis.financialHealth?.overallScore || 50,
          trend: analysis.financialHealth?.trend || 'stable',
          riskLevel: analysis.financialHealth?.riskLevel || 'medium',
        },
        financialMetrics: {
          cashFlow: analysis.keyMetrics?.cashFlow || 0,
          monthlyGrowth: analysis.keyMetrics?.monthlyGrowthRate || 0,
          expenseRatio: analysis.keyMetrics?.expenseRatio || 0,
          profitMargin: analysis.keyMetrics?.profitabilityIndex || 0,
        },
        insights: {
          strengths: reportData.strengths || [],
          concerns: reportData.concerns || [],
          opportunities: reportData.opportunities || [],
        },
        recommendations: reportData.recommendations || [],
        summary: reportData.executiveSummary || 'Analyse en cours...',
      };

      console.log('[REPORTING_AGENT] Report generated successfully');
      return finalReport;
    } catch (error) {
      console.error('[REPORTING_AGENT] Error:', error);
      throw new Error(
        `Report generation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

// Orchestrator Principal
export class AIAgentOrchestrator {
  private dataAgent = new DataRetrievalAgent();
  private verificationAgent = new VerificationAgent();
  private analysisAgent = new AnalysisAgent();
  private reportingAgent = new ReportingAgent();

  async executeWorkflow(userId: string): Promise<AgentWorkflow> {
    const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const workflow: AgentWorkflow = {
      id: workflowId,
      userId,
      status: 'initializing',
      tasks: [
        { id: 'data_retrieval', type: 'data_retrieval', status: 'pending' },
        { id: 'verification', type: 'verification', status: 'pending' },
        { id: 'analysis', type: 'analysis', status: 'pending' },
        { id: 'reporting', type: 'reporting', status: 'pending' },
      ],
      createdAt: new Date(),
    };

    try {
      console.log(
        `[ORCHESTRATOR] Starting workflow ${workflowId} for user ${userId}`
      );
      workflow.status = 'running';

      // Étape 1: Récupération des données
      const dataTask = workflow.tasks.find(t => t.type === 'data_retrieval')!;
      dataTask.status = 'running';
      dataTask.startedAt = new Date();

      const data = await this.dataAgent.execute(userId);
      dataTask.result = data;
      dataTask.status = 'completed';
      dataTask.completedAt = new Date();

      // Étape 2: Vérification et classification
      const verificationTask = workflow.tasks.find(
        t => t.type === 'verification'
      )!;
      verificationTask.status = 'running';
      verificationTask.startedAt = new Date();

      const verification = await this.verificationAgent.execute(data);
      verificationTask.result = verification;
      verificationTask.status = 'completed';
      verificationTask.completedAt = new Date();

      // Étape 3: Analyse financière
      const analysisTask = workflow.tasks.find(t => t.type === 'analysis')!;
      analysisTask.status = 'running';
      analysisTask.startedAt = new Date();

      const analysis = await this.analysisAgent.execute(data, verification);
      analysisTask.result = analysis;
      analysisTask.status = 'completed';
      analysisTask.completedAt = new Date();

      // Étape 4: Génération du rapport
      const reportingTask = workflow.tasks.find(t => t.type === 'reporting')!;
      reportingTask.status = 'running';
      reportingTask.startedAt = new Date();

      const report = await this.reportingAgent.execute(
        data,
        verification,
        analysis
      );
      reportingTask.result = report;
      reportingTask.status = 'completed';
      reportingTask.completedAt = new Date();

      workflow.finalReport = report;
      workflow.status = 'completed';
      workflow.completedAt = new Date();

      console.log(
        `[ORCHESTRATOR] Workflow ${workflowId} completed successfully`
      );
      return workflow;
    } catch (error) {
      console.error(`[ORCHESTRATOR] Workflow ${workflowId} failed:`, error);
      workflow.status = 'failed';

      // Marquer la tâche courante comme échouée
      const runningTask = workflow.tasks.find(t => t.status === 'running');
      if (runningTask) {
        runningTask.status = 'failed';
        runningTask.error =
          error instanceof Error ? error.message : String(error);
        runningTask.completedAt = new Date();
      }

      throw error;
    }
  }

  async getWorkflowStatus(workflowId: string): Promise<AgentWorkflow | null> {
    // Dans une vraie implémentation, on récupérerait depuis une base de données
    // Pour l'instant, on retourne null car c'est en mémoire
    return null;
  }
}

// Fonction utilitaire pour parser le JSON de manière robuste
function safeJsonParse(jsonString: string): any {
  try {
    let cleanResponse = jsonString.trim();

    // Enlever les blocs de code markdown
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

    // Trouver le premier { et le dernier } pour extraire uniquement le JSON
    const firstBrace = cleanResponse.indexOf('{');
    const lastBrace = cleanResponse.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanResponse = cleanResponse.substring(firstBrace, lastBrace + 1);
    }

    // Nettoyer les problèmes courants de JSON
    cleanResponse = cleanResponse
      .replace(/,(\s*[}\]])/g, '$1') // Supprimer les virgules en trop avant } ou ]
      .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":') // Ajouter des guillemets aux clés
      .replace(/:\s*([\w\s-]+)(?=\s*[,}])/g, (match, value) => {
        // Ne pas modifier les nombres, booleans, null, ou les strings déjà entre guillemets
        value = value.trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          return match; // Déjà entre guillemets
        }
        if (/^(true|false|null|\d+\.?\d*|\[.*\]|\{.*\})$/.test(value)) {
          return `:${value}`; // Nombres, booleans, null, arrays, objects
        }
        return `:"${value}"`; // Ajouter des guillemets pour les strings
      });

    // Essayer de parser
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('[SAFE_JSON_PARSE] Failed to parse JSON:', error);
    console.error(
      '[SAFE_JSON_PARSE] Original string (first 500 chars):',
      jsonString.substring(0, 500)
    );
    console.error(
      '[SAFE_JSON_PARSE] Cleaned string (first 500 chars):',
      cleanResponse?.substring(0, 500)
    );

    // Fallback : essayer de créer un objet minimal valide
    try {
      const fallbackResult = {
        error: true,
        message: 'JSON parsing failed, using fallback',
        originalError: error instanceof Error ? error.message : String(error),
      };
      console.log('[SAFE_JSON_PARSE] Using fallback result:', fallbackResult);
      return fallbackResult;
    } catch (fallbackError) {
      throw new Error(
        `JSON parsing failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

export const aiAgentOrchestrator = new AIAgentOrchestrator();
