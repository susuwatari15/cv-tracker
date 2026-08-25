"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	BookmarkPlus,
	Check,
	Link2,
	Pencil,
	RotateCcw,
	Trash2,
	X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import GhostButton from "@/components/shared/GhostButton";
import StatusPill from "@/components/shared/StatusPill";
import { useProviderStore } from "@/stores/providerStore";
import { PROVIDERS } from "@/lib/ai/providers";
import { cn } from "@/lib/utils";

/** Đủ để nhận ra key nào mà không hiện toàn bộ trên màn hình. */
function maskKey(key: string): string {
	if (!key) return "chưa có key";
	if (key.length <= 12) return "•".repeat(key.length);
	return `${key.slice(0, 7)}…${key.slice(-4)}`;
}

export default function ConnectionProfiles() {
	const {
		provider,
		profiles,
		activeProfileId,
		saveProfile,
		updateActiveProfile,
		applyProfile,
		renameProfile,
		deleteProfile,
		getKey,
		getModel,
		getEndpointOverride,
		isActiveProfileDirty,
	} = useProviderStore();

	const [creating, setCreating] = useState(false);
	const [newName, setNewName] = useState("");
	const [renamingId, setRenamingId] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const [confirmingId, setConfirmingId] = useState<string | null>(null);

	const createRef = useRef<HTMLInputElement>(null);
	const renameRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (creating) createRef.current?.focus();
	}, [creating]);
	useEffect(() => {
		if (renamingId) renameRef.current?.focus();
	}, [renamingId]);

	const isDirty = isActiveProfileDirty();
	const currentKey = getKey();

	const handleSave = () => {
		if (!currentKey) {
			toast.error("Nhập API key trước khi lưu profile");
			return;
		}
		const name = newName.trim() || PROVIDERS[provider].label;
		if (profiles.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
			toast.error(`Đã có profile tên "${name}"`);
			return;
		}
		saveProfile(name);
		setNewName("");
		setCreating(false);
		toast.success(`Đã lưu profile "${name}"`);
	};

	const handleRename = (id: string) => {
		const name = renameValue.trim();
		if (!name) return;
		renameProfile(id, name);
		setRenamingId(null);
		setRenameValue("");
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="text-[12.5px] font-semibold text-ink">
						Profile kết nối
					</h3>
					<p className="mt-0.5 text-[11.5px] leading-snug text-ink-3">
						Lưu nhiều bộ provider + key + model và đổi qua lại khi cần.
					</p>
				</div>

				{!creating ? (
					<GhostButton
						onClick={() => setCreating(true)}
						icon={BookmarkPlus}
						className="shrink-0"
					>
						Lưu hiện tại
					</GhostButton>
				) : null}
			</div>

			{creating ? (
				<div className="flex flex-col gap-2 rounded-lg border border-ta-accent bg-ta-accent-soft p-3">
					<label
						htmlFor="new-profile-name"
						className="text-[12px] font-medium text-ink-2"
					>
						Tên profile
					</label>
					<div className="flex items-center gap-2">
						<Input
							id="new-profile-name"
							ref={createRef}
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleSave();
								}
								if (e.key === "Escape") {
									setCreating(false);
									setNewName("");
								}
							}}
							placeholder={PROVIDERS[provider].label}
							className="h-10 flex-1 bg-surface"
						/>
						<GhostButton onClick={handleSave} icon={Check} className="h-10 md:h-10">
							Lưu
						</GhostButton>
						<button
							type="button"
							onClick={() => {
								setCreating(false);
								setNewName("");
							}}
							aria-label="Huỷ lưu profile"
							className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border-strong bg-surface text-ink-3 transition-colors hover:text-danger"
						>
							<X className="size-4" aria-hidden="true" />
						</button>
					</div>
					<p className="text-[11.5px] text-ink-3">
						Sẽ lưu: {PROVIDERS[provider].label} · {getModel()} ·{" "}
						<span className="font-mono">{maskKey(currentKey)}</span>
						{getEndpointOverride() ? (
							<>
								{" · "}
								<span className="font-mono">{getEndpointOverride()}</span>
							</>
						) : null}
					</p>
				</div>
			) : null}

			{profiles.length === 0 ? (
				<p className="rounded-lg border border-dashed border-border-default px-3 py-4 text-center text-[12px] text-ink-3">
					Chưa có profile nào. Cấu hình bên dưới rồi bấm “Lưu hiện tại”.
				</p>
			) : (
				<ul className="flex flex-col gap-1.5">
					{profiles.map((profile) => {
						const isActive = profile.id === activeProfileId;
						const def = PROVIDERS[profile.provider];

						return (
							<li
								key={profile.id}
								className={cn(
									"rounded-lg border px-3 py-2.5 transition-colors",
									isActive
										? "border-ta-accent bg-ta-accent-soft"
										: "border-border-default bg-surface",
								)}
							>
								{renamingId === profile.id ? (
									<div className="flex items-center gap-2">
										<label className="sr-only" htmlFor={`rename-${profile.id}`}>
											Tên profile
										</label>
										<Input
											id={`rename-${profile.id}`}
											ref={renameRef}
											value={renameValue}
											onChange={(e) => setRenameValue(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleRename(profile.id);
												}
												if (e.key === "Escape") setRenamingId(null);
											}}
											className="h-9 flex-1 bg-surface"
										/>
										<button
											type="button"
											onClick={() => handleRename(profile.id)}
											aria-label="Lưu tên"
											className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ta-accent transition-colors hover:bg-surface"
										>
											<Check className="size-4" aria-hidden="true" />
										</button>
										<button
											type="button"
											onClick={() => setRenamingId(null)}
											aria-label="Huỷ đổi tên"
											className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-surface"
										>
											<X className="size-4" aria-hidden="true" />
										</button>
									</div>
								) : (
									<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
										<div className="min-w-0 flex-1">
											<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
												<span
													className={cn(
														"min-w-0 break-words text-[13px] font-semibold",
														isActive ? "text-ta-accent" : "text-ink",
													)}
												>
													{profile.name}
												</span>
												{isActive ? (
													<StatusPill tone="info" showIcon={false}>
														Đang dùng
													</StatusPill>
												) : null}
												{isActive && isDirty ? (
													<StatusPill tone="warning">Đã sửa</StatusPill>
												) : null}
											</div>
											<p className="mt-0.5 break-words text-[11.5px] text-ink-3">
												{def.label} · {profile.model} ·{" "}
												<span className="font-mono">
													{maskKey(profile.key)}
												</span>
											</p>
											{/* Endpoint chỉ hiện khi khác mặc định — nếu không
											    thì nó là thông tin thừa trên mọi dòng. */}
											{profile.baseUrl ? (
												<p className="mt-0.5 flex items-center gap-1 break-all text-[11px] text-ink-3">
													<Link2
														className="size-3 shrink-0"
														aria-hidden="true"
													/>
													<span className="font-mono">{profile.baseUrl}</span>
												</p>
											) : null}
										</div>

										<div className="flex shrink-0 items-center justify-end gap-1">
											{!isActive ? (
												<GhostButton
													onClick={() => {
														applyProfile(profile.id);
														toast.success(`Đã chuyển sang "${profile.name}"`);
													}}
												>
													Dùng
												</GhostButton>
											) : null}
											{isActive && isDirty ? (
												<>
													<GhostButton
														onClick={() => {
															updateActiveProfile();
															toast.success("Đã cập nhật profile");
														}}
														icon={Check}
													>
														Cập nhật
													</GhostButton>
													{/* Đối xứng với "Cập nhật": bỏ thay đổi và quay
													    về đúng giá trị đã lưu trong profile. */}
													<GhostButton
														onClick={() => {
															applyProfile(profile.id);
															toast.success("Đã hoàn tác về profile đã lưu");
														}}
														icon={RotateCcw}
													>
														Hoàn tác
													</GhostButton>
												</>
											) : null}
											<button
												type="button"
												onClick={() => {
													setRenamingId(profile.id);
													setRenameValue(profile.name);
													setConfirmingId(null);
												}}
												aria-label={`Đổi tên ${profile.name}`}
												className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-surface hover:text-ink"
											>
												<Pencil className="size-3.5" aria-hidden="true" />
											</button>
											<button
												type="button"
												onClick={() => setConfirmingId(profile.id)}
												aria-label={`Xoá ${profile.name}`}
												className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-danger-soft hover:text-danger"
											>
												<Trash2 className="size-3.5" aria-hidden="true" />
											</button>
										</div>
									</div>
								)}

								{/* Xoá là hành động không hoàn tác được nên phải xác nhận. */}
								{confirmingId === profile.id ? (
									<div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-border-default pt-2.5">
										<p className="flex-1 text-[12px] text-ink-2">
											Xoá profile “{profile.name}”? Kết nối hiện tại không bị
											ngắt.
										</p>
										<GhostButton
											onClick={() => {
												deleteProfile(profile.id);
												setConfirmingId(null);
												toast.success(`Đã xoá "${profile.name}"`);
											}}
											icon={Trash2}
											tone="danger"
										>
											Xoá
										</GhostButton>
										<GhostButton onClick={() => setConfirmingId(null)}>
											Giữ lại
										</GhostButton>
									</div>
								) : null}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
