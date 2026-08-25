import { UseFormRegister } from "react-hook-form";
import { TOOLS } from "@/lib/toolMeta";
import { Textarea } from "@/components/ui/textarea";
import type { ContextKey } from "@/stores/settingsStore";
import type { BusinessContextField } from "../types";

interface BusinessContextFormProps {
	register: UseFormRegister<Record<ContextKey, string>>;
	fields: BusinessContextField[];
}

export default function BusinessContextForm({
	register,
	fields,
}: BusinessContextFormProps) {
	return (
		<div className="flex flex-col gap-5">
			{fields.map((field) => {
				const tool = TOOLS[field.toolId];
				const Icon = tool.icon;

				return (
					<div key={field.key} className="flex flex-col gap-1.5">
						{/* Each context block carries the same icon the tool shows in
						    the sidebar, so which prompt feeds which tool is obvious. */}
						<label
							htmlFor={field.key}
							className="flex items-center gap-2 text-[12.5px] font-semibold text-ink"
						>
							<Icon
								className="size-3.5 shrink-0 text-ink-3"
								aria-hidden="true"
							/>
							{tool.label}
						</label>
						<Textarea
							id={field.key}
							{...register(field.key)}
							placeholder={field.placeholder}
							aria-describedby={`${field.key}-hint`}
							className="min-h-[84px] resize-y text-[13px]"
						/>
						<p
							id={`${field.key}-hint`}
							className="text-[11.5px] leading-snug text-ink-3"
						>
							{field.hint}
						</p>
					</div>
				);
			})}
		</div>
	);
}
