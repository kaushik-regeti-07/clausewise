import { LANGUAGES, type AnalysisResult, type SupportedLanguage } from "@/types/risk";
import type OpenAI from "openai";

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = Object.fromEntries(
  LANGUAGES.map((lang) => [lang.code, lang.label])
) as Record<SupportedLanguage, string>;

// The model reasons far more reliably in English than it writes fluent output in
// lower-resource languages, so analysis always happens in English first; a
// separate, narrowly-scoped translation pass (buildTranslationPrompt) handles
// localizing the result. Combining both steps in one prompt caused Nemotron to
// mix in stray words from unrelated languages/scripts for Tamil, Telugu, etc.
export function buildAnalysisPrompt(
  documentText: string
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const system = `You are a consumer-rights document analyst. You read contracts, policies, and bills that ordinary people struggle to understand, and you flag anything that could hurt them financially or legally.

Respond with ONLY a JSON object matching this exact shape, with no markdown fences and no extra text:
{
  "documentType": string,
  "summary": string,
  "riskScore": number,
  "items": [
    {
      "id": string,
      "title": string,
      "clauseExcerpt": string,
      "riskLevel": "high" | "medium" | "low",
      "explanation": string,
      "whyItMatters": string
    }
  ]
}

Rules:
- "documentType" is a short label like "Rental Agreement" or "Health Insurance Policy".
- "summary" is 1-2 sentences in plain language describing the document overall.
- "riskScore" is an integer 0-100: how risky this document is overall for the person signing/accepting it.
- Find EVERY clause that is unusual, hides a cost, limits the person's rights, creates an obligation they might not expect, or sets a deadline/penalty. Do not force a fixed count - a genuinely fair document can have zero items; a dense contract can have ten or more.
- "clauseExcerpt" should quote or closely paraphrase the actual relevant text so the person can find it in the original document.
- Write "title", "explanation", and "whyItMatters" in plain, non-legal English a teenager could understand.
- Order "items" from highest risk to lowest risk.
- "id" must be a short unique slug per item (e.g. "auto-renewal", "late-fee").
- If the document is genuinely fair with nothing notable, return an empty items array and say so in the summary.`;

  const user = `Here is the document text:\n"""\n${documentText}\n"""`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

export function buildTranslationPrompt(
  result: AnalysisResult,
  language: SupportedLanguage
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const languageName = LANGUAGE_NAMES[language];

  const system = `You are a precise translator localizing a legal-document analysis into ${languageName}.

You will receive a JSON object. Return ONLY the complete JSON object back, in the exact same shape, with these fields translated into ${languageName}:
- "documentType"
- "summary"
- each item's "title"
- each item's "explanation"
- each item's "whyItMatters"

Leave every other field exactly as given, unmodified: "id", "riskLevel", "clauseExcerpt", and "riskScore".

Critical rules:
- Use ONLY ${languageName}'s native script. Do not mix in words, letters, or characters from English or any other language or script under any circumstance. Proper nouns and numerals may stay as-is.
- Keep the meaning precise and the tone plain and simple, as if explaining to a teenager.
- Respond with ONLY the JSON object - no markdown fences, no commentary, no extra text.`;

  const user = `Translate this JSON:\n${JSON.stringify(result)}`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}
