"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronRight, X } from "lucide-react";
import { useToolStore } from "@/stores/toolStore";
import { useProviderStore } from "@/stores/providerStore";
import { useShellStore } from "@/stores/shellStore";
import { TOOLS, TOOL_GROUPS } from "@/lib/toolMeta";
import ApiStatusDot from "./ApiStatusDot";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const STATUS_COPY: Record<string, string> = {
	valid: "Đã kết nối",
	invalid: "Key không hợp lệ",
	empty: "Chưa cấu hình",
};

function NavContent() {
	const { activeTool, setActiveTool } = useToolStore();
	const status = useProviderStore((s) => s.status);
	const setNavOpen = useShellStore((s) => s.setNavOpen);

	const overview = TOOLS.chat;
	const OverviewIcon = overview.icon;

	const select = (id: typeof activeTool) => {
		setActiveTool(id);
		setNavOpen(false); // drawer must close on navigate, or the choice is hidden
	};

	return (
		<>
			{/* Brand */}
			<div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
				{/* The mark is dark blue — it needs a light tile to read on the rail */}
				<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white p-1">
					<Image
						src="/logo.png"
						alt=""
						width={64}
						height={64}
						priority
						className="size-full object-contain"
					/>
				</span>
				<span className="min-w-0">
					<span className="block truncate text-[15px] font-bold leading-tight tracking-tight text-white">
						TA Assistant
					</span>
					<span className="block truncate text-[11px] leading-tight text-white/55">
						Talent Acquisition Toolkit
					</span>
				</span>
			</div>

			{/* Navigation */}
			<nav aria-label="Công cụ" className="flex-1 overflow-y-auto px-3 py-4">
				<NavItem
					label={overview.label}
					Icon={OverviewIcon}
					active={activeTool === "chat"}
					onClick={() => select("chat")}
				/>

				{TOOL_GROUPS.map((group) => (
					<div key={group.label} className="mt-5">
						<h2 className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/55">
							{group.label}
						</h2>
						<ul className="flex flex-col gap-0.5">
							{group.tools.map((id) => {
								const tool = TOOLS[id];
								return (
									<li key={id}>
										<NavItem
											label={tool.label}
											Icon={tool.icon}
											active={activeTool === id}
											onClick={() => select(id)}
										/>
									</li>
								);
							})}
						</ul>
					</div>
				))}
			</nav>

			{/* Connection status — reachable from every screen */}
			<button
				type="button"
				onClick={() => select("settings")}
				className="flex w-full cursor-pointer items-center gap-2.5 border-t border-white/10 px-5 py-3 text-left transition-colors hover:bg-white/5"
			>
				<ApiStatusDot status={status} onDark />
				<span className="min-w-0 flex-1">
					<span className="block text-[11px] leading-tight text-white/55">
						Kết nối AI
					</span>
					<span className="block truncate text-[12px] font-medium leading-tight text-white/85">
						{STATUS_COPY[status] ?? status}
					</span>
				</span>
				<ChevronRight
					className="size-3.5 shrink-0 text-white/50"
					aria-hidden="true"
				/>
			</button>

			{/* Account + appearance */}
			<div className="flex items-center gap-3 border-t border-white/10 px-5 py-4">
				<Image
					src="/user.png"
					alt=""
					width={64}
					height={64}
					className="size-8 shrink-0 rounded-full bg-white/10 object-cover"
				/>
				<span className="min-w-0 flex-1">
					<span className="block truncate text-[12.5px] font-medium leading-tight text-white">
						Hue Nguyen
					</span>
					<span className="block truncate text-[11px] leading-tight text-white/55">
						TA Manager
					</span>
				</span>
				<ThemeToggle />
			</div>
		</>
	);
}

function NavItem({
	label,
	Icon,
	active,
	onClick,
}: {
	label: string;
	Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-current={active ? "page" : undefined}
			className={cn(
				"relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2 pl-3 pr-2.5",
				"text-left text-[13px] font-medium transition-colors duration-150",
				active
					? "bg-white/10 text-white"
					: "text-white/60 hover:bg-white/5 hover:text-white/90",
			)}
		>
			{/* Active marker: a shape, not just a tint — survives greyscale */}
			<span
				aria-hidden="true"
				className={cn(
					"absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-opacity",
					active ? "bg-ta-accent opacity-100" : "opacity-0",
				)}
			/>
			<Icon className="size-4 shrink-0" aria-hidden={true} />
			<span className="truncate">{label}</span>
		</button>
	);
}

export default function Sidebar() {
	const { navOpen, setNavOpen } = useShellStore();

	// Escape closes the drawer — every overlay needs a keyboard exit.
	useEffect(() => {
		if (!navOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setNavOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [navOpen, setNavOpen]);

	return (
		<>
			{/* Docked rail — lg and up */}
			<aside className="hidden h-full w-[264px] min-w-[264px] shrink-0 flex-col border-r border-white/10 bg-rail lg:flex">
				<NavContent />
			</aside>

			{/* Off-canvas drawer — below lg */}
			<div
				className={cn(
					"fixed inset-0 z-50 overflow-hidden lg:hidden",
					navOpen ? "pointer-events-auto" : "pointer-events-none",
				)}
				aria-hidden={!navOpen}
			>
				{/* Scrim strong enough to isolate the drawer from the page behind */}
				<div
					onClick={() => setNavOpen(false)}
					className={cn(
						"absolute inset-0 bg-black/50 transition-opacity duration-200",
						navOpen ? "opacity-100" : "opacity-0",
					)}
				/>
				<aside
					role="dialog"
					aria-modal={navOpen}
					aria-label="Điều hướng"
					className={cn(
						"absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-rail shadow-e4",
						"transition-transform duration-200 ease-out",
						navOpen ? "translate-x-0" : "-translate-x-full",
					)}
				>
					<button
						type="button"
						onClick={() => setNavOpen(false)}
						aria-label="Đóng điều hướng"
						className="absolute right-3 top-4 flex size-9 cursor-pointer items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
					>
						<X className="size-4" aria-hidden="true" />
					</button>
					<NavContent />
				</aside>
			</div>
		</>
	);
}
