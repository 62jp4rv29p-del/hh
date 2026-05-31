"use client";

import { create } from "zustand";
import type { Message } from "@/types";
import { loadTodayMessages } from "@/lib/mock-messages";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  isCrisisAlertVisible: boolean;
}

interface ChatActions {
  loadMessages: (userId: string) => void;
  addMessage: (msg: Message) => void;
  setStreaming: (content: string) => void;
  clearStreaming: () => void;
  setLoading: (loading: boolean) => void;
  showCrisisAlert: () => void;
  hideCrisisAlert: () => void;
}

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  messages: [],
  isLoading: false,
  streamingContent: "",
  isCrisisAlertVisible: false,

  loadMessages: (userId) => {
    const msgs = loadTodayMessages(userId);
    set({ messages: msgs });
  },

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setStreaming: (content) => set({ streamingContent: content }),
  clearStreaming: () => set({ streamingContent: "" }),
  setLoading: (loading) => set({ isLoading: loading }),
  showCrisisAlert: () => set({ isCrisisAlertVisible: true }),
  hideCrisisAlert: () => set({ isCrisisAlertVisible: false }),
}));
