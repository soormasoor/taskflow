import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authLogin, authRegister } from "../api/client";

type User = {
  id: string;
  email: string;
};

type AuthStore = {
  token: string | null;
  user: User | null;
  error: string | null;
  isLoading: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      error: null,
      isLoading: false,
      isGuest: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authLogin(email, password);
          set({
            token: result.token,
            user: result.user,
            isGuest: false,
            isLoading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Login failed",
            isLoading: false,
          });
        }
      },

      register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await authRegister(email, password);
          set({
            token: result.token,
            user: result.user,
            isGuest: false,
            isLoading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Registration failed",
            isLoading: false,
          });
        }
      },

      continueAsGuest: () => {
        set({ isGuest: true, token: null, user: null, error: null });
      },

      logout: () => {
        set({ token: null, user: null, isGuest: false, error: null });
      },
    }),
    {
      name: "taskflow-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isGuest: state.isGuest,
      }),
    },
  ),
);
