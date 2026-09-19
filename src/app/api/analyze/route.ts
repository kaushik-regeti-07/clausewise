import { NextRequest, NextResponse } from "next/server";
import { callNemotron, isNebiusConfigured, type NemotronTier } from "@/lib/nebius";
import { buildAnalysisPrompt, buildTranslationPrompt } from "@/lib/prompts";
import { DEFAULT_LANGUAGE, isSupportedLanguage, type AnalysisResult } from "@/types/risk";

export const runtime = "nodejs";

// Keeps the document comfortably within the model's context + output token budget.
const MAX_CHARS = 20000;

// Nemotron spends a large, variable number of hidden reasoning tokens before
// writing any visible output - completion_tokens_details.reasoning_tokens ran
// ~4400 tokens even for a two-item translation. A budget that only accounts
// for the visible JSON leaves zero room for the actual answer and comes back
// empty (finish_reason "length" with no content), so this is deliberately huge.
const MAX_COMPLETION_TOKENS = 16000;

// How much of the reasoning-token budget gets spent before the visible answer
// varies run to run, so an unlucky attempt can still come back empty or cut
// off even with a large fixed budget - retrying is what actually makes this
// reliable, not just raising the ceiling further.
const MAX_ATTEMPTS = 3;

async function runNemotronJson<T>(
  messages: Parameters<typeof callNemotron>[0],
  errorLabel: string,
  tier: NemotronTier = "default"
): Promise<{ data: T } | { error: NextResponse }> {
  let lastFailure = "unknown error";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let raw: string;
    try {
      raw = await callNemotron(messages, {
        jsonMode: true,
        maxTokens: MAX_COMPLETION_TOKENS,
        temperature: 0.2,
        tier,
      });
    } catch (err) {
      lastFailure = err instanceof Error ? err.message : String(err);
      console.error(`${errorLabel} attempt ${attempt} failed:`, err);
      continue;
    }

    if (!raw.trim()) {
      lastFailure = "empty response";
      console.error(`${errorLabel} attempt ${attempt} returned an empty response.`);
      continue;
    }

    try {
      return { data: JSON.parse(raw) as T };
    } catch {
      lastFailure = "unparsable JSON";
      console.error(`${errorLabel} attempt ${attempt} returned unparsable JSON:`, raw.slice(0, 500));
    }
  }

  console.error(`${errorLabel} failed after ${MAX_ATTEMPTS} attempts: ${lastFailure}`);
  return {
    error: NextResponse.json(
      { error: "The analysis model didn't respond properly after a few tries. Please try again." },
      { status: 502 }
    ),
  };
}

export async function POST(req: NextRequest) {
  if (!isNebiusConfigured()) {
    return NextResponse.json(
      { error: "Server is missing NEBIUS_API_KEY. Add it to .env.local." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const text: unknown = body?.text;
  const language = isSupportedLanguage(body?.language) ? body.language : DEFAULT_LANGUAGE;

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "No document text provided." }, { status: 400 });
  }

  const truncated = text.slice(0, MAX_CHARS);

  // Always reason about the document in English first - Nemotron is far more
  // reliable at analysis in English than at analyzing and writing fluent
  // lower-resource-language output in a single pass.
  const analysisResult = await runNemotronJson<AnalysisResult>(
    buildAnalysisPrompt(truncated),
    "Nemotron analysis"
  );
  if ("error" in analysisResult) return analysisResult.error;

  if (language === "en") {
    return NextResponse.json(analysisResult.data);
  }

  const translationResult = await runNemotronJson<AnalysisResult>(
    buildTranslationPrompt(analysisResult.data, language),
    "Nemotron translation",
    "multilingual"
  );
  if ("error" in translationResult) return translationResult.error;

  return NextResponse.json(translationResult.data);
}
