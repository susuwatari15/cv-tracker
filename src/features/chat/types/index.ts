/**
 * Starter prompts. `label` is what the chip shows; `text` is what lands in
 * the composer. They were previously one emoji-prefixed string that got
 * regex-stripped at click time — a fragile coupling and an emoji doing
 * icon duty.
 */
export interface QuickPrompt {
	label: string;
	text: string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
	{
		label: "Soạn JD Data Engineer",
		text: "Soạn JD cho vị trí Senior Data Engineer, tech stack Spark + Airflow + Python.",
	},
	{
		label: "Email mời phỏng vấn",
		text: "Viết email mời phỏng vấn vòng 1 cho ứng viên, tone thân thiện chuyên nghiệp.",
	},
	{
		label: "Khoảng lương Cloud Architect",
		text: "Khoảng lương thị trường cho Cloud Architect tại TP.HCM, 7-10 năm kinh nghiệm.",
	},
	{
		label: "Checklist đánh giá BA ERP",
		text: "Xây checklist đánh giá mức độ phù hợp cho vị trí Business Analyst ERP.",
	},
	{
		label: "Mẫu email từ chối",
		text: "Viết mẫu email từ chối ứng viên sau phỏng vấn, giữ thiện cảm và có feedback ngắn.",
	},
];
