import { create } from "zustand";
import type { AuthUser } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;

  setAuth: (user: AuthUser, accessToken: string) => void;

  setAccessToken: (accessToken: string) => void;

  setInitializing: (value: boolean) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,

  setAuth: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  setAccessToken: (accessToken) => {
    set({
      accessToken,
    });
  },

  setInitializing: (value) => {
    set({
      isInitializing: value,
    });
  },

  logout: () => {
    localStorage.removeItem("sprintdesk-refresh-token");

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));
