import { create } from "zustand";
import type { UserData } from "~/utils/types/user";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userData: UserData | null;
  setAuthenticated: (value: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setUserData: (data: UserData | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  userData: null,
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setAccessToken: (token: string | null) => set({ accessToken: token }),
  setUserData: (data: UserData | null) => set({ userData: data }),
}));
