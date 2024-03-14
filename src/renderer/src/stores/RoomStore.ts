import { Room } from "@renderer/types/schema";
import { create } from "zustand";

interface IRoomStore {
  room: Room | null;
  isOpen: boolean;
  actions: {
    open: (room?: Room) => void;
    close: () => void;
  };
}

export const useRoomStore = create<IRoomStore>((set) => ({
  room: null,
  isOpen: false,
  actions: {
    open: (room) => set({ room: room ?? null, isOpen: true }),
    close: () => set({ isOpen: false }),
  },
}));
