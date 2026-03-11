"use client";

import { useState } from "react";
import { callClaude, type ClaudeCallOptions } from "@/services/claude";
import { toast } from "sonner";

interface UseClaudeApiReturn {
  isLoading: boolean;
  call: (options: ClaudeCallOptions) => Promise<string | null>;
}

export function useClaudeApi(): UseClaudeApiReturn {
  const [isLoading, setIsLoading] = useState(false);

  const call = async (options: ClaudeCallOptions): Promise<string | null> => {
    setIsLoading(true);
    try {
      return await callClaude(options);
    } catch (err) {
      toast.error(
        "Lỗi: " + (err instanceof Error ? err.message : "Unknown error")
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, call };
}
