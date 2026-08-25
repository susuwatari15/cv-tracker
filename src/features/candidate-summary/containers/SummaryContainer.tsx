"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProviderStore } from "@/stores/providerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt, buildSummaryPrompt } from "@/lib/prompts";
import { formatText } from "@/lib/formatText";
import { summaryFormSchema, type SummaryFormValues } from "../types";
import SummaryForm from "../components/SummaryForm";
import RunButton from "@/components/shared/RunButton";
import OutputBox from "@/components/shared/OutputBox";
import ResultActions from "@/components/shared/ResultActions";
import { OutputSkeleton } from "@/components/shared/Skeleton";

export default function SummaryContainer() {
	const [output, setOutput] = useState("");

	const status = useProviderStore((s) => s.status);
	const { getContext } = useSettingsStore();
	const { isLoading, call } = useClaudeApi();

	const form = useForm<SummaryFormValues>({
		resolver: zodResolver(summaryFormSchema),
		defaultValues: { position: "", cv: "", interviewResult: "" },
	});

	const handleSubmit = async (data: SummaryFormValues) => {
		setOutput("");
		const result = await call({
			messages: [{ role: "user", content: buildSummaryPrompt(data) }],
			system: buildSystemPrompt(getContext("ta_ctx_summary")),
			maxTokens: 2000,
		});
		if (result) setOutput(result);
	};

	return (
		<div className="mx-auto max-w-[820px]">
			<SummaryForm form={form} onSubmit={handleSubmit} />

			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid"}
				label="Soạn bản tóm tắt"
				loadingLabel="Đang tóm tắt…"
				disabledHint="Cần API key hợp lệ — mở Cấu hình để kết nối."
				onClick={form.handleSubmit(handleSubmit)}
			/>

			{isLoading ? <OutputSkeleton /> : null}

			<OutputBox
				show={!isLoading && !!output}
				title="Bản tóm tắt ứng viên"
				html={formatText(output)}
				actions={
					<ResultActions getText={() => output} onClear={() => setOutput("")} />
				}
			/>
		</div>
	);
}
