"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
	Download,
	FileSpreadsheet,
	ScanText,
	SlidersHorizontal,
	Trash2,
	Users,
} from "lucide-react";
import { useProviderStore } from "@/stores/providerStore";
import { useCvFieldsStore } from "@/stores/cvFieldsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import FormSection from "@/components/shared/FormSection";
import RunButton from "@/components/shared/RunButton";
import CopyButton from "@/components/shared/CopyButton";
import GhostButton from "@/components/shared/GhostButton";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import UploadZone from "../components/UploadZone";
import FieldChips from "../components/FieldChips";
import ParsedResultCard from "../components/ParsedResultCard";
import type { ParsedCv } from "../types";

export default function CvParserContainer() {
	const [files, setFiles] = useState<File[]>([]);
	const [results, setResults] = useState<ParsedCv[]>([]);
	const [parsedNames, setParsedNames] = useState<string[]>([]);
	const [progress, setProgress] = useState<{ done: number; total: number } | null>(
		null,
	);

	const status = useProviderStore((s) => s.status);
	const { isLoading, call } = useClaudeApi();

	// Extraction schema is persisted in a store hydrated at startup.
	const fields = useCvFieldsStore((s) => s.fields);
	const selectedFields = useCvFieldsStore((s) => s.selected);
	const toggleField = useCvFieldsStore((s) => s.toggle);
	const addField = useCvFieldsStore((s) => s.addField);
	const removeField = useCvFieldsStore((s) => s.removeField);

	const fileToBase64 = (file: File): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve((reader.result as string).split(",")[1]);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});

	const getMediaType = (file: File): string => {
		if (file.type === "application/pdf") return "application/pdf";
		if (file.type === "image/png") return "image/png";
		return "image/jpeg";
	};

	const handleParse = async () => {
		if (!files.length) {
			toast.error("Chưa có tệp CV nào để bóc tách");
			return;
		}
		if (!selectedFields.size) {
			toast.error("Chọn ít nhất một trường cần trích xuất");
			return;
		}

		const fieldKeys = Array.from(selectedFields);
		const parsed: ParsedCv[] = [];
		const names: string[] = [];
		let failed = 0;

		for (let i = 0; i < files.length; i++) {
			setProgress({ done: i, total: files.length });
			const b64 = await fileToBase64(files[i]);
			const mt = getMediaType(files[i]);
			const fieldList = fieldKeys
				.map((k) => `- "${k}": ${fields.find((f) => f.key === k)?.label ?? k}`)
				.join("\n");

			const prompt = `Bạn là CV parser chuyên nghiệp. Extract thông tin sau từ CV này và trả về JSON thuần (không markdown):\n${fieldList}\nQuy tắc: Nếu không tìm thấy → null. "skills" là array. "years_exp" là số. "summary" là 1-2 câu tiếng Việt.`;

			const contentBlock =
				mt === "application/pdf"
					? {
							type: "document",
							source: { type: "base64", media_type: mt, data: b64 },
						}
					: {
							type: "image",
							source: { type: "base64", media_type: mt, data: b64 },
						};

			const result = await call({
				messages: [
					{
						role: "user",
						content: [contentBlock, { type: "text", text: prompt }],
					},
				],
				maxTokens: 1000,
			});

			if (!result) {
				failed++;
				continue;
			}

			try {
				parsed.push(JSON.parse(result.replace(/```json|```/g, "").trim()));
				names.push(files[i].name);
			} catch {
				failed++;
				toast.error(`Không đọc được kết quả cho ${files[i].name}`);
			}
		}

		setProgress(null);
		setResults(parsed);
		setParsedNames(names);

		if (parsed.length) {
			toast.success(
				failed
					? `Bóc tách ${parsed.length} CV, ${failed} tệp lỗi`
					: `Đã bóc tách ${parsed.length} CV`,
			);
		}
	};

	const fieldKeys = Array.from(selectedFields);

	const getTabSeparatedRow = (): string => {
		const header = fieldKeys
			.map((k) => fields.find((f) => f.key === k)?.label ?? k)
			.join("\t");
		const rows = results.map((r) =>
			fieldKeys
				.map((k) => {
					const v = r[k];
					return Array.isArray(v) ? v.join(", ") : (v ?? "");
				})
				.join("\t"),
		);
		return [header, ...rows].join("\n");
	};

	const handleDownloadCsv = () => {
		const csv = getTabSeparatedRow().replace(/\t/g, ",");
		const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `cv_parsed_${Date.now()}.csv`;
		a.click();
		URL.revokeObjectURL(a.href);
		toast.success("Đã tải CSV");
	};

	const handleDownloadExcel = () => {
		const headers = fieldKeys.map(
			(k) => fields.find((f) => f.key === k)?.label ?? k,
		);
		const rows = results.map((r) =>
			Object.fromEntries(
				fieldKeys.map((k, i) => {
					const v = r[k];
					return [headers[i], Array.isArray(v) ? v.join(", ") : (v ?? "")];
				}),
			),
		);
		const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "CV Parsed");
		XLSX.writeFile(workbook, `cv_parsed_${Date.now()}.xlsx`);
		toast.success("Đã tải Excel");
	};

	const handleClear = () => {
		setResults([]);
		setParsedNames([]);
	};

	return (
		<div className="mx-auto max-w-[820px]">
			<FormSection
				title="Tệp CV"
				icon={ScanText}
				hint="Hỗ trợ PDF và ảnh. Mỗi tệp được xử lý thành một dòng dữ liệu."
			>
				<UploadZone files={files} onFilesChange={setFiles} />
			</FormSection>

			<FormSection
				title="Trường cần trích xuất"
				icon={SlidersHorizontal}
				hint="Danh sách này được lưu lại trên trình duyệt cho lần dùng sau."
			>
				<FieldChips
					fields={fields}
					selected={selectedFields}
					onToggle={toggleField}
					onAddField={addField}
					onRemoveField={removeField}
				/>
			</FormSection>

			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid" || !files.length || !selectedFields.size}
				label={
					files.length > 1
						? `Bóc tách ${files.length} CV`
						: "Bóc tách CV"
				}
				loadingLabel={
					progress
						? `Đang xử lý CV ${progress.done + 1}/${progress.total}…`
						: "Đang xử lý…"
				}
				disabledHint={
					status !== "valid"
						? "Cần API key hợp lệ — mở Cấu hình để kết nối."
						: !files.length
							? "Tải lên ít nhất một tệp CV."
							: "Chọn ít nhất một trường cần trích xuất."
				}
				onClick={handleParse}
			/>

			{/* Progress bar reserves its own height, so the results below don't jump */}
			{progress ? (
				<div className="mt-4 rounded-xl border border-border-default bg-surface p-4">
					<div className="mb-2 flex items-center justify-between text-[12px]">
						<span className="font-medium text-ink-2">
							Đang bóc tách {progress.done + 1} / {progress.total}
						</span>
						<span className="text-ink-3 tabular">
							{Math.round((progress.done / progress.total) * 100)}%
						</span>
					</div>
					<div
						role="progressbar"
						aria-valuemin={0}
						aria-valuemax={progress.total}
						aria-valuenow={progress.done}
						className="h-1.5 overflow-hidden rounded-full bg-canvas-2"
					>
						<div
							className="h-full rounded-full bg-ta-accent transition-[width] duration-300"
							style={{
								width: `${(progress.done / progress.total) * 100}%`,
							}}
						/>
					</div>
					<div className="mt-4 grid grid-cols-2 gap-3">
						{fieldKeys.slice(0, 4).map((k) => (
							<Skeleton key={k} className="h-16" />
						))}
					</div>
				</div>
			) : null}

			{!progress && results.length > 0 ? (
				<div className="animate-fade-up mt-4 rounded-xl border border-border-default bg-surface shadow-e2">
					<header className="flex items-center gap-2 border-b border-border-soft bg-surface-2 px-5 py-3">
						<Users className="size-3.5 text-ink-3" aria-hidden="true" />
						<h2 className="text-[12.5px] font-semibold text-ink-2">
							Dữ liệu đã bóc tách ({results.length} ứng viên)
						</h2>
					</header>

					<div className="flex flex-col gap-5 p-5">
						{results.map((result, idx) => (
							<article key={parsedNames[idx] ?? idx}>
								{results.length > 1 ? (
									<h3 className="mb-2.5 flex items-baseline gap-2 text-[12px] font-semibold text-ink-2">
										<span className="tabular">#{idx + 1}</span>
										<span className="truncate font-normal text-ink-3">
											{parsedNames[idx]}
										</span>
									</h3>
								) : null}
								<dl className="grid gap-2.5 sm:grid-cols-2">
									{fieldKeys.map((key) => (
										<ParsedResultCard
											key={key}
											label={fields.find((f) => f.key === key)?.label ?? key}
											fieldKey={key}
											value={result[key] ?? null}
										/>
									))}
								</dl>
							</article>
						))}
					</div>

					<footer className="flex flex-wrap gap-2 border-t border-border-soft bg-surface-2 px-5 py-3">
						<CopyButton getText={getTabSeparatedRow} label="Copy dòng Excel" />
						<GhostButton onClick={handleDownloadCsv} icon={Download}>
							Tải CSV
						</GhostButton>
						<GhostButton onClick={handleDownloadExcel} icon={FileSpreadsheet}>
							Tải Excel
						</GhostButton>
						<GhostButton onClick={handleClear} icon={Trash2} tone="danger">
							Xoá kết quả
						</GhostButton>
					</footer>
				</div>
			) : null}

			{!progress && !results.length && files.length > 0 ? (
				<div className="mt-4">
					<EmptyState
						icon={ScanText}
						title="Chưa có dữ liệu"
						description={`${files.length} tệp đã sẵn sàng. Bấm "Bóc tách CV" để trích xuất dữ liệu ứng viên.`}
					/>
				</div>
			) : null}
		</div>
	);
}
