import { z } from "zod";
import { JD_LEVELS } from "@/features/jd-writer/types";

export const LOCATIONS = ["TP.HCM", "Hà Nội", "Đà Nẵng", "Remote"] as const;
export type Location = (typeof LOCATIONS)[number];

export const salaryFormSchema = z.object({
  title: z.string().min(1, "Nhập tên vị trí trước nhé!"),
  level: z.enum(JD_LEVELS),
  location: z.enum(LOCATIONS),
  experience: z.string(),
  skills: z.string(),
});

export type SalaryFormValues = z.infer<typeof salaryFormSchema>;
