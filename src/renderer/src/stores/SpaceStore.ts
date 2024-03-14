import { Space } from "@renderer/types/schema";
import { create } from "zustand";

interface ISpaceStore {
  space: Space | null;
  isOpen: boolean;
  actions: {
    open: (space?: Space) => void;
    close: () => void;
  };
}

export const useSpaceStore = create<ISpaceStore>((set) => ({
  space: null,
  isOpen: false,
  actions: {
    open: (space) => set({ space: space ?? null, isOpen: true }),
    close: () => set({ isOpen: false }),
  },
}));
