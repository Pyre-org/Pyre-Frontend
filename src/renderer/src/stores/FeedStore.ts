import { Feed } from "@renderer/types/schema";
import { create } from "zustand";

interface IFeedStore {
  feed: Feed | null;
  isOpen: boolean;
  actions: {
    open: (feed?: Feed) => void;
    close: () => void;
  };
}

export const useFeedStore = create<IFeedStore>((set) => ({
  feed: null,
  isOpen: false,
  actions: {
    open: (feed) => set({ feed: feed ?? null, isOpen: true }),
    close: () => set({ isOpen: false }),
  },
}));
