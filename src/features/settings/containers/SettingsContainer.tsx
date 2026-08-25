"use client";

import { useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, KeyRound } from "lucide-react";
import { useSettingsStore, type ContextKey } from "@/stores/settingsStore";
import SettingsNav, { type SettingsNavItem } from "../components/SettingsNav";
import ConnectionPane from "../components/ConnectionPane";
import ContextPane from "../components/ContextPane";
import type { SettingsSectionId } from "../types";

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
	const { contexts, setContext, saveAll } = useSettingsStore();
	const [section, setSection] = useState<SettingsSectionId>("connection");

	// The form lives here, not in ContextPane: switching panels unmounts the
	// panel, and edits in progress must survive that.
	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(schema),
		defaultValues: contexts as SettingsFormValues,
	});

	const isDirty = form.formState.isDirty;

	const onSubmit = (data: SettingsFormValues) => {
		for (const [k, v] of Object.entries(data)) {
			setContext(k as ContextKey, v as string);
		}
		saveAll();
		form.reset(data); // clears the dirty flag so the save state is honest
		toast.success("Đã lưu cấu hình");
	};

	const items: SettingsNavItem[] = [
		{
			id: "connection",
			label: "Kết nối AI",
			description: "Nhà cung cấp, API key, model",
			icon: KeyRound,
		},
		{
			id: "context",
			label: "Business context",
			description: "Prompt riêng từng công cụ",
			icon: Building2,
			// Surfaced on the nav so unsaved edits stay visible from the other panel.
			dirty: isDirty,
		},
	];

	return (
		<div className="mx-auto grid max-w-[1040px] gap-4 md:grid-cols-[236px_minmax(0,1fr)] md:gap-6">
			<SettingsNav items={items} active={section} onChange={setSection} />

			<div
				role="tabpanel"
				id={`settings-panel-${section}`}
				aria-labelledby={`settings-tab-${section}`}
				className="min-w-0"
			>
				{section === "connection" ? (
					<ConnectionPane />
				) : (
					<ContextPane
						register={
							form.register as UseFormRegister<Record<ContextKey, string>>
						}
						isDirty={isDirty}
						onSubmit={form.handleSubmit(onSubmit)}
					/>
				)}
			</div>
		</div>
	);
}
