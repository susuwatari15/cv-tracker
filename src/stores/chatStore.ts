import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface ChatStore {
  messages: ChatMessage[];
  isThinking: boolean;
  addMessage: (
    role: "user" | "assistant",
    content: string
  ) => ChatMessage;
  setThinking: (v: boolean) => void;
  clearMessages: () => void;
  getApiMessages: () => { role: "user" | "assistant"; content: string }[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isThinking: false,

  addMessage: (role, content) => {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
    return msg;
  },

  setThinking: (v) => set({ isThinking: v }),

  clearMessages: () => set({ messages: [] }),

  getApiMessages: () =>
    get().messages.map(({ role, content }) => ({ role, content })),
}));
