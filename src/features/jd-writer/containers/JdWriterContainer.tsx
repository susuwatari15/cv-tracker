"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProviderStore } from "@/stores/providerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt, buildJdPrompt } from "@/lib/prompts";
import { formatText } from "@/lib/formatText";
import { jdFormSchema, type JdFormValues } from "../types";
import JdForm from "../components/JdForm";
import RunButton from "@/components/shared/RunButton";
import OutputBox from "@/components/shared/OutputBox";
import ResultActions from "@/components/shared/ResultActions";
import { OutputSkeleton } from "@/components/shared/Skeleton";

export default function JdWriterContainer() {
	const [output, setOutput] = useState("");

	const status = useProviderStore((s) => s.status);
	const { getContext } = useSettingsStore();
	const { isLoading, call } = useClaudeApi();

	const form = useForm<JdFormValues>({
		resolver: zodResolver(jdFormSchema),
		defaultValues: {
			title: "",
			level: "Senior",
			entity: "",
			salary: "",
			skills: "",
			context: "",
		},
	});

	const handleSubmit = async (data: JdFormValues) => {
		setOutput("");
		const result = await call({
			messages: [{ role: "user", content: buildJdPrompt(data) }],
			system: buildSystemPrompt(getContext("ta_ctx_jd")),
			maxTokens: 2000,
		});
		if (result) setOutput(result);
	};

	return (
		<div className="mx-auto max-w-[820px]">
			<JdForm form={form} onSubmit={handleSubmit} />

			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid"}
				label="Soạn bản JD"
				loadingLabel="Đang soạn JD…"
				disabledHint="Cần API key hợp lệ — mở Cấu hình để kết nối."
				onClick={form.handleSubmit(handleSubmit)}
			/>

			{isLoading ? <OutputSkeleton /> : null}

			<OutputBox
				show={!isLoading && !!output}
				title="Bản mô tả công việc"
				html={formatText(output)}
				actions={
					<ResultActions getText={() => output} onClear={() => setOutput("")} />
				}
			/>
		</div>
	);
}
