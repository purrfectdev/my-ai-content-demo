import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isLoggedIn: !!user && !!token,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        });
        // 可选：同时清除 localStorage 中的备份（persist 会自动处理，但为了保险）
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      },

      hydrate: () => {
        // 从 localStorage 恢复状态（persist 中间件会自动处理）
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, token, isLoggedIn: true });
          } catch (e) {
            console.error("恢复用户状态失败", e);
          }
        }
      },
    }),
    {
      name: "auth-storage", // localStorage 的 key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
