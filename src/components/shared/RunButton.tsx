"use client";

import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RunButtonProps {
	isLoading: boolean;
	disabled: boolean;
	label: string;
	loadingLabel?: string;
	/** Explains *why* the button is disabled — shown below it. */
	disabledHint?: string;
	onClick: () => void;
}

/**
 * The one primary action per tool screen. Navy fill so it reads as the
 * single commitment point; every other control on the screen is
 * visually subordinate.
 */
export default function RunButton({
	isLoading,
	disabled,
	label,
	loadingLabel,
	disabledHint,
	onClick,
}: RunButtonProps) {
	const isBlocked = disabled || isLoading;

	return (
		<div className="flex flex-col gap-2">
			<button
				type="button"
				onClick={onClick}
				disabled={isBlocked}
				aria-busy={isLoading}
				className={cn(
					"inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2",
					"rounded-lg bg-ta-accent px-6 text-sm font-semibold text-ta-accent-fg",
					"shadow-e1 transition-colors duration-200",
					"hover:bg-ta-accent-hover active:bg-ta-accent-hover",
					"disabled:cursor-not-allowed disabled:bg-border-strong disabled:text-ink-3 disabled:shadow-none",
				)}
			>
				{isLoading ? (
					<>
						<Loader2 className="size-4 animate-spin" aria-hidden="true" />
						{loadingLabel ?? "Đang xử lý…"}
					</>
				) : (
					<>
						<Sparkles className="size-4" aria-hidden="true" />
						{label}
					</>
				)}
			</button>

			{disabled && !isLoading && disabledHint ? (
				<p className="text-center text-[11.5px] text-ink-3">{disabledHint}</p>
			) : null}
		</div>
	);
}
