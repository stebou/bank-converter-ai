// Dans : src/types/index.ts

export type DocumentType = {
  id: string | number;
  filename: string;
  date: string;
  confidence: number;
  anomalies: number;
};