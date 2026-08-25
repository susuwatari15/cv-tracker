"use client";

import { ArrowRight, KeyRound, Sparkles } from "lucide-react";
import { useToolStore } from "@/stores/toolStore";
import { useProviderStore } from "@/stores/providerStore";
import { TOOL_GROUPS, TOOLS } from "@/lib/toolMeta";
import StatusPill from "@/components/shared/StatusPill";
import type { ToolId } from "@/types";

/**
 * Landing surface for the workspace. Replaces the previous dead-end screen
 * that only said "the chat panel is on the right" — a screen that told the
 * user something they could already see and gave them nothing to act on.
 */
export default function OverviewHub() {
	const setActiveTool = useToolStore((s) => s.setActiveTool);
	const status = useProviderStore((s) => s.status);

	const notReady = status !== "valid";

	return (
		<div className="mx-auto max-w-[1000px]">
			{/* Setup gate — the one thing blocking every tool, surfaced first */}
			{notReady ? (
				<section className="mb-6 flex flex-col gap-4 rounded-xl border border-warning-border bg-warning-soft p-5 sm:flex-row sm:items-center">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface/70 text-warning">
						<KeyRound className="size-4" aria-hidden="true" />
					</span>
					<div className="min-w-0 flex-1">
						<h2 className="text-sm font-semibold text-ink">
							Cần cấu hình kết nối AI
						</h2>
						<p className="mt-1 text-[13px] leading-relaxed text-ink-2">
							{status === "invalid"
								? "API key hiện tại không đúng định dạng của nhà cung cấp đã chọn. Kiểm tra lại trong phần Cấu hình."
								: "Thêm API key để bắt đầu dùng các công cụ bên dưới. Key chỉ lưu trên trình duyệt của bạn."}
						</p>
					</div>
					<button
						type="button"
						onClick={() => setActiveTool("settings")}
						className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-ta-accent px-4 text-[13px] font-semibold text-ta-accent-fg transition-colors hover:bg-ta-accent-hover"
					>
						Mở Cấu hình
						<ArrowRight className="size-3.5" aria-hidden="true" />
					</button>
				</section>
			) : (
				<section className="mb-6 flex items-center gap-3 rounded-xl border border-border-default bg-surface p-4 shadow-e1">
					<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success">
						<Sparkles className="size-4" aria-hidden="true" />
					</span>
					<p className="min-w-0 flex-1 text-[13px] text-ink-2">
						Kết nối AI đã sẵn sàng. Chọn một công cụ để bắt đầu, hoặc hỏi trợ lý
						ở panel bên phải.
					</p>
					<StatusPill tone="success">Sẵn sàng</StatusPill>
				</section>
			)}

			{/* Tool directory, grouped by pipeline stage */}
			{TOOL_GROUPS.filter((g) => g.label !== "Hệ thống").map((group) => (
				<section key={group.label} className="mb-7">
					<h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
						{group.label}
					</h2>
					<ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{group.tools.map((id) => (
							<li key={id}>
								<ToolCard id={id} onOpen={setActiveTool} />
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}

function ToolCard({
	id,
	onOpen,
}: {
	id: ToolId;
	onOpen: (id: ToolId) => void;
}) {
	const tool = TOOLS[id];
	const Icon = tool.icon;

	return (
		<button
			type="button"
			onClick={() => onOpen(id)}
			className="group/card flex h-full w-full cursor-pointer flex-col rounded-xl border border-border-default bg-surface p-4 text-left shadow-e1 transition-[border-color,box-shadow] duration-200 hover:border-ta-accent hover:shadow-e3"
		>
			<span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-canvas-2 text-ink-2 transition-colors group-hover/card:bg-ta-accent-soft group-hover/card:text-ta-accent">
				<Icon className="size-4" aria-hidden="true" />
			</span>
			<span className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
				{tool.label}
				<ArrowRight
					className="size-3.5 shrink-0 text-ink-4 transition-transform duration-200 group-hover/card:translate-x-0.5 group-hover/card:text-ta-accent"
					aria-hidden="true"
				/>
			</span>
			<span className="mt-1.5 text-[12.5px] leading-relaxed text-ink-3">
				{tool.description}
			</span>
		</button>
	);
}
