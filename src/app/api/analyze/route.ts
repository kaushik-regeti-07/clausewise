import { NextRequest, NextResponse } from "next/server";
import { callNemotron, isNebiusConfigured } from "@/lib/nebius";
import { buildAnalysisPrompt } from "@/lib/prompts";
import type { AnalysisResult, SupportedLanguage } from "@/types/risk";

export const runtime = "nodejs";

// Keeps the document comfortably within the model's context + output token budget.
const MAX_CHARS = 20000;

export async function POST(req: NextRequest) {
  if (!isNebiusConfigured()) {
    return NextResponse.json(
      { error: "Server is missing NEBIUS_API_KEY. Add it to .env.local." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const text: unknown = body?.text;
  const language: SupportedLanguage = body?.language === "hi" ? "hi" : "en";

  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "No document text provided." }, { status: 400 });
  }

  const truncated = text.slice(0, MAX_CHARS);
  const messages = buildAnalysisPrompt(truncated, language);

  let raw: string;
  try {
    raw = await callNemotron(messages, { jsonMode: true, maxTokens: 4096, temperature: 0.2 });
  } catch (err) {
    console.error("Nemotron call failed:", err);
    return NextResponse.json(
      { error: "The analysis model failed to respond. Please try again." },
      { status: 502 }
    );
  }

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "The model returned an unreadable response. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json(parsed);
}
