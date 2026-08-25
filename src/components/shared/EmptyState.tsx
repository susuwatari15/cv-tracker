import type { LucideIcon } from "lucide-react";

/**
 * Empty states explain what to do next instead of leaving a blank pane.
 * Every tool surface that can render "nothing yet" uses this.
 */
export default function EmptyState({
	icon: Icon,
	title,
	description,
	action,
}: {
	icon: LucideIcon;
	title: string;
	description: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-default bg-surface/60 px-6 py-12 text-center">
			<span className="mb-4 flex size-11 items-center justify-center rounded-full bg-canvas-2 text-ink-3">
				<Icon className="size-5" aria-hidden="true" />
			</span>
			<h3 className="text-sm font-semibold text-ink">{title}</h3>
			<p className="mt-1.5 max-w-[38ch] text-[13px] leading-relaxed text-ink-3">
				{description}
			</p>
			{action ? <div className="mt-5">{action}</div> : null}
		</div>
	);
}
