import { Sparkles } from "lucide-react";

export default function ThinkingIndicator() {
	return (
		<div
			className="animate-fade-up flex gap-2.5"
			role="status"
			aria-live="polite"
		>
			<span
				aria-hidden="true"
				className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-ta-accent text-ta-accent-fg"
			>
				<Sparkles className="size-3.5" />
			</span>
			<div className="flex items-center gap-1.5 rounded-xl rounded-tl-sm border border-border-default bg-surface-2 px-4 py-3.5">
				{[0, 160, 320].map((delay) => (
					<span
						key={delay}
						aria-hidden="true"
						className="size-1.5 rounded-full bg-ink-4 animate-blink"
						style={{ animationDelay: `${delay}ms` }}
					/>
				))}
				<span className="sr-only">Trợ lý đang soạn câu trả lời…</span>
			</div>
		</div>
	);
}
