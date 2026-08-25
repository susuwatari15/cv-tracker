import { NextRequest, NextResponse } from "next/server";
import { authHeaders, getProvider } from "@/lib/ai/providers";
import { extractError, extractModels } from "@/lib/ai/wire";
import { resolveBaseUrl } from "@/lib/ai/endpoint";

/** Lấy danh sách model live từ provider, để UI không phải hardcode. */
export async function GET(req: NextRequest) {
	const provider = getProvider(
		req.nextUrl.searchParams.get("provider") ?? "",
	);

	const apiKey =
		process.env[provider.envVar] || req.headers.get("x-client-api-key") || "";

	if (!apiKey) {
		return NextResponse.json(
			{ error: `Chưa cấu hình API key cho ${provider.label}` },
			{ status: 401 },
		);
	}

	const endpoint = resolveBaseUrl(
		provider.baseUrl,
		req.headers.get("x-endpoint"),
		process.env.AI_ENDPOINT_ALLOWLIST,
	);
	if (endpoint.error) {
		return NextResponse.json({ error: endpoint.error }, { status: 400 });
	}

	const res = await fetch(`${endpoint.url}/models`, {
		headers: authHeaders(provider, apiKey),
	});

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
			{ error: extractError(data, "Không lấy được danh sách model") },
			{ status: res.status },
		);
	}

	return NextResponse.json({ models: extractModels(data) });
}
