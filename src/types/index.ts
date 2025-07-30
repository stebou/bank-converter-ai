// Dans : src/types/index.ts

// Ce type représente un document tel qu'il est stocké dans la base de données via Prisma.
export type DocumentType = {
  id: string;
  userId: string;
  filename: string;
  status: string;
  createdAt: Date; // <-- Changé de 'date: string'

  originalName: string;
  fileSize: number;
  mimeType: string;

  bankDetected: string | null;
  aiConfidence: number | null; // <-- Changé de 'confidence: number'
  processingTime: number | null;
  aiCost: number | null;
  ocrConfidence: number | null;

  totalTransactions: number;
  anomaliesDetected: number; // <-- Changé de 'anomalies: number'
  
  // Nouveaux champs ajoutés
  extractedText: string | null;
  summary: string | null;
  lastAnalyzedAt: Date | null;
  
  // Champs optionnels retournés par l'API
  hasExtractedText?: boolean;
  extractedTextLength?: number;
};