import { create } from "zustand";
import type { UserData, ProjectDocument } from "~/utils/types/supabase";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userData: UserData | null;
  userProjects: ProjectDocument[];
  setAuthenticated: (value: boolean) => void;
  setUserProjects: (projects: ProjectDocument[]) => void;
  setAccessToken: (token: string | null) => void;
  setUserData: (data: UserData | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  userProjects: [],
  userData: null,
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUserProjects: (projects: ProjectDocument[]) =>
    set({ userProjects: projects }),
  setAccessToken: (token: string | null) => set({ accessToken: token }),
  setUserData: (data: UserData | null) => set({ userData: data }),
}));
