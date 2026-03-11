import { useApiKeyStore } from "@/stores/apiKeyStore";

export interface ClaudeCallOptions {
  messages: { role: "user" | "assistant"; content: string | object[] }[];
  system?: string;
  maxTokens?: number;
  model?: string;
}

export async function callClaude(options: ClaudeCallOptions): Promise<string> {
  const apiKey = useApiKeyStore.getState().getKey();

  const res = await fetch("/api/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "x-client-api-key": apiKey } : {}),
    },
    body: JSON.stringify({
      model: options.model ?? "claude-opus-4-5",
      max_tokens: options.maxTokens ?? 2000,
      system: options.system,
      messages: options.messages,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "API error");
  }

  return data.content
    .map((b: { type: string; text?: string }) => b.text ?? "")
    .join("")
    .trim();
}
