import { BusinessInsightReport } from '@/lib/agents/banking';
import { useState } from 'react';

interface UseGlobalBankingAnalysisReturn {
  report: BusinessInsightReport | null;
  isLoading: boolean;
  error: string | null;
  startAnalysis: () => Promise<void>;
  clearReport: () => void;
}

export function useGlobalBankingAnalysis(): UseGlobalBankingAnalysisReturn {
  const [report, setReport] = useState<BusinessInsightReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[HOOK] Starting global banking analysis...');
      
      const response = await fetch('/api/banking/global-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisType: 'comprehensive'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.needsDocuments) {
          throw new Error('Aucun document trouvé. Veuillez d\'abord uploader des relevés bancaires dans la section Documents.');
        }
        throw new Error(errorData.message || 'Erreur lors de l\'analyse bancaire');
      }

      const result = await response.json();
      
      if (result.success && result.report) {
        setReport(result.report);
        console.log('[HOOK] Analysis completed successfully:', result.metadata);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
      
    } catch (err) {
      console.error('[HOOK] Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const clearReport = () => {
    setReport(null);
    setError(null);
  };

  return {
    report,
    isLoading,
    error,
    startAnalysis,
    clearReport
  };
}
