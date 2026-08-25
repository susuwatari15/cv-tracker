"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "danger";

const TONES: Record<Tone, string> = {
	default: "text-ink-2 hover:border-ta-accent hover:text-ta-accent",
	success: "border-success-border text-success",
	danger: "text-ink-2 hover:border-danger hover:text-danger",
};

/**
 * Secondary action used across output toolbars (copy / download / clear).
 * 32px tall on pointer devices, 40px on touch so it clears the 44px
 * guidance once the 4px gap between neighbours is counted.
 */
export default function GhostButton({
	children,
	icon: Icon,
	onClick,
	tone = "default",
	disabled,
	className,
	type = "button",
	title,
}: {
	children: React.ReactNode;
	icon?: LucideIcon;
	onClick?: () => void;
	tone?: Tone;
	disabled?: boolean;
	className?: string;
	type?: "button" | "submit";
	title?: string;
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			title={title}
			className={cn(
				"inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3",
				"text-[12.5px] font-medium transition-colors duration-150 md:h-8",
				"disabled:cursor-not-allowed disabled:opacity-60",
				TONES[tone],
				className,
			)}
		>
			{Icon ? <Icon className="size-3.5 shrink-0" aria-hidden="true" /> : null}
			{children}
		</button>
	);
}
