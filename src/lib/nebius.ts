import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (client) return client;

  const apiKey = process.env.NEBIUS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEBIUS_API_KEY is not set. Add it to .env.local (see .env.example)."
    );
  }

  client = new OpenAI({
    apiKey,
    baseURL:
      process.env.NEBIUS_API_BASE_URL ?? "https://api.tokenfactory.nebius.com/v1/",
  });
  return client;
}

export type NemotronTier = "default" | "multilingual";

// The "super" tier is fast and reliable for English analysis, but testing
// showed it frequently mixes in words/characters from unrelated languages
// and scripts when writing Telugu, Tamil, Kannada, or Malayalam (e.g. Cyrillic
// or Japanese fragments mid-word). The "ultra" tier produced clean native-
// script output in every test, so it's used specifically for translating into
// those languages, while English analysis stays on the cheaper default tier.
const TIER_MODELS: Record<NemotronTier, string> = {
  default: process.env.NEMOTRON_MODEL ?? "nvidia/nemotron-3-super-120b-a12b",
  multilingual: process.env.NEMOTRON_MULTILINGUAL_MODEL ?? "nvidia/Nemotron-3-Ultra-550b-a55b",
};

export async function callNemotron(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: { temperature?: number; maxTokens?: number; jsonMode?: boolean; tier?: NemotronTier } = {}
): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: TIER_MODELS[options.tier ?? "default"],
    messages,
    temperature: options.temperature ?? 0.2,
    // Nemotron spends a large, variable number of hidden reasoning tokens
    // before any visible output, so a low default here can come back empty.
    max_tokens: options.maxTokens ?? 16000,
    ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
  });

  return completion.choices[0]?.message?.content ?? "";
}

export function isNebiusConfigured(): boolean {
  return Boolean(process.env.NEBIUS_API_KEY);
}
