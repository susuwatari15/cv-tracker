import type { ContextKey } from "@/stores/settingsStore";
import type { ToolId } from "@/types";

/** Panels in the settings secondary navigation. */
export type SettingsSectionId = "connection" | "context";

export interface BusinessContextField {
	key: ContextKey;
	/** Which tool this context is injected into. Drives label + icon. */
	toolId: ToolId;
	/** Persistent guidance under the field. */
	hint: string;
	placeholder: string;
}

export const BUSINESS_CONTEXT_FIELDS: BusinessContextField[] = [
	{
		key: "ta_ctx_chat",
		toolId: "chat",
		hint: "Bối cảnh chung cho trợ lý ở panel bên phải: bạn là ai, làm ở đâu.",
		placeholder:
			"Hue Nguyen, TA Manager tại Masan Group, phụ trách tuyển dụng khối công nghệ.",
	},
	{
		key: "ta_ctx_jd",
		toolId: "jd-writer",
		hint: "Giọng văn, cấu trúc JD chuẩn và các mục bắt buộc phải có.",
		placeholder:
			"Công ty: Masan Group. Tone: bán chính thức, thân thiện với dân kỹ thuật. Luôn có mục quyền lợi.",
	},
	{
		key: "ta_ctx_email",
		toolId: "email-writer",
		hint: "Người gửi, chữ ký và mức độ trang trọng mong muốn.",
		placeholder:
			"Người gửi: Hue Nguyen — TA Manager. Ký tên đầy đủ kèm số điện thoại.",
	},
	{
		key: "ta_ctx_eval",
		toolId: "cv-eval",
		hint: "Tiêu chí chấm điểm và định dạng kết quả bạn muốn nhận.",
		placeholder:
			"Tập trung vào vị trí công nghệ. Luôn đưa điểm phù hợp, điểm mạnh và khoảng trống.",
	},
	{
		key: "ta_ctx_summary",
		toolId: "candidate-summary",
		hint: "Người đọc bản tóm tắt và độ dài mong muốn.",
		placeholder:
			"Người đọc: CTO hoặc Tech Director. Độ dài 150–200 từ, kết bằng khuyến nghị rõ ràng.",
	},
	{
		key: "ta_ctx_salary",
		toolId: "salary-benchmark",
		hint: "Thị trường tham chiếu, đơn vị tiền tệ và mốc thời gian dữ liệu.",
		placeholder:
			"Thị trường công nghệ Việt Nam 2024–2025, chủ yếu TP.HCM. Đơn vị: triệu VND gross/tháng.",
	},
];
