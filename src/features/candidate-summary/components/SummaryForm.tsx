import { UseFormReturn } from "react-hook-form";
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
  return (
    <FormSection title="Tóm tắt Candidate cho Hiring Manager" icon="📋">
      <div className="flex flex-col gap-3.5">
        <FieldGroup label="Vị trí đang tuyển">
          <Input
            {...form.register("position")}
            placeholder="VD: Senior Data Engineer, Masan Tech"
          />
        </FieldGroup>

        <FieldGroup label="Thông tin ứng viên" required>
          <Textarea
            {...form.register("cv")}
            placeholder="Paste CV hoặc ghi tóm tắt: tên, kinh nghiệm, skills, điểm mạnh/yếu, kết quả phỏng vấn..."
            className="min-h-[120px]"
          />
          {form.formState.errors.cv && (
            <span className="text-red-500 text-xs">
              {form.formState.errors.cv.message}
            </span>
          )}
        </FieldGroup>

        <FieldGroup label="Kết quả các vòng PV (nếu có)">
          <Textarea
            {...form.register("interviewResult")}
            placeholder="VD: Round 1 Technical - Passed. Feedback: Strong in Spark, weak in system design..."
            rows={3}
          />
        </FieldGroup>
      </div>
    </FormSection>
  );
}
