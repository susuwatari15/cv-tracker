import { Sparkles, UserRound } from "lucide-react";
import { formatText } from "@/lib/formatText";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
	role: "user" | "assistant";
	content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
	const isUser = role === "user";

	return (
		<div className={cn("animate-fade-up flex gap-2.5", isUser && "flex-row-reverse")}>
			<span
				aria-hidden="true"
				className={cn(
					"mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
					isUser
						? "bg-canvas-2 text-ink-2"
						: "bg-ta-accent text-ta-accent-fg",
				)}
			>
				{isUser ? (
					<UserRound className="size-3.5" />
				) : (
					<Sparkles className="size-3.5" />
				)}
			</span>

			<div
				className={cn(
					"max-w-[80%] rounded-xl px-3.5 py-2.5",
					isUser
						? "rounded-tr-sm bg-ta-accent text-ta-accent-fg"
						: "rounded-tl-sm border border-border-default bg-surface-2 text-ink",
				)}
			>
				<span className="sr-only">
					{isUser ? "Bạn: " : "Trợ lý: "}
				</span>
				<div
					className={cn("prose-ai text-[13px]", isUser && "[&_*]:text-ta-accent-fg")}
					dangerouslySetInnerHTML={{ __html: formatText(content) }}
				/>
			</div>
		</div>
	);
}
