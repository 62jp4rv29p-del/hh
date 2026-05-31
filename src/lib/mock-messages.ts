// Mock message persistence using localStorage.
// TODO: replace with Supabase messages table when keys are available.

import type { Message } from "@/types";

function getTodayKey(userId: string): string {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  });
  return `waimai_messages_${userId}_${today}`;
}

export function loadTodayMessages(userId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getTodayKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Message[];
    return parsed.map((m) => ({ ...m, createdAt: new Date(m.createdAt) }));
  } catch {
    return [];
  }
}

export function saveTodayMessages(userId: string, messages: Message[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getTodayKey(userId), JSON.stringify(messages));
}

export function appendMessage(userId: string, msg: Message): void {
  const existing = loadTodayMessages(userId);
  saveTodayMessages(userId, [...existing, msg]);
}

export function getTodayGreetingKey(): string {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  });
  return `waimai_greeting_read_${today}`;
}

export function getCrisisShownKey(): string {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  });
  return `waimai_crisis_shown_${today}`;
}
