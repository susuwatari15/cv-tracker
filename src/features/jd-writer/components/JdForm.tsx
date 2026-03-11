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
import { JD_LEVELS, type JdFormValues, type JdLevel } from "../types";

interface JdFormProps {
  form: UseFormReturn<JdFormValues>;
  onSubmit: (data: JdFormValues) => void;
}

export default function JdForm({ form }: JdFormProps) {
  return (
    <FormSection title="Thông tin vị trí" icon="📝">
      <div className="grid grid-cols-2 gap-3.5">
        <FieldGroup label="Tên vị trí" required>
          <Input
            {...form.register("title")}
            placeholder="VD: Senior Data Engineer"
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

        <FieldGroup label="Entity / BU">
          <Input
            {...form.register("entity")}
            placeholder="VD: Masan Tech / Masan Group"
          />
        </FieldGroup>

        <FieldGroup label="Mức lương (nếu có)">
          <Input
            {...form.register("salary")}
            placeholder="VD: 40-60M gross"
          />
        </FieldGroup>
      </div>

      <div className="grid grid-cols-1 gap-3.5 mt-3.5">
        <FieldGroup label="Tech stack / Yêu cầu kỹ năng chính">
          <Textarea
            {...form.register("skills")}
            placeholder="VD: Spark, Airflow, Python, SQL..."
            rows={3}
          />
        </FieldGroup>
        <FieldGroup label="Mô tả ngắn về team / dự án">
          <Textarea
            {...form.register("context")}
            placeholder="VD: Team Data Platform, đang build data lake..."
            rows={3}
          />
        </FieldGroup>
      </div>
    </FormSection>
  );
}
