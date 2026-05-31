"use client";

import { useEffect, useState } from "react";
import { getMockUser, createGuestUser } from "@/lib/mock-auth";
import { useUserStore } from "@/stores/userStore";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatPage() {
  const { setUser } = useUserStore();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let user = getMockUser();
    if (!user) {
      // Landed directly on /chat without going through / — still give a guest session
      user = createGuestUser();
    }
    setUser(user.id, user.nickname);
    setUserId(user.id);
  }, [setUser]);

  if (!userId) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "var(--color-bg-base)" }}
      >
        <div className="w-full max-w-[480px] px-4 flex flex-col gap-4 pt-10">
          {[80, 60, 70].map((w, i) => (
            <div
              key={i}
              className={`skeleton ${i % 2 === 0 ? "self-start" : "self-end"}`}
              style={{ width: `${w}%`, height: "52px" }}
            />
          ))}
        </div>
      </div>
    );
  }

  return <ChatWindow userId={userId} />;
}
