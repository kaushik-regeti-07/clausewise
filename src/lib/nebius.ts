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

const MODEL = process.env.NEMOTRON_MODEL ?? "nvidia/nemotron-3-super-120b-a12b";

export async function callNemotron(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options: { temperature?: number; maxTokens?: number; jsonMode?: boolean } = {}
): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    messages,
    temperature: options.temperature ?? 0.2,
    // Nemotron JSON responses get truncated at low budgets on dense documents.
    max_tokens: options.maxTokens ?? 4096,
    ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
  });

  return completion.choices[0]?.message?.content ?? "";
}

export function isNebiusConfigured(): boolean {
  return Boolean(process.env.NEBIUS_API_KEY);
}
