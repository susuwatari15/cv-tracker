import { UseFormReturn } from "react-hook-form";
import { CircleDollarSign } from "lucide-react";
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
import { JD_LEVELS, type JdLevel } from "@/features/jd-writer/types";
import { LOCATIONS, type Location, type SalaryFormValues } from "../types";

interface SalaryFormProps {
	form: UseFormReturn<SalaryFormValues>;
	onSubmit: (data: SalaryFormValues) => void;
}

export default function SalaryForm({ form }: SalaryFormProps) {
	const { errors } = form.formState;

	return (
		<FormSection
			title="Tham số tham chiếu"
			icon={CircleDollarSign}
			hint="Kết quả là khoảng tham chiếu thị trường, không phải mức duyệt offer."
		>
			<div className="grid gap-4 sm:grid-cols-2">
				<FieldGroup label="Vị trí" required error={errors.title?.message}>
					<Input
						{...form.register("title")}
						placeholder="Cloud Architect"
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

				<FieldGroup label="Địa bàn">
					<Select
						value={form.watch("location")}
						onValueChange={(v) => v && form.setValue("location", v as Location)}
					>
						<SelectTrigger className="h-10 w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{LOCATIONS.map((loc) => (
								<SelectItem key={loc} value={loc}>
									{loc}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FieldGroup>

				<FieldGroup label="Số năm kinh nghiệm">
					<Input
						{...form.register("experience")}
						placeholder="5–7 năm"
						className="h-10"
					/>
				</FieldGroup>
			</div>

			<div className="mt-4">
				<FieldGroup
					label="Tech stack / chuyên môn"
					hint="Kỹ năng khan hiếm thường đẩy khoảng lương lên đáng kể."
				>
					<Textarea
						{...form.register("skills")}
						placeholder="AWS, Kubernetes, Terraform, security…"
						rows={3}
					/>
				</FieldGroup>
			</div>
		</FormSection>
	);
}
