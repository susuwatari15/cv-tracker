import { z } from "zod";

export const cvEvalFormSchema = z.object({
  jd: z.string().min(1, "Nhập tóm tắt JD trước nhé!"),
  cv: z.string().min(1, "Nhập thông tin CV trước nhé!"),
});

export type CvEvalFormValues = z.infer<typeof cvEvalFormSchema>;
