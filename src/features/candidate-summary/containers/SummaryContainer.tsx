"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiKeyStore } from "@/stores/apiKeyStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt, buildSummaryPrompt } from "@/lib/prompts";
import { formatText } from "@/lib/formatText";
import { summaryFormSchema, type SummaryFormValues } from "../types";
import SummaryForm from "../components/SummaryForm";
import RunButton from "@/components/shared/RunButton";
import OutputBox from "@/components/shared/OutputBox";
import CopyButton from "@/components/shared/CopyButton";

export default function SummaryContainer() {
	const [output, setOutput] = useState("");
	const [showOutput, setShowOutput] = useState(false);

	const { status } = useApiKeyStore();
	const { getContext } = useSettingsStore();
	const { isLoading, call } = useClaudeApi();

	const form = useForm<SummaryFormValues>({
		resolver: zodResolver(summaryFormSchema),
		defaultValues: { position: "", cv: "", interviewResult: "" },
	});

	const handleSubmit = async (data: SummaryFormValues) => {
		setShowOutput(false);
		const result = await call({
			messages: [{ role: "user", content: buildSummaryPrompt(data) }],
			system: buildSystemPrompt(getContext("ta_ctx_summary")),
			maxTokens: 2000,
		});
		if (result) {
			setOutput(result);
			setShowOutput(true);
		}
	};

	return (
		<div className="max-w-[720px]">
			<SummaryForm form={form} onSubmit={handleSubmit} />
			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid"}
				label="Tóm tắt ngay"
				onClick={form.handleSubmit(handleSubmit)}
			/>
			<OutputBox
				show={showOutput}
				html={formatText(output)}
				actions={
					<>
						<CopyButton getText={() => output} />
						<button
							onClick={() => setShowOutput(false)}
							className="px-3 py-1.5 rounded-[8px] text-xs font-mono border border-border-strong text-ink-2 hover:text-ta-accent transition-all"
						>
							✕ Xóa
						</button>
					</>
				}
			/>
		</div>
	);
}
