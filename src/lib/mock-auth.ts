// Mock auth for MVP without Supabase keys.
// TODO: replace with real Supabase Auth when keys are available.

const STORAGE_KEY = "waimai_mock_user";

export interface MockUser {
  id: string;
  nickname: string;
  email: string;
}

export function getMockUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setMockUser(user: MockUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearMockUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function createMockUser(email: string, nickname: string): MockUser {
  return {
    id: `mock-${Date.now()}`,
    nickname,
    email,
  };
}

export function createGuestUser(): MockUser {
  const user: MockUser = {
    id: `guest-${Date.now()}`,
    nickname: "คุณ",
    email: "",
  };
  setMockUser(user);
  return user;
}

export function isGuest(user: MockUser): boolean {
  return user.id.startsWith("guest-");
}
