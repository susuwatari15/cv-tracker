import type { RefObject } from "react";
import type { ChatMessage } from "@/types";
import MessageBubble from "./MessageBubble";
import ThinkingIndicator from "./ThinkingIndicator";

interface MessageListProps {
	messages: ChatMessage[];
	isThinking: boolean;
	listRef: RefObject<HTMLDivElement | null>;
}

const GREETING =
	"Chào **Hue**. Tôi hỗ trợ các việc tuyển dụng công nghệ: soạn JD, viết email ứng viên, đánh giá hồ sơ, tham chiếu lương. Bạn cần gì?";

export default function MessageList({
	messages,
	isThinking,
	listRef,
}: MessageListProps) {
	return (
		<div
			ref={listRef}
			role="log"
			aria-label="Lịch sử hội thoại"
			aria-live="polite"
			className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
		>
			<MessageBubble role="assistant" content={GREETING} />

			{messages.map((msg) => (
				<MessageBubble key={msg.id} role={msg.role} content={msg.content} />
			))}

			{isThinking && <ThinkingIndicator />}
		</div>
	);
}
