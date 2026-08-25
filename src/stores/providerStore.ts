import { create } from "zustand";
import {
	DEFAULT_PROVIDER,
	PROVIDERS,
	getProvider,
	isProviderId,
	type ProviderId,
} from "@/lib/ai/providers";
import { normalizeBaseUrl, validateBaseUrl } from "@/lib/ai/endpoint";

type ApiKeyStatus = "empty" | "valid" | "invalid";

const LS_PROVIDER = "ta_provider";
const LS_KEYS = "ta_api_keys";
const LS_MODELS = "ta_models";
const LS_ENDPOINTS = "ta_endpoints";
const LS_LEGACY_KEY = "ta_api_key";
const LS_PROFILES = "ta_conn_profiles";
const LS_ACTIVE_PROFILE = "ta_conn_active";

/**
 * Một cấu hình kết nối đã lưu: provider + key + model dưới một cái tên.
 * Cho phép giữ nhiều kết nối (vd. key công ty vs key cá nhân) và đổi qua lại
 * mà không phải dán lại key mỗi lần.
 */
export interface ConnectionProfile {
	id: string;
	name: string;
	provider: ProviderId;
	key: string;
	model: string;
	/** Endpoint tuỳ chỉnh; rỗng = dùng mặc định của provider. */
	baseUrl?: string;
}

interface ProviderStore {
	provider: ProviderId;
	/** Key lưu riêng cho từng provider — đổi provider không mất key cũ. */
	keys: Record<string, string>;
	/** Model đang chọn cho từng provider. */
	models: Record<string, string>;
	/** Endpoint ghi đè cho từng provider; thiếu key = dùng mặc định. */
	endpoints: Record<string, string>;
	status: ApiKeyStatus;

	setProvider: (id: ProviderId) => void;
	setKey: (key: string) => void;
	setModel: (model: string) => void;
	/** Chuỗi rỗng = xoá override, trở về mặc định của provider. */
	setEndpoint: (url: string) => void;

	getKey: () => string;
	getModel: () => string;
	/** Endpoint thực dùng: override nếu có, không thì mặc định. */
	getEndpoint: () => string;
	/** Chỉ phần override — rỗng nếu đang dùng mặc định. */
	getEndpointOverride: () => string;

	/** Các cấu hình kết nối đã lưu. */
	profiles: ConnectionProfile[];
	/** Profile đang được áp dụng, null nếu đang dùng cấu hình rời. */
	activeProfileId: string | null;

	/** Lưu provider/key/model hiện tại thành một profile mới. Trả về id. */
	saveProfile: (name: string) => string;
	/** Ghi cấu hình hiện tại lên profile đang active. */
	updateActiveProfile: () => void;
	applyProfile: (id: string) => void;
	renameProfile: (id: string, name: string) => void;
	deleteProfile: (id: string) => void;
	/** Cấu hình hiện tại đã lệch khỏi profile đang active chưa. */
	isActiveProfileDirty: () => boolean;
}

const validate = (id: ProviderId, k: string): ApiKeyStatus => {
	if (!k) return "empty";
	return k.startsWith(PROVIDERS[id].keyPrefix) ? "valid" : "invalid";
};

function persist(state: {
	provider: ProviderId;
	keys: Record<string, string>;
	models: Record<string, string>;
	endpoints: Record<string, string>;
}) {
	localStorage.setItem(LS_PROVIDER, state.provider);
	localStorage.setItem(LS_KEYS, JSON.stringify(state.keys));
	localStorage.setItem(LS_MODELS, JSON.stringify(state.models));
	localStorage.setItem(LS_ENDPOINTS, JSON.stringify(state.endpoints));
}

function persistProfiles(profiles: ConnectionProfile[], activeId: string | null) {
	try {
		localStorage.setItem(LS_PROFILES, JSON.stringify(profiles));
		if (activeId) localStorage.setItem(LS_ACTIVE_PROFILE, activeId);
		else localStorage.removeItem(LS_ACTIVE_PROFILE);
	} catch {
		// Storage đầy hoặc bị chặn — profile vẫn dùng được trong session này.
	}
}

/** crypto.randomUUID không có trên vài trình duyệt cũ / ngữ cảnh không secure. */
function newId(): string {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}
	return `p_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export const useProviderStore = create<ProviderStore>((set, get) => ({
	provider: DEFAULT_PROVIDER,
	keys: {},
	models: {},
	status: "empty",

	setProvider: (id) => {
		const { keys, models, endpoints } = get();
		set({ provider: id, status: validate(id, keys[id] ?? "") });
		persist({ provider: id, keys, models, endpoints });
	},

	setKey: (key) => {
		const { provider, keys, models, endpoints } = get();
		const nextKeys = { ...keys, [provider]: key.trim() };
		set({ keys: nextKeys, status: validate(provider, key.trim()) });
		persist({ provider, keys: nextKeys, models, endpoints });
	},

	setModel: (model) => {
		const { provider, keys, models, endpoints } = get();
		const nextModels = { ...models, [provider]: model };
		set({ models: nextModels });
		persist({ provider, keys, models: nextModels, endpoints });
	},

	setEndpoint: (url) => {
		const { provider, keys, models, endpoints } = get();
		const value = normalizeBaseUrl(url);
		const nextEndpoints = { ...endpoints };
		// Rỗng, hoặc trùng mặc định, thì không lưu override — tránh cảnh
		// endpoint "tuỳ chỉnh" thực ra giống y mặc định.
		if (!value || value === normalizeBaseUrl(PROVIDERS[provider].baseUrl)) {
			delete nextEndpoints[provider];
		} else {
			nextEndpoints[provider] = value;
		}
		set({ endpoints: nextEndpoints });
		persist({ provider, keys, models, endpoints: nextEndpoints });
	},

	getKey: () => get().keys[get().provider] ?? "",

	getModel: () => {
		const { provider, models } = get();
		return models[provider] || getProvider(provider).defaultModel;
	},

	endpoints: {},

	getEndpoint: () => {
		const { provider, endpoints } = get();
		return endpoints[provider] || normalizeBaseUrl(PROVIDERS[provider].baseUrl);
	},

	getEndpointOverride: () => get().endpoints[get().provider] ?? "",

	profiles: [],
	activeProfileId: null,

	saveProfile: (name) => {
		const { provider, profiles, getKey, getModel, getEndpointOverride } = get();
		const profile: ConnectionProfile = {
			id: newId(),
			name: name.trim() || getProvider(provider).label,
			provider,
			key: getKey(),
			model: getModel(),
			baseUrl: getEndpointOverride(),
		};
		const next = [...profiles, profile];
		set({ profiles: next, activeProfileId: profile.id });
		persistProfiles(next, profile.id);
		return profile.id;
	},

	updateActiveProfile: () => {
		const { activeProfileId, profiles, provider, getKey, getModel, getEndpointOverride } =
			get();
		if (!activeProfileId) return;
		const key = getKey();
		const model = getModel();
		const baseUrl = getEndpointOverride();
		const next = profiles.map((p) =>
			p.id === activeProfileId ? { ...p, provider, key, model, baseUrl } : p,
		);
		set({ profiles: next });
		persistProfiles(next, activeProfileId);
	},

	applyProfile: (id) => {
		const { profiles, keys, models, endpoints } = get();
		const profile = profiles.find((p) => p.id === id);
		if (!profile) return;

		// Ghi vào cả map per-provider để cấu hình rời không bị lệch với profile.
		const nextKeys = { ...keys, [profile.provider]: profile.key };
		const nextModels = { ...models, [profile.provider]: profile.model };
		const nextEndpoints = { ...endpoints };
		if (profile.baseUrl) nextEndpoints[profile.provider] = profile.baseUrl;
		else delete nextEndpoints[profile.provider];

		set({
			provider: profile.provider,
			keys: nextKeys,
			models: nextModels,
			endpoints: nextEndpoints,
			status: validate(profile.provider, profile.key),
			activeProfileId: id,
		});
		persist({
			provider: profile.provider,
			keys: nextKeys,
			models: nextModels,
			endpoints: nextEndpoints,
		});
		persistProfiles(get().profiles, id);
	},

	renameProfile: (id, name) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		const { profiles, activeProfileId } = get();
		const next = profiles.map((p) =>
			p.id === id ? { ...p, name: trimmed } : p,
		);
		set({ profiles: next });
		persistProfiles(next, activeProfileId);
	},

	deleteProfile: (id) => {
		const { profiles, activeProfileId } = get();
		const next = profiles.filter((p) => p.id !== id);
		// Xoá profile đang dùng không ngắt kết nối hiện tại, chỉ bỏ liên kết.
		const nextActive = activeProfileId === id ? null : activeProfileId;
		set({ profiles: next, activeProfileId: nextActive });
		persistProfiles(next, nextActive);
	},

	isActiveProfileDirty: () => {
		const { activeProfileId, profiles, provider, getKey, getModel, getEndpointOverride } =
			get();
		if (!activeProfileId) return false;
		const profile = profiles.find((p) => p.id === activeProfileId);
		if (!profile) return false;
		return (
			profile.provider !== provider ||
			profile.key !== getKey() ||
			profile.model !== getModel() ||
			(profile.baseUrl ?? "") !== getEndpointOverride()
		);
	},
}));

function readProfiles(raw: string | null): ConnectionProfile[] {
	if (!raw) return [];
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		// Bỏ qua entry hỏng thay vì làm sập cả danh sách.
		return parsed.filter(
			(p): p is ConnectionProfile =>
				typeof p === "object" &&
				p !== null &&
				typeof (p as ConnectionProfile).id === "string" &&
				typeof (p as ConnectionProfile).name === "string" &&
				isProviderId((p as ConnectionProfile).provider) &&
				typeof (p as ConnectionProfile).key === "string" &&
				typeof (p as ConnectionProfile).model === "string",
		);
	} catch {
		return [];
	}
}

function readJson(raw: string | null): Record<string, string> {
	if (!raw) return {};
	try {
		const parsed: unknown = JSON.parse(raw);
		return typeof parsed === "object" && parsed !== null
			? (parsed as Record<string, string>)
			: {};
	} catch {
		return {};
	}
}

export function initProviderStore() {
	const savedProvider = localStorage.getItem(LS_PROVIDER) ?? "";
	const provider = isProviderId(savedProvider) ? savedProvider : DEFAULT_PROVIDER;

	const keys = readJson(localStorage.getItem(LS_KEYS));
	const models = readJson(localStorage.getItem(LS_MODELS));
	// Bỏ endpoint đã lưu nếu không còn hợp lệ, thay vì gửi lên server rồi lỗi.
	const endpoints = Object.fromEntries(
		Object.entries(readJson(localStorage.getItem(LS_ENDPOINTS))).filter(
			([, url]) => validateBaseUrl(url).ok,
		),
	);

	// Di trú key thời một-provider sang map mới.
	const legacy = localStorage.getItem(LS_LEGACY_KEY);
	if (legacy && !keys[provider]) {
		keys[provider] = legacy;
		localStorage.removeItem(LS_LEGACY_KEY);
	}

	const profiles = readProfiles(localStorage.getItem(LS_PROFILES));
	const savedActive = localStorage.getItem(LS_ACTIVE_PROFILE);
	const activeProfileId =
		savedActive && profiles.some((p) => p.id === savedActive)
			? savedActive
			: null;

	useProviderStore.setState({
		provider,
		keys,
		models,
		status: validate(provider, keys[provider] ?? ""),
		endpoints,
		profiles,
		activeProfileId,
	});
	persist({ provider, keys, models, endpoints });
}
