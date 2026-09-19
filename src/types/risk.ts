export type RiskLevel = "high" | "medium" | "low";

export interface RiskItem {
  id: string;
  title: string;
  clauseExcerpt: string;
  riskLevel: RiskLevel;
  explanation: string;
  whyItMatters: string;
}

export interface AnalysisResult {
  documentType: string;
  summary: string;
  riskScore: number;
  items: RiskItem[];
}

export type SupportedLanguage = "en" | "hi";
