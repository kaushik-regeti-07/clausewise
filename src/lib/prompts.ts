import type { SupportedLanguage } from "@/types/risk";
import type OpenAI from "openai";

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "Hindi",
};

export function buildAnalysisPrompt(
  documentText: string,
  language: SupportedLanguage
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const languageName = LANGUAGE_NAMES[language];

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
- "explanation" and "whyItMatters", "documentType", and "summary" must be written in ${languageName}, in plain, non-legal language a teenager could understand.
- Order "items" from highest risk to lowest risk.
- "id" must be a short unique slug per item (e.g. "auto-renewal", "late-fee").
- If the document is genuinely fair with nothing notable, return an empty items array and say so in the summary.`;

  const user = `Here is the document text:\n"""\n${documentText}\n"""`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}
