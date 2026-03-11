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
import { JD_LEVELS, type JdLevel } from "@/features/jd-writer/types";
import { LOCATIONS, type Location, type SalaryFormValues } from "../types";

interface SalaryFormProps {
  form: UseFormReturn<SalaryFormValues>;
  onSubmit: (data: SalaryFormValues) => void;
}

export default function SalaryForm({ form }: SalaryFormProps) {
  return (
    <FormSection title="Tư vấn Salary Benchmark" icon="💰">
      <div className="grid grid-cols-2 gap-3.5">
        <FieldGroup label="Vị trí" required>
          <Input
            {...form.register("title")}
            placeholder="VD: Cloud Architect"
          />
          {form.formState.errors.title && (
            <span className="text-red-500 text-xs">
              {form.formState.errors.title.message}
            </span>
          )}
        </FieldGroup>

        <FieldGroup label="Level">
          <Select
            defaultValue={form.getValues("level")}
            onValueChange={(v) => form.setValue("level", v as JdLevel)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn level" />
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

        <FieldGroup label="Địa điểm">
          <Select
            defaultValue={form.getValues("location")}
            onValueChange={(v) => form.setValue("location", v as Location)}
          >
            <SelectTrigger>
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
            placeholder="VD: 5-7 năm"
          />
        </FieldGroup>
      </div>

      <div className="mt-3.5">
        <FieldGroup label="Tech stack / Specialization">
          <Textarea
            {...form.register("skills")}
            placeholder="VD: AWS, Kubernetes, Terraform, Security..."
            rows={3}
          />
        </FieldGroup>
      </div>
    </FormSection>
  );
}
