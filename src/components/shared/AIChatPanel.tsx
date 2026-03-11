"use client";

import ChatContainer from "@/features/chat/containers/ChatContainer";

export default function AIChatPanel() {
  return (
    <div className="w-[360px] min-w-[360px] shrink-0 flex flex-col border-l border-border-default bg-surface overflow-hidden">
      <ChatContainer />
    </div>
  );
}
