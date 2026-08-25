"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
	const [error, setError] = useState("");
	const keyRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (adding) keyRef.current?.focus();
	}, [adding]);

	const reset = () => {
		setNewKey("");
		setNewLabel("");
		setError("");
		setAdding(false);
	};

	const handleAdd = () => {
		const key = newKey.trim().replace(/\s+/g, "_").toLowerCase();
		const label = newLabel.trim();
		if (!key || !label) {
			setError("Cần cả khoá và nhãn hiển thị.");
			return;
		}
		if (fields.some((f) => f.key === key)) {
			setError(`Khoá "${key}" đã tồn tại.`);
			return;
		}
		onAddField({ key, label });
		reset();
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAdd();
		}
		if (e.key === "Escape") reset();
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap gap-2">
				{fields.map((field) => {
					const isOn = selected.has(field.key);
					return (
						<span key={field.key} className="group/chip relative inline-flex">
							{/* Selection is a toggle, so it carries aria-pressed and a
							    check glyph — the state doesn't rest on colour alone. */}
							<button
								type="button"
								onClick={() => onToggle(field.key)}
								aria-pressed={isOn}
								className={cn(
									"inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border py-1.5 pl-3 pr-8",
									"text-[12px] font-medium transition-colors duration-150",
									isOn
										? "border-ta-accent bg-ta-accent-soft text-ta-accent"
										: "border-border-strong bg-surface text-ink-2 hover:border-ta-accent hover:text-ta-accent",
								)}
							>
								<Check
									className={cn(
										"size-3 shrink-0 transition-opacity",
										isOn ? "opacity-100" : "opacity-0",
									)}
									aria-hidden="true"
								/>
								{field.label}
							</button>
							<button
								type="button"
								onClick={() => onRemoveField(field.key)}
								aria-label={`Xoá trường ${field.label}`}
								title={`Xoá trường ${field.label}`}
								/* Always visible: this used to appear only on hover, which
								   left no way to remove a field on a touch device. */
								className="absolute right-1 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-ink-4 transition-colors hover:bg-danger-soft hover:text-danger"
							>
								<X className="size-3" aria-hidden="true" />
							</button>
						</span>
					);
				})}

				{adding ? (
					<span className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-ta-accent bg-ta-accent-soft py-1 pl-3 pr-1.5">
						<label className="sr-only" htmlFor="new-field-key">
							Khoá trường
						</label>
						<input
							id="new-field-key"
							ref={keyRef}
							value={newKey}
							onChange={(e) => setNewKey(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="khoa_json"
							className="w-[86px] bg-transparent font-mono text-[11.5px] text-ink outline-none placeholder:text-ink-4"
						/>
						<span aria-hidden="true" className="text-ink-4">
							/
						</span>
						<label className="sr-only" htmlFor="new-field-label">
							Nhãn hiển thị
						</label>
						<input
							id="new-field-label"
							value={newLabel}
							onChange={(e) => setNewLabel(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Nhãn"
							className="w-[86px] bg-transparent text-[11.5px] text-ink outline-none placeholder:text-ink-4"
						/>
						<button
							type="button"
							onClick={handleAdd}
							aria-label="Thêm trường"
							className="flex size-6 cursor-pointer items-center justify-center rounded-full text-ta-accent transition-colors hover:bg-surface"
						>
							<Check className="size-3.5" aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={reset}
							aria-label="Huỷ"
							className="flex size-6 cursor-pointer items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-surface hover:text-danger"
						>
							<X className="size-3.5" aria-hidden="true" />
						</button>
					</span>
				) : (
					<button
						type="button"
						onClick={() => setAdding(true)}
						className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-full border border-dashed border-border-strong bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-3 transition-colors duration-150 hover:border-ta-accent hover:text-ta-accent"
					>
						<Plus className="size-3" aria-hidden="true" />
						Thêm trường
					</button>
				)}
			</div>

			{error ? (
				<p role="alert" className="text-[11.5px] font-medium text-danger">
					{error}
				</p>
			) : null}

			<p className="text-[11.5px] text-ink-3">
				{selected.size}/{fields.length} trường được chọn — chỉ những trường bật
				mới xuất hiện trong kết quả và tệp xuất.
			</p>
		</div>
	);
}
