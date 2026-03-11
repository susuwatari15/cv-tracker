"use client";

import { useToolStore } from "@/stores/toolStore";
import { useApiKeyStore } from "@/stores/apiKeyStore";
import ApiStatusDot from "./ApiStatusDot";
import type { ToolId } from "@/types";

const TOOL_GROUPS = [
	{
		label: "Công cụ chính",
		tools: [
			{ id: "chat" as ToolId, icon: "💬", label: "Trợ lý AI" },
			{ id: "cv-parser" as ToolId, icon: "📄", label: "CV Parser" },
			{ id: "jd-writer" as ToolId, icon: "📝", label: "Soạn JD" },
			{ id: "email-writer" as ToolId, icon: "📧", label: "Viết Email UV" },
			{ id: "cv-eval" as ToolId, icon: "🔍", label: "Đánh giá CV vs JD" },
		],
	},
	{
		label: "Nội dung",
		tools: [
			{
				id: "candidate-summary" as ToolId,
				icon: "📋",
				label: "Tóm tắt Candidate",
			},
			{
				id: "salary-benchmark" as ToolId,
				icon: "💰",
				label: "Salary Benchmark",
			},
		],
	},
	{
		label: "Cài đặt",
		tools: [{ id: "settings" as ToolId, icon: "⚙️", label: "Settings" }],
	},
];

export default function Sidebar() {
	const { activeTool, setActiveTool } = useToolStore();
	const { key, status, setKey } = useApiKeyStore();

	return (
		<div className="min-[720px]:flex hidden w-[280px] min-w-[280px] shrink-0 flex-col h-full bg-ink overflow-y-auto">
			{/* Brand header */}
			<div className="px-5 pt-6 pb-5 border-b border-white/10">
				<div className="flex items-center gap-2.5 mb-1">
					<span className="text-ta-accent text-xl">✦</span>
					<span className="text-white text-[17px] font-semibold tracking-tight">
						TA Assistant
					</span>
				</div>
				<p className="text-[11px] font-mono text-white/40 ml-8">
					Masan Group · Tech Hiring
				</p>
			</div>

			{/* API key row */}
			<div className="px-5 py-4 border-b border-white/10">
				<label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.8px] block mb-2">
					Anthropic API Key
				</label>
				<div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-[8px] px-3 py-2">
					<ApiStatusDot status={status} />
					<input
						type="password"
						value={key}
						onChange={(e) => setKey(e.target.value)}
						placeholder="sk-ant-..."
						className="flex-1 bg-transparent text-[12px] font-mono text-white placeholder:text-white/25 outline-none min-w-0"
					/>
				</div>
				<p className="text-[10px] font-mono text-white/30 mt-1.5">
					{status === "valid"
						? "✓ Key hợp lệ"
						: status === "invalid"
							? "✗ Key không hợp lệ"
							: "Nhập key để sử dụng"}
				</p>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-3 py-4 flex flex-col gap-5">
				{TOOL_GROUPS.map((group) => (
					<div key={group.label}>
						<p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.8px] px-2 mb-2">
							{group.label}
						</p>
						<div className="flex flex-col gap-0.5">
							{group.tools.map((tool) => {
								const isActive = activeTool === tool.id;
								return (
									<button
										key={tool.id}
										onClick={() => setActiveTool(tool.id)}
										className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] transition-all text-left w-full
                      ${
												isActive
													? "bg-ta-accent/15 border border-ta-accent/30 text-white"
													: "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
											}`}
									>
										<span className="text-[15px]">{tool.icon}</span>
										<span className="font-medium">{tool.label}</span>
									</button>
								);
							})}
						</div>
					</div>
				))}
			</nav>

			{/* Profile chip */}
			<div className="px-5 py-4 border-t border-white/10">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-gradient-to-br from-ta-accent to-ta-amber flex items-center justify-center text-white text-[13px] font-semibold shrink-0">
						H
					</div>
					<div>
						<p className="text-[12px] text-white font-medium">Hue Nguyen</p>
						<p className="text-[10px] font-mono text-white/40">
							TA Manager · Masan Group
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
