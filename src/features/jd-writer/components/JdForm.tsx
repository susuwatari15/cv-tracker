import { UseFormReturn } from "react-hook-form";
import { FileSignature } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import FormSection from "@/components/shared/FormSection";
import FieldGroup from "@/components/shared/FieldGroup";
import { JD_LEVELS, type JdFormValues, type JdLevel } from "../types";

interface JdFormProps {
	form: UseFormReturn<JdFormValues>;
	onSubmit: (data: JdFormValues) => void;
}

export default function JdForm({ form }: JdFormProps) {
	const { errors } = form.formState;

	return (
		<FormSection
			title="Thông tin vị trí"
			icon={FileSignature}
			hint="Càng cụ thể về team và tech stack, bản JD càng ít phải sửa lại."
		>
			<div className="grid gap-4 sm:grid-cols-2">
				<FieldGroup
					label="Tên vị trí"
					required
					error={errors.title?.message}
				>
					<Input
						{...form.register("title")}
						placeholder="Senior Data Engineer"
						aria-invalid={!!errors.title}
						className="h-10"
					/>
				</FieldGroup>

				<FieldGroup label="Cấp bậc">
					<Select
						value={form.watch("level")}
						onValueChange={(v) => v && form.setValue("level", v as JdLevel)}
					>
						<SelectTrigger className="h-10 w-full">
							<SelectValue placeholder="Chọn cấp bậc" />
						</SelectTrigger>
						<SelectContent>
							{JD_LEVELS.map((l) => (
								<SelectItem key={l} value={l}>
									{l}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FieldGroup>

				<FieldGroup label="Pháp nhân / Business unit">
					<Input
						{...form.register("entity")}
						placeholder="Masan Tech"
						className="h-10"
					/>
				</FieldGroup>

				<FieldGroup
					label="Mức lương"
					hint="Bỏ trống nếu chưa công bố khoảng lương."
				>
					<Input
						{...form.register("salary")}
						placeholder="40–60 triệu gross"
						className="h-10"
					/>
				</FieldGroup>
			</div>

			<div className="mt-4 flex flex-col gap-4">
				<FieldGroup
					label="Tech stack / yêu cầu kỹ năng"
					hint="Liệt kê cả kỹ năng bắt buộc và nice-to-have."
				>
					<Textarea
						{...form.register("skills")}
						placeholder="Spark, Airflow, Python, SQL, dbt…"
						rows={3}
					/>
				</FieldGroup>

				<FieldGroup label="Bối cảnh team / dự án">
					<Textarea
						{...form.register("context")}
						placeholder="Team Data Platform 8 người, đang xây data lake trên AWS…"
						rows={3}
					/>
				</FieldGroup>
			</div>
		</FormSection>
	);
}
