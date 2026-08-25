"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProviderStore } from "@/stores/providerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt, buildCvEvalPrompt } from "@/lib/prompts";
import { formatText } from "@/lib/formatText";
import { cvEvalFormSchema, type CvEvalFormValues } from "../types";
import CvEvalForm from "../components/CvEvalForm";
import RunButton from "@/components/shared/RunButton";
import OutputBox from "@/components/shared/OutputBox";
import ResultActions from "@/components/shared/ResultActions";
import { OutputSkeleton } from "@/components/shared/Skeleton";

export default function CvEvalContainer() {
	const [output, setOutput] = useState("");

	const status = useProviderStore((s) => s.status);
	const { getContext } = useSettingsStore();
	const { isLoading, call } = useClaudeApi();

	const form = useForm<CvEvalFormValues>({
		resolver: zodResolver(cvEvalFormSchema),
		defaultValues: { jd: "", cv: "" },
	});

	const handleSubmit = async (data: CvEvalFormValues) => {
		setOutput("");
		const result = await call({
			messages: [{ role: "user", content: buildCvEvalPrompt(data) }],
			system: buildSystemPrompt(getContext("ta_ctx_eval")),
			maxTokens: 2000,
		});
		if (result) setOutput(result);
	};

	return (
		<div className="mx-auto max-w-[820px]">
			<CvEvalForm form={form} onSubmit={handleSubmit} />

			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid"}
				label="Chạy đánh giá"
				loadingLabel="Đang đánh giá…"
				disabledHint="Cần API key hợp lệ — mở Cấu hình để kết nối."
				onClick={form.handleSubmit(handleSubmit)}
			/>

			{isLoading ? <OutputSkeleton /> : null}

			<OutputBox
				show={!isLoading && !!output}
				title="Kết quả đánh giá"
				html={formatText(output)}
				actions={
					<ResultActions getText={() => output} onClear={() => setOutput("")} />
				}
			/>
		</div>
	);
}
