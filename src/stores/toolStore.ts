import { create } from "zustand";
import type { ToolId } from "@/types";

interface ToolStore {
  activeTool: ToolId;
  setActiveTool: (id: ToolId) => void;
}

export const useToolStore = create<ToolStore>((set) => ({
  activeTool: "chat",
  setActiveTool: (id) => set({ activeTool: id }),
}));
