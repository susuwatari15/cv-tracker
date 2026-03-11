import type { JdFormValues } from "@/features/jd-writer/types";
import type { EmailFormValues } from "@/features/email-writer/types";
import type { CvEvalFormValues } from "@/features/cv-eval/types";
import type { SummaryFormValues } from "@/features/candidate-summary/types";
import type { SalaryFormValues } from "@/features/salary-benchmark/types";
import { EMAIL_TYPE_LABELS } from "@/features/email-writer/types";

export const BASE_SYSTEM_PROMPT = `Bạn là trợ lý TA cá nhân của Hue Nguyen — TA Manager chuyên Tech Hiring tại Masan Group, TP.HCM, Việt Nam.

Hồ sơ người dùng:
- Tên: Hue Nguyen (chị Hue)
- Role: Talent Acquisition Manager — Technology Transformation
- Công ty: Masan Group (tập đoàn lớn, nhiều entity: Masan Tech, Masan Consumer, etc.)
- Chuyên môn: Tuyển dụng tech roles (Data, Software Engineering, Cloud/Infra, Security, ERP)
- Kinh nghiệm: 10+ năm TA, đã làm tại VNG Corporation 10 năm
- Phong cách làm việc: IC, hands-on, data-driven

Nguyên tắc hoạt động:
1. Ngôn ngữ: Trả lời bằng Tiếng Việt, tự nhiên và thân thiện
2. Tone: Semi-formal — chuyên nghiệp nhưng gần gũi, như đồng nghiệp thân thiết
3. Output: Tùy từng việc — ngắn gọn khi cần thông tin nhanh, chi tiết khi soạn nội dung
4. Bảo mật: Không lưu, không chia sẻ thông tin ứng viên hay nội dung công việc ra bên ngoài
5. Chính xác: Khi không chắc (đặc biệt salary data), nêu rõ là ước tính dựa trên market knowledge đến 2025
6. Luôn nhớ context: Hue đang tuyển tech roles cho Masan Group — tech market HCM/VN

Khi soạn JD: Dùng format chuẩn, tech-savvy, hấp dẫn với developer/engineer. Không quá corporate cứng nhắc.
Khi viết email: Semi-formal, cá nhân hóa, không template cứng.
Khi đánh giá CV: Khách quan, nêu rõ điểm mạnh/yếu, fit score, câu hỏi nên hỏi thêm.
Khi tóm tắt candidate: Súc tích, highlight key points cho hiring manager bận rộn.
Khi tư vấn salary: Dựa trên market VN 2024-2025, TP.HCM, tech sector.`;

export function buildSystemPrompt(businessContext?: string): string {
  if (!businessContext?.trim()) return BASE_SYSTEM_PROMPT;
  return `${BASE_SYSTEM_PROMPT}\n\n---\nBusiness Context:\n${businessContext}`;
}

export function buildJdPrompt(data: JdFormValues): string {
  return `Soạn JD cho vị trí: ${data.title} (${data.level})
Entity/BU: ${data.entity || "Masan Group"}
${data.salary ? "Mức lương: " + data.salary : ""}
${data.skills ? "Tech stack/Skills yêu cầu: " + data.skills : ""}
${data.context ? "Context về team/dự án: " + data.context : ""}

Yêu cầu JD:
- Tone: Semi-formal, hấp dẫn với engineer/tech talent
- Format chuẩn: About Us, Role Overview, Responsibilities, Requirements, Nice-to-have, Benefits
- Ngôn ngữ: Tiếng Việt (có thể mix tiếng Anh cho tech terms)
- Highlight culture Masan: transformation, scale, impact`;
}

export function buildEmailPrompt(data: EmailFormValues): string {
  const typeLabel = EMAIL_TYPE_LABELS[data.type];
  return `Viết email ${typeLabel} cho ứng viên.
Tên ứng viên: ${data.candidate}
${data.position ? "Vị trí: " + data.position : ""}
Ngôn ngữ: ${data.language === "vi" ? "Tiếng Việt" : "English"}
${data.extra ? "Thông tin thêm: " + data.extra : ""}

Yêu cầu:
- Tone: Semi-formal, thân thiện, chuyên nghiệp — đúng phong cách của chị Hue
- Cá nhân hóa theo tên ứng viên
- Không quá template, có cảm xúc thật
- Người gửi: Hue Nguyen, TA Manager, Masan Group
- Viết email đầy đủ gồm subject line`;
}

export function buildCvEvalPrompt(data: CvEvalFormValues): string {
  return `Đánh giá mức độ phù hợp của ứng viên với vị trí sau.

JD / Yêu cầu vị trí:
${data.jd}

Thông tin CV / Ứng viên:
${data.cv}

Hãy đánh giá theo format:
1. **Fit Score**: X/10 — kèm lý do ngắn gọn
2. **Điểm mạnh**: Top 3-4 điểm match tốt
3. **Điểm cần clarify**: Những gì còn thiếu hoặc chưa rõ
4. **Câu hỏi phỏng vấn gợi ý**: 3-5 câu nên hỏi để đánh giá kỹ hơn
5. **Khuyến nghị**: Nên move forward hay không, lý do`;
}

export function buildSummaryPrompt(data: SummaryFormValues): string {
  return `Tóm tắt profile ứng viên cho hiring manager.

${data.position ? "Vị trí: " + data.position : ""}
Thông tin CV:
${data.cv}
${data.interviewResult ? "Kết quả phỏng vấn: " + data.interviewResult : ""}

Viết tóm tắt ngắn gọn (~150-200 từ) dành cho CTO/Tech Director đang bận:
- Một câu tổng quan về candidate
- Background & kinh nghiệm nổi bật
- Skills match với vị trí
- Điểm cần lưu ý
- Kết quả PV (nếu có)
- Đề xuất next step
Format: súc tích, bullet points, dễ scan nhanh`;
}

export function buildSalaryPrompt(data: SalaryFormValues): string {
  return `Tư vấn salary benchmark cho vị trí:
- Vị trí: ${data.title} (${data.level})
- Địa điểm: ${data.location}
- Kinh nghiệm: ${data.experience || "không rõ"}
- Tech stack: ${data.skills || "general"}

Cung cấp:
1. **Salary range thị trường** (gross/tháng, VNĐ) — chia theo mức Median / Top 25% / Top 10%
2. **So sánh với market**: product company vs outsourcing vs startup
3. **Xu hướng**: mức lương đang tăng/ổn định/cạnh tranh cao không?
4. **Các benefit phổ biến** ngoài lương cơ bản
5. **Lời khuyên** cho chị Hue khi offer vị trí này tại Masan

Lưu ý: Dựa trên market data VN 2024-2025, ghi rõ đây là ước tính thị trường`;
}
