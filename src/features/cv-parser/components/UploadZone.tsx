"use client";

import { useRef, useState } from "react";
import { FileCheck2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
	files: File[];
	onFilesChange: (files: File[]) => void;
}

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_MB = 20;

function formatSize(bytes: number): string {
	const mb = bytes / 1024 / 1024;
	return mb < 0.1 ? `${Math.round(bytes / 1024)} KB` : `${mb.toFixed(1)} MB`;
}

export default function UploadZone({ files, onFilesChange }: UploadZoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [rejected, setRejected] = useState<string[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const accept = (list: FileList) => {
		const incoming = Array.from(list);
		const ok = incoming.filter(
			(f) => ACCEPTED_TYPES.includes(f.type) && f.size <= MAX_MB * 1024 * 1024,
		);
		const bad = incoming.filter((f) => !ok.includes(f));
		setRejected(bad.map((f) => f.name));
		if (ok.length) onFilesChange([...files, ...ok]);
	};

	const removeAt = (index: number) =>
		onFilesChange(files.filter((_, i) => i !== index));

	return (
		<div className="flex flex-col gap-3">
			{/* The drop zone is a real button: clickable, focusable, Enter/Space
			    activated. It was a bare <label> with a hidden input before, which
			    keyboard users could tab into but not obviously operate. */}
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={(e) => {
					e.preventDefault();
					setIsDragging(false);
					accept(e.dataTransfer.files);
				}}
				className={cn(
					"flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8",
					"transition-colors duration-150",
					isDragging
						? "border-ta-accent bg-ta-accent-soft"
						: "border-border-strong bg-surface-2 hover:border-ta-accent hover:bg-ta-accent-soft",
				)}
			>
				<span
					className={cn(
						"flex size-10 items-center justify-center rounded-full",
						isDragging
							? "bg-surface text-ta-accent"
							: "bg-canvas-2 text-ink-3",
					)}
				>
					<UploadCloud className="size-5" aria-hidden="true" />
				</span>
				<span className="text-[13px] font-medium text-ink">
					Kéo thả CV vào đây, hoặc bấm để chọn tệp
				</span>
				<span className="text-[11.5px] text-ink-3">
					PDF, JPG, PNG · tối đa {MAX_MB}MB mỗi tệp · chọn nhiều tệp cùng lúc
				</span>

				<input
					ref={inputRef}
					type="file"
					multiple
					accept=".pdf,.jpg,.jpeg,.png"
					onChange={(e) => {
						if (e.target.files) accept(e.target.files);
						e.target.value = ""; // allow re-picking the same file
					}}
					className="sr-only"
					tabIndex={-1}
				/>
			</button>

			{rejected.length > 0 ? (
				<p role="alert" className="text-[12px] leading-relaxed text-danger">
					Bỏ qua {rejected.length} tệp không hợp lệ ({rejected.join(", ")}) — chỉ
					nhận PDF, JPG, PNG dưới {MAX_MB}MB.
				</p>
			) : null}

			{files.length > 0 ? (
				<ul className="flex flex-col gap-1.5">
					{files.map((file, i) => (
						<li
							key={`${file.name}-${file.lastModified}`}
							className="flex items-center gap-2.5 rounded-lg border border-border-default bg-surface px-3 py-2"
						>
							<FileCheck2
								className="size-4 shrink-0 text-success"
								aria-hidden="true"
							/>
							<span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">
								{file.name}
							</span>
							<span className="shrink-0 text-[11px] text-ink-3 tabular">
								{formatSize(file.size)}
							</span>
							<button
								type="button"
								onClick={() => removeAt(i)}
								aria-label={`Bỏ tệp ${file.name}`}
								className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-danger-soft hover:text-danger"
							>
								<X className="size-3.5" aria-hidden="true" />
							</button>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
