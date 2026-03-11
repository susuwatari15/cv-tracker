"use client";

import { useToolStore } from "@/stores/toolStore";

const TOOL_META: Record<string, { title: string; desc: string }> = {
	"cv-parser": {
		title: "CV Parser",
		desc: "Upload PDF/ảnh CV → AI extract thông tin → copy vào Excel",
	},
	"jd-writer": {
		title: "Soạn JD",
		desc: "Tạo Job Description chuẩn cho tech roles",
	},
	"email-writer": {
		title: "Viết Email Ứng Viên",
		desc: "Mời PV, reject, offer — bán tự động, cá nhân hóa",
	},
	"cv-eval": {
		title: "Đánh giá CV vs JD",
		desc: "Phân tích mức độ phù hợp của ứng viên với vị trí",
	},
	"candidate-summary": {
		title: "Tóm tắt Candidate",
		desc: "Tóm tắt profile cho hiring manager",
	},
	"salary-benchmark": {
		title: "Salary Benchmark",
		desc: "Tư vấn mức lương thị trường tech VN 2024-2025",
	},
	settings: {
		title: "Settings",
		desc: "Cấu hình API key và Business Context cho từng công cụ",
	},
	chat: {
		title: "Trợ lý AI",
		desc: "Chat tự do — hỏi bất cứ điều gì liên quan đến công việc TA",
	},
};

export default function ToolHeader() {
	const activeTool = useToolStore((s) => s.activeTool);
	const meta = TOOL_META[activeTool] ?? { title: activeTool, desc: "" };

	return (
		<div className="flex items-center justify-between px-8 py-5 border-b border-border-default bg-surface shrink-0">
			<div>
				<h2 className=" text-[18px] font-semibold text-ink">{meta.title}</h2>
				<p className="text-[12px] font-mono text-ink-3 mt-0.5">{meta.desc}</p>
			</div>
			<span className="text-[11px] font-mono text-ink-3 bg-canvas-2 border border-border-default px-2.5 py-1 rounded-full">
				claude-opus-4-5
			</span>
		</div>
	);
}
