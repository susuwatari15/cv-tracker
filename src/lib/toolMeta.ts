import {
	ClipboardList,
	CircleDollarSign,
	FileSignature,
	GitCompareArrows,
	LayoutDashboard,
	Mail,
	ScanText,
	Settings,
	type LucideIcon,
} from "lucide-react";
import type { ToolId } from "@/types";

/**
 * Single source of truth for tool identity: icon, label, description.
 * Sidebar, ToolHeader and the overview hub all read from here, so a tool
 * can never present itself differently in two places.
 *
 * Icons are Lucide components — never emoji. Emoji render differently per
 * OS and font, can't inherit a design token, and read as consumer-chat
 * rather than a system of record.
 */
export interface ToolDescriptor {
	id: ToolId;
	label: string;
	/** Sentence-case summary shown in the tool header and overview card. */
	description: string;
	icon: LucideIcon;
}

export const TOOLS: Record<ToolId, ToolDescriptor> = {
	chat: {
		id: "chat",
		label: "Tổng quan",
		description: "Trạng thái cấu hình và lối vào nhanh cho từng công cụ",
		icon: LayoutDashboard,
	},
	"cv-parser": {
		id: "cv-parser",
		label: "Bóc tách CV",
		description: "Trích xuất dữ liệu ứng viên từ PDF hoặc ảnh CV sang bảng tính",
		icon: ScanText,
	},
	"cv-eval": {
		id: "cv-eval",
		label: "Đánh giá CV vs JD",
		description:
			"So khớp hồ sơ với yêu cầu vị trí, nêu điểm mạnh và khoảng trống",
		icon: GitCompareArrows,
	},
	"candidate-summary": {
		id: "candidate-summary",
		label: "Tóm tắt ứng viên",
		description: "Soạn bản tóm tắt hồ sơ để trình hiring manager",
		icon: ClipboardList,
	},
	"jd-writer": {
		id: "jd-writer",
		label: "Soạn JD",
		description: "Dựng bản mô tả công việc chuẩn cho các vị trí công nghệ",
		icon: FileSignature,
	},
	"email-writer": {
		id: "email-writer",
		label: "Email ứng viên",
		description: "Thư mời phỏng vấn, từ chối và offer — cá nhân hoá theo hồ sơ",
		icon: Mail,
	},
	"salary-benchmark": {
		id: "salary-benchmark",
		label: "Tham chiếu lương",
		description:
			"Khoảng lương thị trường công nghệ Việt Nam theo cấp và địa bàn",
		icon: CircleDollarSign,
	},
	settings: {
		id: "settings",
		label: "Cấu hình",
		description: "Nhà cung cấp AI, API key và business context cho từng công cụ",
		icon: Settings,
	},
};

/**
 * Navigation is grouped by recruiting-pipeline stage rather than by
 * "main tools / content", so the sidebar mirrors how a TA lead actually
 * works: sàng lọc → tiếp cận → tham chiếu.
 */
export interface ToolGroup {
	label: string;
	tools: ToolId[];
}

export const TOOL_GROUPS: ToolGroup[] = [
	{
		label: "Sàng lọc & Đánh giá",
		tools: ["cv-parser", "cv-eval", "candidate-summary"],
	},
	{ label: "Tiếp cận & Tuyển dụng", tools: ["jd-writer", "email-writer"] },
	{ label: "Tham chiếu thị trường", tools: ["salary-benchmark"] },
	{ label: "Hệ thống", tools: ["settings"] },
];

export function getTool(id: ToolId): ToolDescriptor {
	return TOOLS[id] ?? TOOLS.chat;
}
