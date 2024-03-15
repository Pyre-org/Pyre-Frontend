import { create } from "zustand";

interface IInviteStore {
  isOpen: boolean;
  actions: {
    setOpen: (isOpen: boolean) => void;
  };
}

export const useInviteStore = create<IInviteStore>((set) => ({
  isOpen: false,
  actions: {
    setOpen: (isOpen) => set({ isOpen }),
  },
}));
