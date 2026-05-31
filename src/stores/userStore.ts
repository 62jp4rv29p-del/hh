"use client";

import { create } from "zustand";
import { getTodayGreetingKey } from "@/lib/mock-messages";

interface UserState {
  userId: string | null;
  nickname: string | null;
  greetingEnabled: boolean;
  todayGreetingRead: boolean;
}

interface UserActions {
  setUser: (userId: string, nickname: string) => void;
  clearUser: () => void;
  markGreetingRead: () => void;
  initGreetingState: () => void;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  userId: null,
  nickname: null,
  greetingEnabled: true,
  todayGreetingRead: false,

  setUser: (userId, nickname) => set({ userId, nickname }),
  clearUser: () => set({ userId: null, nickname: null }),

  markGreetingRead: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(getTodayGreetingKey(), "true");
    }
    set({ todayGreetingRead: true });
  },

  initGreetingState: () => {
    if (typeof window === "undefined") return;
    const read = localStorage.getItem(getTodayGreetingKey()) === "true";
    set({ todayGreetingRead: read });
  },
}));
