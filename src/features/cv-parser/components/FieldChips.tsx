import { useState, useRef, useEffect } from "react";
import type { CvField } from "../types";

interface FieldChipsProps {
	fields: CvField[];
	selected: Set<string>;
	onToggle: (key: string) => void;
	onAddField: (field: CvField) => void;
	onRemoveField: (key: string) => void;
}

export default function FieldChips({
	fields,
	selected,
	onToggle,
	onAddField,
	onRemoveField,
}: FieldChipsProps) {
	const [adding, setAdding] = useState(false);
	const [newKey, setNewKey] = useState("");
	const [newLabel, setNewLabel] = useState("");
	const keyRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (adding) keyRef.current?.focus();
	}, [adding]);

	const handleAdd = () => {
		const key = newKey.trim().replace(/\s+/g, "_").toLowerCase();
		const label = newLabel.trim();
		if (!key || !label) return;
		if (fields.some((f) => f.key === key)) return;
		onAddField({ key, label });
		setNewKey("");
		setNewLabel("");
		setAdding(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleAdd();
		if (e.key === "Escape") {
			setAdding(false);
			setNewKey("");
			setNewLabel("");
		}
	};

	return (
		<div className="flex flex-wrap gap-2 items-center">
			{fields.map((field) => (
				<div key={field.key} className="group relative inline-flex">
					<button
						onClick={() => onToggle(field.key)}
						type="button"
						className={`px-3 py-[5px] rounded-full text-[11px] font-mono border transition-all pr-6
              ${
								selected.has(field.key)
									? "bg-ta-accent-3/10 border-ta-accent-3 text-ta-accent-3"
									: "border-border-strong text-ink-2 bg-surface hover:border-ta-accent-3 hover:text-ta-accent-3"
							}`}
					>
						{field.label}
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onRemoveField(field.key);
						}}
						title="Xóa trường này"
						className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-ink-3 hover:text-red-400 leading-none"
					>
						✕
					</button>
				</div>
			))}

			{adding ? (
				<div className="flex items-center gap-1.5 border border-ta-accent-3/60 rounded-full px-2 py-[3px] bg-ta-accent-3/5">
					<input
						ref={keyRef}
						value={newKey}
						onChange={(e) => setNewKey(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="key"
						className="text-[11px] font-mono bg-transparent outline-none w-[72px] text-ink-1 placeholder:text-ink-3"
					/>
					<span className="text-ink-3 text-[10px]">/</span>
					<input
						value={newLabel}
						onChange={(e) => setNewLabel(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="label"
						className="text-[11px] font-mono bg-transparent outline-none w-[80px] text-ink-1 placeholder:text-ink-3"
					/>
					<button
						type="button"
						onClick={handleAdd}
						className="text-[10px] text-ta-accent-3 hover:text-ta-accent-3/70 font-mono ml-0.5"
					>
						✓
					</button>
					<button
						type="button"
						onClick={() => {
							setAdding(false);
							setNewKey("");
							setNewLabel("");
						}}
						className="text-[10px] text-ink-3 hover:text-red-400 font-mono"
					>
						✕
					</button>
				</div>
			) : (
				<button
					type="button"
					onClick={() => setAdding(true)}
					title="Thêm trường mới"
					className="px-3 py-[5px] rounded-full text-[11px] font-mono border border-dashed border-border-strong text-ink-3 bg-surface hover:border-ta-accent-3 hover:text-ta-accent-3 transition-all"
				>
					+ Thêm
				</button>
			)}
		</div>
	);
}
