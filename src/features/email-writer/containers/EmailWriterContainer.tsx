"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProviderStore } from "@/stores/providerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt, buildEmailPrompt } from "@/lib/prompts";
import { formatText } from "@/lib/formatText";
import { emailFormSchema, type EmailFormValues } from "../types";
import EmailForm from "../components/EmailForm";
import RunButton from "@/components/shared/RunButton";
import OutputBox from "@/components/shared/OutputBox";
import ResultActions from "@/components/shared/ResultActions";
import { OutputSkeleton } from "@/components/shared/Skeleton";

export default function EmailWriterContainer() {
	const [output, setOutput] = useState("");

	const status = useProviderStore((s) => s.status);
	const { getContext } = useSettingsStore();
	const { isLoading, call } = useClaudeApi();

	const form = useForm<EmailFormValues>({
		resolver: zodResolver(emailFormSchema),
		defaultValues: {
			type: "invite",
			candidate: "",
			position: "",
			language: "vi",
			extra: "",
		},
	});

	const handleSubmit = async (data: EmailFormValues) => {
		setOutput("");
		const result = await call({
			messages: [{ role: "user", content: buildEmailPrompt(data) }],
			system: buildSystemPrompt(getContext("ta_ctx_email")),
			maxTokens: 2000,
		});
		if (result) setOutput(result);
	};

	return (
		<div className="mx-auto max-w-[820px]">
			<EmailForm form={form} onSubmit={handleSubmit} />

			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid"}
				label="Viết email"
				loadingLabel="Đang viết email…"
				disabledHint="Cần API key hợp lệ — mở Cấu hình để kết nối."
				onClick={form.handleSubmit(handleSubmit)}
			/>

			{isLoading ? <OutputSkeleton /> : null}

			<OutputBox
				show={!isLoading && !!output}
				title="Nội dung email"
				html={formatText(output)}
				actions={
					<ResultActions getText={() => output} onClear={() => setOutput("")} />
				}
			/>
		</div>
	);
}
