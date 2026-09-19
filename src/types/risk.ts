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

export type SupportedLanguage = "en" | "hi" | "te" | "ta" | "kn" | "ml";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളం" },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const SUPPORTED_LANGUAGE_CODES = new Set<string>(LANGUAGES.map((l) => l.code));

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return typeof value === "string" && SUPPORTED_LANGUAGE_CODES.has(value);
}
