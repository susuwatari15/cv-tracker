import { QUICK_PROMPTS } from "../types";

interface QuickPromptsProps {
	onSelect: (text: string) => void;
	disabled?: boolean;
}

/**
 * Starter prompts as pill chips — the one place DESIGN.md's full-radius
 * pill treatment is kept, since it reads as a scannable filter row.
 */
export default function QuickPrompts({
	onSelect,
	disabled,
}: QuickPromptsProps) {
	return (
		<div className="mb-2.5 flex flex-wrap gap-1.5">
			{QUICK_PROMPTS.map((prompt) => (
				<button
					key={prompt.label}
					type="button"
					disabled={disabled}
					onClick={() => onSelect(prompt.text)}
					className="cursor-pointer whitespace-nowrap rounded-full border border-border-strong bg-surface px-2.5 py-1.5 text-[11.5px] font-medium text-ink-2 transition-colors duration-150 hover:border-ta-accent hover:bg-ta-accent-soft hover:text-ta-accent disabled:cursor-not-allowed disabled:opacity-60"
				>
					{prompt.label}
				</button>
			))}
		</div>
	);
}
