import { z } from "zod";

export const EMAIL_TYPES = [
  { value: "invite", label: "Mời phỏng vấn" },
  { value: "reject", label: "Từ chối ứng viên" },
  { value: "offer", label: "Thông báo offer" },
  { value: "followup", label: "Follow-up sau PV" },
  { value: "pipeline", label: "Giữ pipeline (on hold)" },
] as const;

export type EmailType = (typeof EMAIL_TYPES)[number]["value"];

export const emailFormSchema = z.object({
  type: z.enum(["invite", "reject", "offer", "followup", "pipeline"]),
  candidate: z.string().min(1, "Nhập tên ứng viên trước nhé!"),
  position: z.string(),
  language: z.enum(["vi", "en"]),
  extra: z.string(),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;

export const EMAIL_TYPE_LABELS: Record<EmailType, string> = {
  invite: "mời phỏng vấn",
  reject: "từ chối nhẹ nhàng",
  offer: "thông báo offer",
  followup: "follow-up sau phỏng vấn",
  pipeline: "giữ candidate trong pipeline (on hold)",
};
