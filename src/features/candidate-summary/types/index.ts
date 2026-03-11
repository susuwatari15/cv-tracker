import { z } from "zod";

export const summaryFormSchema = z.object({
  position: z.string(),
  cv: z.string().min(1, "Nhập thông tin ứng viên trước nhé!"),
  interviewResult: z.string(),
});

export type SummaryFormValues = z.infer<typeof summaryFormSchema>;
