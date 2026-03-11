import { z } from "zod";

export const JD_LEVELS = [
  "Junior",
  "Mid",
  "Senior",
  "Lead",
  "Manager",
  "Head",
  "Director",
] as const;
export type JdLevel = (typeof JD_LEVELS)[number];

export const jdFormSchema = z.object({
  title: z.string().min(1, "Nhập tên vị trí trước nhé!"),
  level: z.enum(JD_LEVELS),
  entity: z.string(),
  salary: z.string(),
  skills: z.string(),
  context: z.string(),
});

export type JdFormValues = z.infer<typeof jdFormSchema>;
