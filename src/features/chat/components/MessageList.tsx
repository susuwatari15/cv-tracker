import type { RefObject } from "react";
import type { ChatMessage } from "@/types";
import MessageBubble from "./MessageBubble";
import ThinkingIndicator from "./ThinkingIndicator";

interface MessageListProps {
  messages: ChatMessage[];
  isThinking: boolean;
  listRef: RefObject<HTMLDivElement | null>;
}

export default function MessageList({
  messages,
  isThinking,
  listRef,
}: MessageListProps) {
  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto pb-5 px-5 pt-4 flex flex-col gap-5"
    >
      <MessageBubble
        role="assistant"
        content="Chào **Hue**! Tôi là trợ lý TA của bạn. Hỏi tôi bất cứ điều gì về tuyển dụng tech — soạn JD, viết email, đánh giá CV, salary... ✦"
      />

      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}

      {isThinking && <ThinkingIndicator />}
    </div>
  );
}
