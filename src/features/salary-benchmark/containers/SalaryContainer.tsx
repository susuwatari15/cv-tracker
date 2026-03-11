"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiKeyStore } from "@/stores/apiKeyStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt, buildSalaryPrompt } from "@/lib/prompts";
import { formatText } from "@/lib/formatText";
import { salaryFormSchema, type SalaryFormValues } from "../types";
import SalaryForm from "../components/SalaryForm";
import RunButton from "@/components/shared/RunButton";
import OutputBox from "@/components/shared/OutputBox";
import CopyButton from "@/components/shared/CopyButton";

export default function SalaryContainer() {
	const [output, setOutput] = useState("");
	const [showOutput, setShowOutput] = useState(false);

	const { status } = useApiKeyStore();
	const { getContext } = useSettingsStore();
	const { isLoading, call } = useClaudeApi();

	const form = useForm<SalaryFormValues>({
		resolver: zodResolver(salaryFormSchema),
		defaultValues: {
			title: "",
			level: "Senior",
			location: "TP.HCM",
			experience: "",
			skills: "",
		},
	});

	const handleSubmit = async (data: SalaryFormValues) => {
		setShowOutput(false);
		const result = await call({
			messages: [{ role: "user", content: buildSalaryPrompt(data) }],
			system: buildSystemPrompt(getContext("ta_ctx_salary")),
			maxTokens: 2000,
		});
		if (result) {
			setOutput(result);
			setShowOutput(true);
		}
	};

	return (
		<div className="max-w-[720px]">
			<SalaryForm form={form} onSubmit={handleSubmit} />
			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid"}
				label="Xem benchmark"
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
