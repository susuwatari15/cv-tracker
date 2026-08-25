"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProviderStore } from "@/stores/providerStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { buildSystemPrompt, buildSalaryPrompt } from "@/lib/prompts";
import { formatText } from "@/lib/formatText";
import { salaryFormSchema, type SalaryFormValues } from "../types";
import SalaryForm from "../components/SalaryForm";
import RunButton from "@/components/shared/RunButton";
import OutputBox from "@/components/shared/OutputBox";
import ResultActions from "@/components/shared/ResultActions";
import { OutputSkeleton } from "@/components/shared/Skeleton";

export default function SalaryContainer() {
	const [output, setOutput] = useState("");

	const status = useProviderStore((s) => s.status);
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
		setOutput("");
		const result = await call({
			messages: [{ role: "user", content: buildSalaryPrompt(data) }],
			system: buildSystemPrompt(getContext("ta_ctx_salary")),
			maxTokens: 2000,
		});
		if (result) setOutput(result);
	};

	return (
		<div className="mx-auto max-w-[820px]">
			<SalaryForm form={form} onSubmit={handleSubmit} />

			<RunButton
				isLoading={isLoading}
				disabled={status !== "valid"}
				label="Xem khoảng lương"
				loadingLabel="Đang tra cứu…"
				disabledHint="Cần API key hợp lệ — mở Cấu hình để kết nối."
				onClick={form.handleSubmit(handleSubmit)}
			/>

			{isLoading ? <OutputSkeleton /> : null}

			<OutputBox
				show={!isLoading && !!output}
				title="Khoảng lương tham chiếu"
				html={formatText(output)}
				actions={
					<ResultActions getText={() => output} onClear={() => setOutput("")} />
				}
			/>
		</div>
	);
}
