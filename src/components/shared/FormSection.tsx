import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
	title: string;
	/** Lucide icon component — never an emoji string. */
	icon?: LucideIcon;
	/** Optional guidance shown under the title, before the fields. */
	hint?: string;
	/** Right-aligned slot for section-level controls. */
	action?: React.ReactNode;
	children: React.ReactNode;
}

export default function FormSection({
	title,
	icon: Icon,
	hint,
	action,
	children,
}: FormSectionProps) {
	return (
		<section className="mb-4 rounded-xl border border-border-default bg-surface shadow-e1">
			<header className="flex items-start justify-between gap-4 border-b border-border-soft px-5 py-4">
				<div className="flex min-w-0 items-start gap-3">
					{Icon ? (
						<span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-ta-accent-soft text-ta-accent">
							<Icon className="size-4" aria-hidden="true" />
						</span>
					) : null}
					<div className="min-w-0">
						<h2 className="text-sm font-semibold leading-5 text-ink">
							{title}
						</h2>
						{hint ? (
							<p className="mt-1 text-[12.5px] leading-relaxed text-ink-3">
								{hint}
							</p>
						) : null}
					</div>
				</div>
				{action ? <div className="shrink-0">{action}</div> : null}
			</header>
			<div className="p-5">{children}</div>
		</section>
	);
}
