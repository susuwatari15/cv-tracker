"use client";

import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApiKeyStore } from "@/stores/apiKeyStore";
import { useSettingsStore, type ContextKey } from "@/stores/settingsStore";
import { toast } from "sonner";
import FormSection from "@/components/shared/FormSection";
import ApiKeyField from "../components/ApiKeyField";
import BusinessContextForm from "../components/BusinessContextForm";
import { BUSINESS_CONTEXT_FIELDS } from "../types";

const schema = z.object({
	ta_ctx_chat: z.string(),
	ta_ctx_jd: z.string(),
	ta_ctx_email: z.string(),
	ta_ctx_eval: z.string(),
	ta_ctx_summary: z.string(),
	ta_ctx_salary: z.string(),
});

type SettingsFormValues = z.infer<typeof schema>;

export default function SettingsContainer() {
	const { key, status, setKey } = useApiKeyStore();
	const { contexts, setContext, saveAll } = useSettingsStore();

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(schema),
		defaultValues: contexts as SettingsFormValues,
	});

	const onSubmit = (data: SettingsFormValues) => {
		for (const [k, v] of Object.entries(data)) {
			setContext(k as ContextKey, v as string);
		}
		saveAll();
		toast.success("✓ Settings đã được lưu!");
	};

	return (
		<div className="max-w-2xl">
			<FormSection title="API Configuration" icon="🔑">
				<ApiKeyField value={key} status={status} onChange={setKey} />
				<p className="text-xs font-mono text-ink-3 mt-2">
					Key được lưu trong localStorage. Không bao giờ gửi đến server của
					chúng tôi.
				</p>
			</FormSection>

			<FormSection title="Business Context per Tool" icon="📋">
				<p className="text-[12px] text-ink-2 mb-4">
					Context này được thêm vào system prompt của từng công cụ. Giữ ngắn gọn
					(dưới 300 từ mỗi tool).
				</p>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<BusinessContextForm
						register={
							form.register as UseFormRegister<Record<ContextKey, string>>
						}
						fields={BUSINESS_CONTEXT_FIELDS}
					/>
					<button
						type="submit"
						className="mt-5 w-full flex items-center justify-center gap-2 px-7 py-[13px] bg-ta-accent hover:bg-ta-accent-hover text-white font-semibold text-sm rounded-[8px] transition-all"
					>
						💾 Lưu Settings
					</button>
				</form>
			</FormSection>
		</div>
	);
}
