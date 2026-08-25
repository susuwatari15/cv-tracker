import Image from "next/image";
import { Sparkles } from "lucide-react";
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
			{isUser ? (
				<Image
					src="/user.png"
					alt=""
					width={56}
					height={56}
					aria-hidden="true"
					className="mt-0.5 size-7 shrink-0 rounded-full bg-canvas-2 object-cover"
				/>
			) : (
				<span
					aria-hidden="true"
					className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-ta-accent text-ta-accent-fg"
				>
					<Sparkles className="size-3.5" />
				</span>
			)}

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
