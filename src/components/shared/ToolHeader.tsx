"use client";

import { Menu } from "lucide-react";
import { useToolStore } from "@/stores/toolStore";
import { useProviderStore } from "@/stores/providerStore";
import { useShellStore } from "@/stores/shellStore";
import { getTool } from "@/lib/toolMeta";
import { PROVIDERS } from "@/lib/ai/providers";

export default function ToolHeader() {
	const activeTool = useToolStore((s) => s.activeTool);
	const provider = useProviderStore((s) => s.provider);
	const model = useProviderStore((s) => s.getModel());
	const setNavOpen = useShellStore((s) => s.setNavOpen);

	const tool = getTool(activeTool);
	const Icon = tool.icon;

	return (
		<header className="flex shrink-0 items-center gap-3 border-b border-border-default bg-surface px-4 py-3 md:px-7 md:py-4">
			{/* Drawer trigger — the only way to reach nav below lg */}
			<button
				type="button"
				onClick={() => setNavOpen(true)}
				aria-label="Mở điều hướng"
				className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border-default text-ink-2 transition-colors hover:bg-canvas-2 lg:hidden"
			>
				<Menu className="size-4" aria-hidden="true" />
			</button>

			<span className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-ta-accent-soft text-ta-accent md:flex">
				<Icon className="size-4" aria-hidden="true" />
			</span>

			<div className="min-w-0 flex-1">
				<h1 className="truncate text-[15px] font-bold leading-tight tracking-tight text-ink md:text-base">
					{tool.label}
				</h1>
				<p className="mt-0.5 hidden truncate text-[12.5px] leading-tight text-ink-3 sm:block">
					{tool.description}
				</p>
			</div>

			{/* Which model produced the output — an audit detail HR needs */}
			<span
				title={`${PROVIDERS[provider]?.label ?? provider} · ${model}`}
				className="hidden max-w-[260px] shrink items-center gap-2 whitespace-nowrap rounded-full border border-border-default bg-canvas-2 px-3 py-1.5 xl:flex"
			>
				<span className="shrink-0 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-3">
					{PROVIDERS[provider]?.label ?? provider}
				</span>
				<span className="h-3 w-px bg-border-strong" aria-hidden="true" />
				<span className="truncate font-mono text-[11px] text-ink-2">
					{model}
				</span>
			</span>
		</header>
	);
}
