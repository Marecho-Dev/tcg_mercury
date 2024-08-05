import { create } from "zustand";
import type { Cards } from "~/app/inventory/columns";

interface SelectedRowsState {
  selectedRows: Cards[];
  setSelectedRows: (rows: Cards[]) => void;
  progress: {
    current: number;
    total: number;
    isAnalyzing: boolean;
  };
  setProgress: (progress: Partial<SelectedRowsState["progress"]>) => void;
}

export const useSelectedRowsStore = create<SelectedRowsState>((set) => ({
  selectedRows: [],
  setSelectedRows: (rows) => set({ selectedRows: rows }),
  progress: {
    current: 0,
    total: 0,
    isAnalyzing: false,
  },
  setProgress: (progress) =>
    set((state) => ({ progress: { ...state.progress, ...progress } })),
}));
