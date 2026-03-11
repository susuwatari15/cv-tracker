"use client";

import { useToolStore } from "@/stores/toolStore";
import ToolHeader from "./ToolHeader";
import CvParserContainer from "@/features/cv-parser/containers/CvParserContainer";
import JdWriterContainer from "@/features/jd-writer/containers/JdWriterContainer";
import EmailWriterContainer from "@/features/email-writer/containers/EmailWriterContainer";
import CvEvalContainer from "@/features/cv-eval/containers/CvEvalContainer";
import SummaryContainer from "@/features/candidate-summary/containers/SummaryContainer";
import SalaryContainer from "@/features/salary-benchmark/containers/SalaryContainer";
import SettingsContainer from "@/features/settings/containers/SettingsContainer";

const TOOL_MAP: Record<string, React.ReactNode> = {
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-canvas min-w-0">
      <ToolHeader />
      <div className="flex-1 overflow-y-auto p-7 md:p-8">
        {activeTool === "chat" ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-5xl mb-4">✦</span>
            <h3 className="text-[20px] text-ink font-semibold mb-2">
              Trợ lý AI
            </h3>
            <p className="text-[13px] text-ink-2 max-w-[320px]">
              Chat panel ở bên phải luôn hiển thị. Chọn công cụ khác từ sidebar
              để sử dụng.
            </p>
          </div>
        ) : (
          TOOL_MAP[activeTool] ?? null
        )}
      </div>
    </div>
  );
}
