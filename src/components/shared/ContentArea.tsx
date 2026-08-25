"use client";

import { useEffect, useRef } from "react";
import { useToolStore } from "@/stores/toolStore";
import ToolHeader from "./ToolHeader";
import AssistantFab from "./AssistantFab";
import OverviewHub from "@/features/overview/components/OverviewHub";
import CvParserContainer from "@/features/cv-parser/containers/CvParserContainer";
import JdWriterContainer from "@/features/jd-writer/containers/JdWriterContainer";
import EmailWriterContainer from "@/features/email-writer/containers/EmailWriterContainer";
import CvEvalContainer from "@/features/cv-eval/containers/CvEvalContainer";
import SummaryContainer from "@/features/candidate-summary/containers/SummaryContainer";
import SalaryContainer from "@/features/salary-benchmark/containers/SalaryContainer";
import SettingsContainer from "@/features/settings/containers/SettingsContainer";

const TOOL_MAP: Record<string, React.ReactNode> = {
	chat: <OverviewHub />,
	"cv-parser": <CvParserContainer />,
	"jd-writer": <JdWriterContainer />,
	"email-writer": <EmailWriterContainer />,
	"cv-eval": <CvEvalContainer />,
	"candidate-summary": <SummaryContainer />,
	"salary-benchmark": <SalaryContainer />,
	settings: <SettingsContainer />,
};

export default function ContentArea() {
	const activeTool = useToolStore((s) => s.activeTool);
	const scrollRef = useRef<HTMLDivElement>(null);

	// Switching tools must land at the top of the new screen, and reset
	// focus to the main region so screen readers announce the change.
	useEffect(() => {
		scrollRef.current?.scrollTo({ top: 0 });
	}, [activeTool]);

	return (
		<div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-canvas">
			<ToolHeader />
			<main
				ref={scrollRef}
				id="main-content"
				tabIndex={-1}
				className="flex-1 overflow-y-auto p-4 pb-24 md:p-7 md:pb-28"
			>
				{TOOL_MAP[activeTool] ?? null}
			</main>

			<AssistantFab />
		</div>
	);
}
