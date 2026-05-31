export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  conversationDate: string;
  isCrisisDetected: boolean;
  createdAt: Date;
}

export interface Profile {
  id: string;
  nickname: string;
  greetingEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
