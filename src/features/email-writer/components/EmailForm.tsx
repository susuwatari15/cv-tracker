import { UseFormReturn } from "react-hook-form";
import { Mail } from "lucide-react";
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
import { EMAIL_TYPES, type EmailFormValues, type EmailType } from "../types";

interface EmailFormProps {
	form: UseFormReturn<EmailFormValues>;
	onSubmit: (data: EmailFormValues) => void;
}

export default function EmailForm({ form }: EmailFormProps) {
	const { errors } = form.formState;

	return (
		<FormSection
			title="Nội dung email"
			icon={Mail}
			hint="Thư sẽ được viết theo tên và vị trí bạn nhập, không dùng mẫu chung."
		>
			<div className="grid gap-4 sm:grid-cols-2">
				<FieldGroup label="Loại email" required>
					<Select
						value={form.watch("type")}
						onValueChange={(v) => v && form.setValue("type", v as EmailType)}
					>
						<SelectTrigger className="h-10 w-full">
							<SelectValue placeholder="Chọn loại email">
								{(v) =>
									EMAIL_TYPES.find((t) => t.value === v)?.label ?? String(v)
								}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{EMAIL_TYPES.map((t) => (
								<SelectItem key={t.value} value={t.value}>
									{t.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FieldGroup>

				<FieldGroup
					label="Tên ứng viên"
					required
					error={errors.candidate?.message}
				>
					<Input
						{...form.register("candidate")}
						placeholder="Anh Minh"
						aria-invalid={!!errors.candidate}
						className="h-10"
					/>
				</FieldGroup>

				<FieldGroup label="Vị trí ứng tuyển">
					<Input
						{...form.register("position")}
						placeholder="Senior Data Engineer"
						className="h-10"
					/>
				</FieldGroup>

				<FieldGroup label="Ngôn ngữ">
					<Select
						value={form.watch("language")}
						onValueChange={(v) =>
							v && form.setValue("language", v as "vi" | "en")
						}
					>
						<SelectTrigger className="h-10 w-full">
							<SelectValue>
								{(v) => (v === "en" ? "English" : "Tiếng Việt")}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="vi">Tiếng Việt</SelectItem>
							<SelectItem value="en">English</SelectItem>
						</SelectContent>
					</Select>
				</FieldGroup>
			</div>

			<div className="mt-4">
				<FieldGroup
					label="Chi tiết bổ sung"
					hint="Thời gian, địa điểm, người phỏng vấn, link họp — nếu có."
				>
					<Textarea
						{...form.register("extra")}
						placeholder="Vòng 2 lúc 10h ngày 15/4, Google Meet, PV cùng Tech Lead…"
						rows={3}
					/>
				</FieldGroup>
			</div>
		</FormSection>
	);
}
