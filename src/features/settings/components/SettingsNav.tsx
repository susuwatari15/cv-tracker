"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SettingsSectionId } from "../types";

export interface SettingsNavItem {
	id: SettingsSectionId;
	label: string;
	description: string;
	icon: LucideIcon;
	/** Shows an unsaved-changes marker on the item. */
	dirty?: boolean;
}

interface SettingsNavProps {
	items: SettingsNavItem[];
	active: SettingsSectionId;
	onChange: (id: SettingsSectionId) => void;
}

/**
 * Secondary navigation for the settings screen.
 *
 * Implemented as a real tablist rather than a list of links: it swaps panels
 * within the same screen, so arrow-key traversal is what keyboard users
 * expect. Renders as a vertical rail from md up, and as a horizontal
 * segmented row below that — a nested drawer inside an already-drawered
 * layout would be a dead end on a phone.
 */
export default function SettingsNav({
	items,
	active,
	onChange,
}: SettingsNavProps) {
	const refs = useRef<(HTMLButtonElement | null)[]>([]);

	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		const last = items.length - 1;
		let next: number | null = null;

		if (e.key === "ArrowDown" || e.key === "ArrowRight") next = index === last ? 0 : index + 1;
		if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
		if (e.key === "Home") next = 0;
		if (e.key === "End") next = last;

		if (next === null) return;
		e.preventDefault();
		onChange(items[next].id);
		refs.current[next]?.focus();
	};

	return (
		<nav
			role="tablist"
			aria-orientation="vertical"
			aria-label="Nhóm cấu hình"
			className={cn(
				"flex gap-1.5 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0",
				// Keep the rail pinned while a long panel scrolls past it.
				"md:sticky md:top-0 md:self-start",
			)}
		>
			{items.map((item, i) => {
				const Icon = item.icon;
				const isActive = active === item.id;

				return (
					<button
						key={item.id}
						ref={(el) => {
							refs.current[i] = el;
						}}
						type="button"
						role="tab"
						id={`settings-tab-${item.id}`}
						aria-selected={isActive}
						aria-controls={`settings-panel-${item.id}`}
						// Only the active tab is in the tab order; arrows move between them.
						tabIndex={isActive ? 0 : -1}
						onClick={() => onChange(item.id)}
						onKeyDown={(e) => handleKeyDown(e, i)}
						className={cn(
							"group/tab relative flex min-h-11 shrink-0 cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left",
							"transition-colors duration-150 md:min-h-0 md:w-full md:shrink",
							isActive
								? "border-ta-accent bg-ta-accent-soft"
								: "border-transparent bg-surface hover:border-border-default hover:bg-surface-2 md:bg-transparent",
						)}
					>
						<Icon
							className={cn(
								"mt-px size-4 shrink-0",
								isActive ? "text-ta-accent" : "text-ink-3",
							)}
							aria-hidden="true"
						/>
						<span className="min-w-0">
							<span
								className={cn(
									"flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold md:whitespace-normal",
									isActive ? "text-ta-accent" : "text-ink",
								)}
							>
								{item.label}
								{item.dirty ? (
									<span
										// Dot is redundant with the sr-only text, so it's decorative.
										aria-hidden="true"
										className="size-1.5 shrink-0 rounded-full bg-warning"
									/>
								) : null}
								{item.dirty ? (
									<span className="sr-only">(có thay đổi chưa lưu)</span>
								) : null}
							</span>
							<span className="mt-0.5 hidden text-[11.5px] leading-snug text-ink-3 md:block">
								{item.description}
							</span>
						</span>
					</button>
				);
			})}
		</nav>
	);
}
