import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "@/components/shared/FormSection";
import FieldGroup from "@/components/shared/FieldGroup";
import type { CvEvalFormValues } from "../types";

interface CvEvalFormProps {
  form: UseFormReturn<CvEvalFormValues>;
  onSubmit: (data: CvEvalFormValues) => void;
}

export default function CvEvalForm({ form }: CvEvalFormProps) {
  return (
    <FormSection title="Đánh giá CV fit với JD" icon="🔍">
      <div className="flex flex-col gap-3.5">
        <FieldGroup label="Tóm tắt JD / Yêu cầu vị trí" required>
          <Textarea
            {...form.register("jd")}
            placeholder="Paste JD hoặc tóm tắt yêu cầu: Level, skills bắt buộc, nice-to-have, kinh nghiệm..."
            className="min-h-[100px]"
          />
          {form.formState.errors.jd && (
            <span className="text-red-500 text-xs">
              {form.formState.errors.jd.message}
            </span>
          )}
        </FieldGroup>

        <FieldGroup label="Thông tin CV / Hồ sơ ứng viên" required>
          <Textarea
            {...form.register("cv")}
            placeholder="Paste nội dung CV hoặc tóm tắt: tên, kinh nghiệm, skills, công ty cũ, học vấn..."
            className="min-h-[120px]"
          />
          {form.formState.errors.cv && (
            <span className="text-red-500 text-xs">
              {form.formState.errors.cv.message}
            </span>
          )}
        </FieldGroup>
      </div>
    </FormSection>
  );
}
