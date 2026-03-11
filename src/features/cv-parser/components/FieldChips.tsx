import { CV_FIELDS } from "../types";

interface FieldChipsProps {
	selected: Set<string>;
	onToggle: (key: string) => void;
}

export default function FieldChips({ selected, onToggle }: FieldChipsProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{CV_FIELDS.map((field) => (
				<button
					key={field.key}
					onClick={() => onToggle(field.key)}
					type="button"
					className={`px-3 py-[5px] rounded-full text-[11px] font-mono border transition-all
            ${
							selected.has(field.key)
								? "bg-ta-accent-3/10 border-ta-accent-3 text-ta-accent-3"
								: "border-border-strong text-ink-2 bg-surface hover:border-ta-accent-3 hover:text-ta-accent-3"
						}`}
				>
					{field.label}
				</button>
			))}
		</div>
	);
}
