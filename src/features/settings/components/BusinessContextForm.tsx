import { UseFormRegister } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import FieldGroup from "@/components/shared/FieldGroup";
import type { ContextKey } from "@/stores/settingsStore";
import type { BusinessContextField } from "../types";

interface BusinessContextFormProps {
  register: UseFormRegister<Record<ContextKey, string>>;
  fields: BusinessContextField[];
}

export default function BusinessContextForm({
  register,
  fields,
}: BusinessContextFormProps) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <FieldGroup key={field.key} label={field.label}>
          <Textarea
            {...register(field.key)}
            placeholder={field.placeholder}
            className="min-h-[80px] resize-y text-[13px] "
          />
        </FieldGroup>
      ))}
    </div>
  );
}
