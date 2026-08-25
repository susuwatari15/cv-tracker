/**
 * Validation cho endpoint (base URL) do người dùng tự nhập.
 *
 * Endpoint tuỳ chỉnh nghĩa là client quyết định URL mà *server* sẽ gọi —
 * đúng định nghĩa của SSRF. Vì vậy mọi override đều phải qua đây ở phía
 * server, không chỉ validate ở form.
 */

/** Host không bao giờ là endpoint AI hợp lệ, nhưng lại là đích SSRF kinh điển. */
const BLOCKED_HOSTS = new Set([
	"169.254.169.254", // AWS / GCP / Azure instance metadata
	"metadata.google.internal",
	"metadata.goog",
	"100.100.100.200", // Alibaba metadata
]);

export type EndpointCheck =
	| { ok: true; url: string }
	| { ok: false; reason: string };

/** Bỏ khoảng trắng và dấu / ở cuối để so sánh và ghép path nhất quán. */
export function normalizeBaseUrl(raw: string): string {
	return raw.trim().replace(/\/+$/, "");
}

function isLocalHost(hostname: string): boolean {
	return (
		hostname === "localhost" ||
		hostname === "127.0.0.1" ||
		hostname === "::1" ||
		hostname === "[::1]" ||
		hostname.endsWith(".localhost")
	);
}

/**
 * Kiểm tra một base URL người dùng nhập.
 *
 * Cho phép http cho localhost vì đó là cách chạy model server ở máy
 * (Ollama, LM Studio, vLLM) — chặn hẳn http sẽ làm mất use case chính.
 */
export function validateBaseUrl(raw: string): EndpointCheck {
	const value = normalizeBaseUrl(raw);
	if (!value) return { ok: false, reason: "Endpoint đang để trống." };

	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return {
			ok: false,
			reason: "Không phải URL hợp lệ — cần dạng https://host/path.",
		};
	}

	if (url.protocol !== "https:" && url.protocol !== "http:") {
		return { ok: false, reason: `Giao thức ${url.protocol} không được hỗ trợ.` };
	}

	if (url.protocol === "http:" && !isLocalHost(url.hostname)) {
		return {
			ok: false,
			reason: "http chỉ dùng được với localhost. Endpoint từ xa phải là https.",
		};
	}

	// Credentials trong URL sẽ bị log và lộ ra ngoài.
	if (url.username || url.password) {
		return { ok: false, reason: "Không đặt user/password trong URL." };
	}

	if (BLOCKED_HOSTS.has(url.hostname)) {
		return { ok: false, reason: "Host này không được phép." };
	}

	return { ok: true, url: value };
}

/**
 * Kiểm tra thêm ở phía server: nếu đặt AI_ENDPOINT_ALLOWLIST (danh sách host
 * cách nhau bởi dấu phẩy) thì chỉ những host đó được gọi. Không đặt = cho phép
 * mọi host đã qua validateBaseUrl, để môi trường dev vẫn linh hoạt.
 */
export function isHostAllowed(
	url: string,
	allowlist: string | undefined,
): boolean {
	if (!allowlist?.trim()) return true;
	let hostname: string;
	try {
		hostname = new URL(url).hostname.toLowerCase();
	} catch {
		return false;
	}
	return allowlist
		.split(",")
		.map((h) => h.trim().toLowerCase())
		.filter(Boolean)
		.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`));
}

/**
 * Base URL cuối cùng dùng cho một request: override đã được kiểm tra, nếu
 * không hợp lệ thì rơi về mặc định của provider.
 */
export function resolveBaseUrl(
	fallback: string,
	override: string | null | undefined,
	allowlist?: string,
): { url: string; error?: string } {
	if (!override?.trim()) return { url: fallback };

	const check = validateBaseUrl(override);
	if (!check.ok) return { url: fallback, error: check.reason };

	if (!isHostAllowed(check.url, allowlist)) {
		return {
			url: fallback,
			error: "Endpoint không nằm trong AI_ENDPOINT_ALLOWLIST của server.",
		};
	}

	return { url: check.url };
}
