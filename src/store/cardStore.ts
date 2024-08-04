// stores/useSelectedRowsStore.ts
import { create } from "zustand";
import type { Cards } from "~/app/inventory/columns";

interface SelectedRowsState {
  selectedRows: Cards[];
  setSelectedRows: (rows: Cards[]) => void;
  clearSelectedRows: () => void;
  analyzeRequested: boolean;
  setAnalyzeRequested: (value: boolean) => void;
}

export const useSelectedRowsStore = create<SelectedRowsState>((set) => ({
  selectedRows: [],
  setSelectedRows: (rows: Cards[]) => set({ selectedRows: rows }),
  clearSelectedRows: () => set({ selectedRows: [] }),
  analyzeRequested: false,
  setAnalyzeRequested: (value) => set({ analyzeRequested: value }),
}));
