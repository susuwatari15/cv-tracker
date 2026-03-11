"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiKeyStore } from "@/stores/apiKeyStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt, buildJdPrompt } from "@/lib/prompts";
import { formatText } from "@/lib/formatText";
import { jdFormSchema, type JdFormValues } from "../types";
import JdForm from "../components/JdForm";
import RunButton from "@/components/shared/RunButton";
import OutputBox from "@/components/shared/OutputBox";
import CopyButton from "@/components/shared/CopyButton";

export default function JdWriterContainer() {
	const [output, setOutput] = useState("");
	const [showOutput, setShowOutput] = useState(false);

	const { status } = useApiKeyStore();
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
		setShowOutput(false);
		const result = await call({
			messages: [{ role: "user", content: buildJdPrompt(data) }],
			system: buildSystemPrompt(getContext("ta_ctx_jd")),
			maxTokens: 2000,
		});
		if (result) {
			setOutput(result);
			setShowOutput(true);
		}
	};

	return (
		<div className="max-w-[720px]">
			<JdForm form={form} onSubmit={handleSubmit} />
			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid"}
				label="Soạn JD ngay"
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
