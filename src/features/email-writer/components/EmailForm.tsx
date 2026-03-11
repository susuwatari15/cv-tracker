import { UseFormReturn } from "react-hook-form";
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
  return (
    <FormSection title="Thông tin email" icon="📧">
      <div className="grid grid-cols-2 gap-3.5">
        <FieldGroup label="Loại email" required>
          <Select
            defaultValue={form.getValues("type")}
            onValueChange={(v) => form.setValue("type", v as EmailType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại email" />
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

        <FieldGroup label="Tên ứng viên" required>
          <Input
            {...form.register("candidate")}
            placeholder="VD: Anh Minh / Chị Lan"
          />
          {form.formState.errors.candidate && (
            <span className="text-red-500 text-xs">
              {form.formState.errors.candidate.message}
            </span>
          )}
        </FieldGroup>

        <FieldGroup label="Vị trí ứng tuyển">
          <Input
            {...form.register("position")}
            placeholder="VD: Senior Data Engineer"
          />
        </FieldGroup>

        <FieldGroup label="Ngôn ngữ email">
          <Select
            defaultValue={form.getValues("language")}
            onValueChange={(v) =>
              form.setValue("language", v as "vi" | "en")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi">Tiếng Việt</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
      </div>

      <div className="mt-3.5">
        <FieldGroup label="Thông tin thêm (tuỳ chọn)">
          <Textarea
            {...form.register("extra")}
            placeholder="VD: PV Round 2 vào 10h sáng 15/4, Google Meet..."
            rows={3}
          />
        </FieldGroup>
      </div>
    </FormSection>
  );
}
