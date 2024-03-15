import { create } from "zustand";

interface IInviteStore {
  invitationId: string | null;
  isOpen: boolean;
  actions: {
    setOpen: (isOpen: boolean, invitationId: string | null) => void;
  };
}

export const useInviteStore = create<IInviteStore>((set) => ({
  invitationId: null,
  isOpen: false,
  actions: {
    setOpen: (isOpen, invitationId) => set({ isOpen, invitationId }),
  },
}));
