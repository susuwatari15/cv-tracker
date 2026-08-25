import { Building2, Save } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import FormSection from "@/components/shared/FormSection";
import BusinessContextForm from "./BusinessContextForm";
import type { ContextKey } from "@/stores/settingsStore";
import { BUSINESS_CONTEXT_FIELDS } from "../types";

interface ContextPaneProps {
	register: UseFormRegister<Record<ContextKey, string>>;
	isDirty: boolean;
	onSubmit: (e: React.FormEvent) => void;
}

/**
 * Per-tool system-prompt context. Unlike the connection panel this one
 * batches edits, so it owns the save affordance.
 */
export default function ContextPane({
	register,
	isDirty,
	onSubmit,
}: ContextPaneProps) {
	return (
		<form onSubmit={onSubmit}>
			<FormSection
				title="Business context theo công cụ"
				icon={Building2}
				hint="Nội dung này được ghép vào system prompt của từng công cụ. Giữ dưới 300 từ mỗi mục."
			>
				<BusinessContextForm
					register={register}
					fields={BUSINESS_CONTEXT_FIELDS}
				/>
			</FormSection>

			{/* Floating action bar: the field list is long enough that a save
			    button at the bottom would scroll out of reach. */}
			<div className="sticky bottom-0 mt-2 ml-auto flex w-fit items-center gap-3 rounded-xl border border-border-default bg-surface px-3 py-2.5 shadow-e3">
				{isDirty ? (
					<span className="text-[12px] text-ink-3">Có thay đổi chưa lưu</span>
				) : null}
				<button
					type="submit"
					disabled={!isDirty}
					className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-ta-accent px-6 text-sm font-semibold text-ta-accent-fg transition-colors hover:bg-ta-accent-hover disabled:cursor-not-allowed disabled:bg-border-strong disabled:text-ink-3"
				>
					<Save className="size-4" aria-hidden="true" />
					Lưu cấu hình
				</button>
			</div>
		</form>
	);
}
