import { NextRequest, NextResponse } from "next/server";
import { authHeaders, getProvider } from "@/lib/ai/providers";
import { resolveBaseUrl } from "@/lib/ai/endpoint";
import {
	buildRequestBody,
	chatUrl,
	extractError,
	extractText,
	type CanonicalRequest,
} from "@/lib/ai/wire";

/** Key phía server (env) luôn thắng key người dùng nhập trong Settings. */
function resolveKey(req: NextRequest, envVar: string): string {
	return process.env[envVar] || req.headers.get("x-client-api-key") || "";
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const provider = getProvider(req.headers.get("x-provider") ?? "");

	const apiKey = resolveKey(req, provider.envVar);
	if (!apiKey) {
		return NextResponse.json(
			{ error: `Chưa cấu hình API key cho ${provider.label}` },
			{ status: 401 },
		);
	}

	// Endpoint do client gửi lên phải được kiểm tra lại ở đây: đây là URL mà
	// server sẽ tự đi gọi, nên không thể tin form phía client.
	const endpoint = resolveBaseUrl(
		provider.baseUrl,
		req.headers.get("x-endpoint"),
		process.env.AI_ENDPOINT_ALLOWLIST,
	);
	if (endpoint.error) {
		return NextResponse.json({ error: endpoint.error }, { status: 400 });
	}

	const canonical: CanonicalRequest = {
		model: body.model ?? provider.defaultModel,
		max_tokens: body.max_tokens ?? 2000,
		system: body.system,
		messages: body.messages ?? [],
	};

	const res = await fetch(chatUrl(provider, endpoint.url), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...authHeaders(provider, apiKey),
		},
		body: JSON.stringify(buildRequestBody(provider, canonical)),
	});

	// Provider có thể trả text thuần khi lỗi — đừng giả định là JSON.
	const raw = await res.text();
	let data: unknown;
	try {
		data = JSON.parse(raw);
	} catch {
		return NextResponse.json(
			{ error: raw.slice(0, 300) || `Upstream trả về ${res.status}` },
			{ status: res.status === 200 ? 502 : res.status },
		);
	}

	if (!res.ok) {
		return NextResponse.json(
			{ error: extractError(data, `${provider.label} API error`) },
			{ status: res.status },
		);
	}

	// Chuẩn hoá về một shape duy nhất cho client.
	return NextResponse.json({ text: extractText(provider, data) });
}
