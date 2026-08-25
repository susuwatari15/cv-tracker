/**
 * Provider registry — thêm một provider mới = thêm một entry vào PROVIDERS.
 * Không có chỗ nào khác trong app hardcode tên provider hay model.
 */

/** Định dạng wire mà provider nói. Quyết định cách dịch request/response. */
export type WireFormat = "openai" | "anthropic";

/** Cách gắn API key vào request. */
export type AuthStyle = "bearer" | "x-api-key";

export interface ProviderDef {
	id: ProviderId;
	label: string;
	baseUrl: string;
	wire: WireFormat;
	auth: AuthStyle;
	/** Prefix để validate key phía client (chỉ là gợi ý, không phải xác thực thật). */
	keyPrefix: string;
	keyPlaceholder: string;
	/** Env var đọc phía server — ưu tiên hơn key người dùng nhập. */
	envVar: string;
	/**
	 * Danh sách model mồi, dùng khi chưa fetch được list thật.
	 * UI có nút "Refresh" gọi GET {baseUrl}/models để lấy list live.
	 */
	seedModels: string[];
	defaultModel: string;
}

export const PROVIDER_IDS = [
	"greennode",
	"anthropic",
	"openai",
	"google",
	"openrouter",
] as const;

export type ProviderId = (typeof PROVIDER_IDS)[number];

export const PROVIDERS: Record<ProviderId, ProviderDef> = {
	greennode: {
		id: "greennode",
		label: "GreenNode TokenPlan",
		baseUrl: "https://tokenplan.api.greennode.ai/v1",
		wire: "openai",
		auth: "bearer",
		keyPrefix: "vn-tp-",
		keyPlaceholder: "vn-tp-...",
		envVar: "GREENNODE_API_KEY",
		seedModels: ["z-ai/glm-5.2"],
		defaultModel: "z-ai/glm-5.2",
	},

	anthropic: {
		id: "anthropic",
		label: "Anthropic (Claude)",
		baseUrl: "https://api.anthropic.com/v1",
		wire: "anthropic",
		auth: "x-api-key",
		keyPrefix: "sk-ant-",
		keyPlaceholder: "sk-ant-api03-...",
		envVar: "ANTHROPIC_API_KEY",
		seedModels: [
			"claude-opus-5",
			"claude-sonnet-5",
			"claude-haiku-4-5",
			"claude-opus-4-8",
		],
		defaultModel: "claude-opus-5",
	},

	openai: {
		id: "openai",
		label: "OpenAI (GPT)",
		baseUrl: "https://api.openai.com/v1",
		wire: "openai",
		auth: "bearer",
		keyPrefix: "sk-",
		keyPlaceholder: "sk-proj-...",
		envVar: "OPENAI_API_KEY",
		seedModels: ["gpt-4o", "gpt-4o-mini"],
		defaultModel: "gpt-4o",
	},

	google: {
		id: "google",
		label: "Google Gemini",
		baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
		wire: "openai",
		auth: "bearer",
		keyPrefix: "AIza",
		keyPlaceholder: "AIza...",
		envVar: "GOOGLE_API_KEY",
		seedModels: ["gemini-2.0-flash"],
		defaultModel: "gemini-2.0-flash",
	},

	openrouter: {
		id: "openrouter",
		label: "OpenRouter",
		baseUrl: "https://openrouter.ai/api/v1",
		wire: "openai",
		auth: "bearer",
		keyPrefix: "sk-or-",
		keyPlaceholder: "sk-or-v1-...",
		envVar: "OPENROUTER_API_KEY",
		seedModels: ["anthropic/claude-opus-5", "openai/gpt-4o"],
		defaultModel: "anthropic/claude-opus-5",
	},
};

export const DEFAULT_PROVIDER: ProviderId = "greennode";

export function isProviderId(v: string): v is ProviderId {
	return (PROVIDER_IDS as readonly string[]).includes(v);
}

export function getProvider(id: string): ProviderDef {
	return isProviderId(id) ? PROVIDERS[id] : PROVIDERS[DEFAULT_PROVIDER];
}

/** Header xác thực cho provider, dùng chung cho cả chat lẫn list models. */
export function authHeaders(p: ProviderDef, apiKey: string): HeadersInit {
	if (p.auth === "x-api-key") {
		return { "x-api-key": apiKey, "anthropic-version": "2023-06-01" };
	}
	return { Authorization: `Bearer ${apiKey}` };
}
