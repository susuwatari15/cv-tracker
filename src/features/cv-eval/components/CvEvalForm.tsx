import { UseFormReturn } from "react-hook-form";
import { GitCompareArrows } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "@/components/shared/FormSection";
import FieldGroup from "@/components/shared/FieldGroup";
import type { CvEvalFormValues } from "../types";

interface CvEvalFormProps {
	form: UseFormReturn<CvEvalFormValues>;
	onSubmit: (data: CvEvalFormValues) => void;
}

export default function CvEvalForm({ form }: CvEvalFormProps) {
	const { errors } = form.formState;

	return (
		<FormSection
			title="So khớp hồ sơ với vị trí"
			icon={GitCompareArrows}
			hint="Dán cả hai phía để có đánh giá hai chiều: hồ sơ đáp ứng gì và còn thiếu gì."
		>
			<div className="flex flex-col gap-4">
				<FieldGroup
					label="Yêu cầu vị trí (JD)"
					required
					hint="Cấp bậc, kỹ năng bắt buộc, nice-to-have, số năm kinh nghiệm."
					error={errors.jd?.message}
				>
					<Textarea
						{...form.register("jd")}
						placeholder="Dán JD hoặc tóm tắt yêu cầu tuyển dụng…"
						aria-invalid={!!errors.jd}
						className="min-h-[110px]"
					/>
				</FieldGroup>

				<FieldGroup
					label="Hồ sơ ứng viên"
					required
					hint="Kinh nghiệm, kỹ năng, công ty gần nhất, học vấn."
					error={errors.cv?.message}
				>
					<Textarea
						{...form.register("cv")}
						placeholder="Dán nội dung CV hoặc tóm tắt hồ sơ…"
						aria-invalid={!!errors.cv}
						className="min-h-[130px]"
					/>
				</FieldGroup>
			</div>
		</FormSection>
	);
}
