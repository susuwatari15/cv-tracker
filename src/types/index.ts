export type ToolId =
  | "chat"
  | "cv-parser"
  | "jd-writer"
  | "email-writer"
  | "cv-eval"
  | "candidate-summary"
  | "salary-benchmark"
  | "settings";

export interface ToolMeta {
  id: ToolId;
  label: string;
  icon: string;
  description: string;
  group: "core" | "content" | "config";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ClaudeRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  system?: string;
  maxTokens?: number;
}

export interface ClaudeResponse {
  text: string;
}
