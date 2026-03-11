"use client";

import { useState } from "react";

interface UploadZoneProps {
	files: File[];
	onFilesChange: (files: File[]) => void;
}

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export default function UploadZone({ files, onFilesChange }: UploadZoneProps) {
	const [isDragging, setIsDragging] = useState(false);

	const filterFiles = (fileList: FileList): File[] =>
		Array.from(fileList).filter((f) => ACCEPTED_TYPES.includes(f.type));

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => setIsDragging(false);

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const valid = filterFiles(e.dataTransfer.files);
		if (valid.length) onFilesChange(valid);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const valid = filterFiles(e.target.files);
			if (valid.length) onFilesChange(valid);
		}
	};

	return (
		<label
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-[14px] cursor-pointer transition-all
        ${
					isDragging
						? "border-ta-accent-3 bg-ta-accent-3/5"
						: files.length
							? "border-ta-accent-2 bg-ta-accent-2/5"
							: "border-border-strong hover:border-ta-accent-3 hover:bg-canvas-2"
				}`}
		>
			<input
				type="file"
				multiple
				accept=".pdf,.jpg,.jpeg,.png"
				onChange={handleChange}
				className="hidden"
			/>
			<span className="text-3xl">{files.length ? "✅" : "📁"}</span>
			{files.length ? (
				<div className="text-center">
					<p className="text-[13px] text-ta-accent-2 font-medium">
						{files.length} file đã chọn
					</p>
					<p className="text-[11px] font-mono text-ink-3 mt-1">
						{files.map((f) => f.name).join(", ")}
					</p>
				</div>
			) : (
				<div className="text-center">
					<p className="text-[13px] text-ink-2">
						Kéo thả hoặc click để upload CV
					</p>
					<p className="text-[11px] font-mono text-ink-3 mt-1">
						PDF, JPG, JPEG, PNG — nhiều file cùng lúc
					</p>
				</div>
			)}
		</label>
	);
}
