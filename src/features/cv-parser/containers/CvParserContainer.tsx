"use client";

import { useState } from "react";
import { useApiKeyStore } from "@/stores/apiKeyStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { toast } from "sonner";
import FormSection from "@/components/shared/FormSection";
import RunButton from "@/components/shared/RunButton";
import CopyButton from "@/components/shared/CopyButton";
import UploadZone from "../components/UploadZone";
import FieldChips from "../components/FieldChips";
import ParsedResultCard from "../components/ParsedResultCard";
import { CV_FIELDS, type ParsedCv } from "../types";

export default function CvParserContainer() {
	const [files, setFiles] = useState<File[]>([]);
	const [selectedFields, setSelectedFields] = useState<Set<string>>(
		new Set(CV_FIELDS.map((f) => f.key)),
	);
	const [results, setResults] = useState<ParsedCv[]>([]);
	const [showOutput, setShowOutput] = useState(false);
	const [parseProgress, setParseProgress] = useState("");

	const { status } = useApiKeyStore();
	const { isLoading, call } = useClaudeApi();

	const toggleField = (key: string) => {
		setSelectedFields((prev) => {
			const next = new Set(prev);
			next.has(key) ? next.delete(key) : next.add(key);
			return next;
		});
	};

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
			toast.error("Vui lòng upload CV trước!");
			return;
		}
		const fieldKeys = Array.from(selectedFields);
		const parsed: ParsedCv[] = [];

		for (let i = 0; i < files.length; i++) {
			setParseProgress(`Parsing ${i + 1}/${files.length}...`);
			const b64 = await fileToBase64(files[i]);
			const mt = getMediaType(files[i]);
			const fieldList = fieldKeys
				.map(
					(k) => `- "${k}": ${CV_FIELDS.find((f) => f.key === k)?.label ?? k}`,
				)
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

			if (result) {
				try {
					const json = JSON.parse(result.replace(/```json|```/g, "").trim());
					parsed.push(json);
				} catch {
					toast.error(`Lỗi parse JSON cho file ${files[i].name}`);
				}
			}
		}

		setParseProgress("");
		setResults(parsed);
		setShowOutput(true);
		toast.success(`✓ Parse xong ${parsed.length} CV!`);
	};

	const getTabSeparatedRow = (): string => {
		const fieldKeys = Array.from(selectedFields);
		const header = fieldKeys
			.map((k) => CV_FIELDS.find((f) => f.key === k)?.label ?? k)
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

	const handleDownload = () => {
		const csv = getTabSeparatedRow().replace(/\t/g, ",");
		const blob = new Blob(["\uFEFF" + csv], {
			type: "text/csv;charset=utf-8",
		});
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `cv_parsed_${Date.now()}.csv`;
		a.click();
		toast.success("✓ Downloaded!");
	};

	return (
		<div className="max-w-[720px]">
			<FormSection title="Upload CV Files" icon="📄">
				<UploadZone files={files} onFilesChange={setFiles} />
			</FormSection>

			<FormSection title="Chọn trường cần extract" icon="🔧">
				<FieldChips selected={selectedFields} onToggle={toggleField} />
			</FormSection>

			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid" || !files.length}
				label={parseProgress || "Parse CV ngay"}
				loadingLabel={parseProgress || "Đang parse..."}
				onClick={handleParse}
			/>

			{showOutput && results.length > 0 && (
				<div className="animate-fade-up mt-4">
					{results.map((result, idx) => (
						<div key={files[idx]?.name ?? idx} className="mb-6">
							{results.length > 1 && (
								<p className="text-[12px] font-mono text-ink-3 mb-3">
									CV #{idx + 1}: {files[idx]?.name}
								</p>
							)}
							<div className="grid grid-cols-2 gap-3">
								{Array.from(selectedFields).map((key) => {
									const field = CV_FIELDS.find((f) => f.key === key);
									return (
										<ParsedResultCard
											key={key}
											label={field?.label ?? key}
											fieldKey={key}
											value={result[key] ?? null}
										/>
									);
								})}
							</div>
						</div>
					))}

					<div className="flex gap-2 mt-4 pt-4 border-t border-border-default flex-wrap">
						<CopyButton getText={getTabSeparatedRow} label="Copy Excel Row" />
						<button
							type="button"
							onClick={handleDownload}
							className="px-3 py-1.5 rounded-[8px] text-xs font-mono border border-border-strong text-ink-2 bg-surface hover:border-ta-accent-2 hover:text-ta-accent-2 transition-all"
						>
							⬇️ Download CSV
						</button>
						<button
							type="button"
							onClick={() => setShowOutput(false)}
							className="px-3 py-1.5 rounded-[8px] text-xs font-mono border border-border-strong text-ink-2 bg-surface hover:text-ta-accent transition-all"
						>
							✕ Xóa
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
