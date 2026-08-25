"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, RefreshCw, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import ApiStatusDot from "@/components/shared/ApiStatusDot";
import FieldGroup from "@/components/shared/FieldGroup";
import GhostButton from "@/components/shared/GhostButton";
import StatusPill from "@/components/shared/StatusPill";
import { useProviderStore } from "@/stores/providerStore";
import { fetchModels } from "@/services/claude";
import { PROVIDERS, PROVIDER_IDS, type ProviderId } from "@/lib/ai/providers";
import { normalizeBaseUrl, validateBaseUrl } from "@/lib/ai/endpoint";

export default function ProviderConfig() {
	const {
		provider,
		status,
		setProvider,
		setKey,
		setModel,
		setEndpoint,
		getKey,
		getModel,
		getEndpointOverride,
	} = useProviderStore();

	const [liveModels, setLiveModels] = useState<Record<string, string[]>>({});
	const [loading, setLoading] = useState(false);
	const [revealed, setRevealed] = useState(false);

	// Endpoint là field text tự do nên giữ bản nháp cục bộ: commit vào store
	// khi blur, để người dùng gõ dở dang không bị coi là endpoint sai.
	const override = getEndpointOverride();
	const [endpointDraft, setEndpointDraft] = useState<string | null>(null);
	const endpointValue = endpointDraft ?? override;
	const endpointCheck =
		endpointValue.trim() === "" ? null : validateBaseUrl(endpointValue);
	const endpointError =
		endpointCheck && !endpointCheck.ok ? endpointCheck.reason : undefined;

	const commitEndpoint = () => {
		if (endpointDraft === null) return;
		if (endpointDraft.trim() !== "" && !validateBaseUrl(endpointDraft).ok) return;
		setEndpoint(endpointDraft);
		setEndpointDraft(null);
	};

	const resetEndpoint = () => {
		setEndpoint("");
		setEndpointDraft(null);
		toast.success("Đã trở về endpoint mặc định");
	};

	const def = PROVIDERS[provider];
	const models = liveModels[provider]?.length
		? liveModels[provider]
		: def.seedModels;

	const onRefresh = async () => {
		setLoading(true);
		try {
			const list = await fetchModels();
			if (!list.length) {
				toast.error("Nhà cung cấp không trả về model nào");
				return;
			}
			setLiveModels((m) => ({ ...m, [provider]: list }));
			toast.success(`Đã tải ${list.length} model từ ${def.label}`);
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Không tải được danh sách model",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-5">
			{/* Connection state stated in words, not just a coloured dot */}
			<div className="flex items-center gap-2.5 rounded-lg border border-border-default bg-surface-2 px-3.5 py-3">
				<ApiStatusDot status={status} />
				<span className="flex-1 text-[12.5px] text-ink-2">
					Trạng thái kết nối tới {def.label}
				</span>
				<StatusPill
					tone={
						status === "valid"
							? "success"
							: status === "invalid"
								? "danger"
								: "neutral"
					}
				>
					{status === "valid"
						? "Đã kết nối"
						: status === "invalid"
							? "Key sai định dạng"
							: "Chưa cấu hình"}
				</StatusPill>
			</div>

			<FieldGroup label="Nhà cung cấp">
				<Select
					value={provider}
					onValueChange={(v) => v && setProvider(v as ProviderId)}
				>
					<SelectTrigger className="h-10 w-full">
						<SelectValue>
							{(v) => PROVIDERS[v as ProviderId]?.label ?? String(v)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{PROVIDER_IDS.map((id) => (
							<SelectItem key={id} value={id}>
								{PROVIDERS[id].label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FieldGroup>

			<FieldGroup
				label="Endpoint"
				hint={
					override
						? "Đang dùng endpoint tuỳ chỉnh. Bỏ trống để trở về mặc định."
						: `Bỏ trống để dùng mặc định: ${normalizeBaseUrl(def.baseUrl)}`
				}
				error={endpointError}
			>
				<span className="flex items-center gap-2">
					<Input
						id="ai-endpoint"
						value={endpointValue}
						onChange={(e) => setEndpointDraft(e.target.value)}
						onBlur={commitEndpoint}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								commitEndpoint();
							}
							if (e.key === "Escape") setEndpointDraft(null);
						}}
						placeholder={normalizeBaseUrl(def.baseUrl)}
						autoComplete="off"
						spellCheck={false}
						inputMode="url"
						aria-invalid={!!endpointError}
						className="h-10 flex-1 font-mono text-[12.5px]"
					/>
					{override ? (
						<button
							type="button"
							onClick={resetEndpoint}
							aria-label="Trở về endpoint mặc định"
							title="Trở về endpoint mặc định"
							className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border-strong bg-surface text-ink-3 transition-colors hover:text-ink"
						>
							<RotateCcw className="size-4" aria-hidden="true" />
						</button>
					) : null}
				</span>
			</FieldGroup>

			<FieldGroup
				label="API key"
				hint={`Key được lưu riêng cho từng nhà cung cấp — đổi provider không mất key cũ. Thường bắt đầu bằng "${def.keyPrefix}".`}
				error={
					status === "invalid"
						? `Key không khớp tiền tố "${def.keyPrefix}" của ${def.label}. Kiểm tra lại trước khi gọi API.`
						: undefined
				}
			>
				<span className="flex items-center gap-2">
					<Input
						id="ai-api-key"
						type={revealed ? "text" : "password"}
						value={getKey()}
						onChange={(e) => setKey(e.target.value)}
						placeholder={def.keyPlaceholder}
						autoComplete="off"
						spellCheck={false}
						aria-invalid={status === "invalid"}
						className="h-10 flex-1 font-mono text-[12.5px]"
					/>
					{/* A masked secret you can't read back is a common source of
					    "invalid key" support loops — let the user verify it. */}
					<button
						type="button"
						onClick={() => setRevealed((r) => !r)}
						aria-label={revealed ? "Ẩn API key" : "Hiện API key"}
						title={revealed ? "Ẩn API key" : "Hiện API key"}
						className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border-strong bg-surface text-ink-3 transition-colors hover:text-ink"
					>
						{revealed ? (
							<EyeOff className="size-4" aria-hidden="true" />
						) : (
							<Eye className="size-4" aria-hidden="true" />
						)}
					</button>
				</span>
			</FieldGroup>

			<FieldGroup
				label="Model"
				hint={`Danh sách mặc định là seed. Bấm "Tải lại" để lấy model thực tế từ ${def.label}.`}
			>
				<span className="flex items-center gap-2">
					<Select value={getModel()} onValueChange={(v) => v && setModel(v)}>
						<SelectTrigger className="h-10 flex-1">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{models.map((m) => (
								<SelectItem key={m} value={m}>
									{m}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<GhostButton
						onClick={onRefresh}
						disabled={loading}
						icon={RefreshCw}
						className="h-10 md:h-10"
						title="Tải danh sách model từ nhà cung cấp"
					>
						{loading ? "Đang tải…" : "Tải lại"}
					</GhostButton>
				</span>
			</FieldGroup>
		</div>
	);
}
