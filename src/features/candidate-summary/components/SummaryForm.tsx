import { UseFormReturn } from "react-hook-form";
import { ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "@/components/shared/FormSection";
import FieldGroup from "@/components/shared/FieldGroup";
import type { SummaryFormValues } from "../types";

interface SummaryFormProps {
	form: UseFormReturn<SummaryFormValues>;
	onSubmit: (data: SummaryFormValues) => void;
}

export default function SummaryForm({ form }: SummaryFormProps) {
	const { errors } = form.formState;

	return (
		<FormSection
			title="Hồ sơ trình hiring manager"
			icon={ClipboardList}
			hint="Bản tóm tắt được viết cho người ra quyết định, không phải cho hồ sơ nội bộ."
		>
			<div className="flex flex-col gap-4">
				<FieldGroup label="Vị trí đang tuyển">
					<Input
						{...form.register("position")}
						placeholder="Senior Data Engineer, Masan Tech"
						className="h-10"
					/>
				</FieldGroup>

				<FieldGroup
					label="Thông tin ứng viên"
					required
					hint="Kinh nghiệm, kỹ năng, điểm mạnh và điểm cần lưu ý."
					error={errors.cv?.message}
				>
					<Textarea
						{...form.register("cv")}
						placeholder="Dán CV hoặc ghi tóm tắt hồ sơ…"
						aria-invalid={!!errors.cv}
						className="min-h-[130px]"
					/>
				</FieldGroup>

				<FieldGroup
					label="Kết quả các vòng phỏng vấn"
					hint="Nếu có, feedback của người phỏng vấn sẽ được đưa vào bản tóm tắt."
				>
					<Textarea
						{...form.register("interviewResult")}
						placeholder="Vòng 1 Technical: pass. Mạnh về Spark, cần củng cố system design…"
						rows={3}
					/>
				</FieldGroup>
			</div>
		</FormSection>
	);
}
