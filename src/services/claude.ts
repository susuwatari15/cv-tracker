import { useProviderStore } from "@/stores/providerStore";

export interface ClaudeCallOptions {
	messages: { role: "user" | "assistant"; content: string | object[] }[];
	system?: string;
	maxTokens?: number;
	model?: string;
}

export async function callClaude(options: ClaudeCallOptions): Promise<string> {
	const { provider, getKey, getModel, getEndpointOverride } =
		useProviderStore.getState();
	const apiKey = getKey();
	const endpoint = getEndpointOverride();

	const res = await fetch("/api/claude", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-provider": provider,
			...(apiKey ? { "x-client-api-key": apiKey } : {}),
			...(endpoint ? { "x-endpoint": endpoint } : {}),
		},
		body: JSON.stringify({
			model: options.model ?? getModel(),
			max_tokens: options.maxTokens ?? 2000,
			system: options.system,
			messages: options.messages,
		}),
	});

	const data = await res.json();

	if (!res.ok) throw new Error(data.error ?? "API error");
	if (!data.text) throw new Error("Model trả về response rỗng");

	return data.text as string;
}

/** Gọi provider để lấy danh sách model hiện có. */
export async function fetchModels(): Promise<string[]> {
	const { provider, getKey, getEndpointOverride } =
		useProviderStore.getState();
	const apiKey = getKey();
	const endpoint = getEndpointOverride();

	const res = await fetch(`/api/models?provider=${provider}`, {
		headers: {
			...(apiKey ? { "x-client-api-key": apiKey } : {}),
			...(endpoint ? { "x-endpoint": endpoint } : {}),
		},
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.error ?? "Không lấy được model");

	return (data.models ?? []) as string[];
}
