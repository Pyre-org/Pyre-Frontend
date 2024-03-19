import { create } from "zustand";

interface IAuthStore {
  token: string | null;
  actions: {
    setToken: (token: string | null) => void;
  };
}

export const AuthStore = create<IAuthStore>((set) => ({
  token: null,
  actions: {
    setToken: (token) => set(() => ({ token })),
  },
}));

export const getToken = () => AuthStore.getState().token;
export const setToken = AuthStore.getState().actions.setToken;

export const useToken = () => AuthStore((state) => state.token);
export const useAuthStoreActions = () => AuthStore((state) => state.actions);
