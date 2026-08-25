/**
 * Dịch giữa format nội bộ của app và format wire của từng provider.
 *
 * Format nội bộ = kiểu Anthropic (system tách riêng, content block dạng
 * image/document) vì các tool container đã viết sẵn như vậy. Mọi khác biệt
 * giữa provider được xử lý ở đây, container không cần biết.
 */

import type { ProviderDef } from "./providers";

export interface CanonicalRequest {
	model: string;
	max_tokens: number;
	system?: string;
	messages: CanonicalMessage[];
}

export interface CanonicalMessage {
	role: "user" | "assistant";
	content: string | ContentBlock[];
}

export type ContentBlock =
	| { type: "text"; text: string }
	| {
			type: "image" | "document";
			source: { type: "base64"; media_type: string; data: string };
	  };

type OpenAiPart =
	| { type: "text"; text: string }
	| { type: "image_url"; image_url: { url: string } }
	| { type: "file"; file: { filename: string; file_data: string } };

function dataUri(b: Extract<ContentBlock, { type: "image" | "document" }>) {
	return `data:${b.source.media_type};base64,${b.source.data}`;
}

function toOpenAiContent(
	content: string | ContentBlock[],
): string | OpenAiPart[] {
	if (typeof content === "string") return content;

	return content.map((block): OpenAiPart => {
		if (block.type === "text") return { type: "text", text: block.text };
		if (block.type === "image") {
			return { type: "image_url", image_url: { url: dataUri(block) } };
		}
		return {
			type: "file",
			file: { filename: "upload.pdf", file_data: dataUri(block) },
		};
	});
}

/** Body gửi lên provider, theo đúng wire format của nó. */
export function buildRequestBody(
	p: ProviderDef,
	req: CanonicalRequest,
): Record<string, unknown> {
	if (p.wire === "anthropic") {
		// Format nội bộ vốn đã là Anthropic — gửi thẳng.
		return {
			model: req.model,
			max_tokens: req.max_tokens,
			...(req.system ? { system: req.system } : {}),
			messages: req.messages,
		};
	}

	return {
		model: req.model,
		max_tokens: req.max_tokens,
		messages: [
			...(req.system ? [{ role: "system", content: req.system }] : []),
			...req.messages.map((m) => ({
				role: m.role,
				content: toOpenAiContent(m.content),
			})),
		],
	};
}

/**
 * Đường dẫn endpoint chat. Nhận baseUrl rời thay vì đọc p.baseUrl để endpoint
 * người dùng tự cấu hình cũng đi qua đúng một chỗ này.
 */
export function chatUrl(p: ProviderDef, baseUrl: string): string {
	return p.wire === "anthropic"
		? `${baseUrl}/messages`
		: `${baseUrl}/chat/completions`;
}

/** Truy cập an toàn trên dữ liệu JSON không rõ kiểu. */
function rec(v: unknown): Record<string, unknown> | undefined {
	return typeof v === "object" && v !== null
		? (v as Record<string, unknown>)
		: undefined;
}

function joinTextParts(list: unknown): string {
	if (!Array.isArray(list)) return "";
	return list
		.map((b) => {
			const t = rec(b)?.text;
			return typeof t === "string" ? t : "";
		})
		.join("")
		.trim();
}

/** Rút text trả lời ra khỏi response, bất kể provider nào. */
export function extractText(p: ProviderDef, data: unknown): string {
	const d = rec(data);

	if (p.wire === "anthropic") return joinTextParts(d?.content);

	const choice = rec(rec(Array.isArray(d?.choices) ? d.choices[0] : undefined)?.message);
	const content = choice?.content;
	if (typeof content === "string") return content.trim();
	return joinTextParts(content);
}

/** Lấy message lỗi — mỗi provider trả một shape khác nhau. */
export function extractError(data: unknown, fallback: string): string {
	const d = rec(data);

	const nested = rec(d?.error)?.message; // OpenAI, Anthropic
	if (typeof nested === "string") return nested;

	const flat = d?.message; // GreenNode
	if (typeof flat === "string") return flat;

	const plain = d?.error;
	if (typeof plain === "string") return plain;

	return fallback;
}

/** Parse danh sách model từ GET /models. */
export function extractModels(data: unknown): string[] {
	const list = rec(data)?.data;
	if (!Array.isArray(list)) return [];
	return list
		.map((m) => rec(m)?.id)
		.filter((id): id is string => typeof id === "string")
		.sort();
}
