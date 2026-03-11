import { formatText } from "@/lib/formatText";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-3 animate-fade-up ${
        role === "user" ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] shrink-0 mt-0.5 font-semibold text-white ${
            role === "assistant"
              ? "bg-ta-accent"
              : "bg-gradient-to-br from-ta-accent to-ta-amber"
          }`}
      >
        {role === "assistant" ? "✦" : "H"}
      </div>
      <div
        className={`max-w-[72%] px-[18px] py-[14px] text-[13.5px] leading-[1.65] rounded-2xl
          ${
            role === "assistant"
              ? "bg-surface border border-border-default rounded-tl-[4px] text-ink shadow-sm"
              : "bg-ink text-[#f7f4ef] rounded-tr-[4px]"
          }`}
        dangerouslySetInnerHTML={{ __html: formatText(content) }}
      />
    </div>
  );
}
