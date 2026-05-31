"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMockUser, createGuestUser } from "@/lib/mock-auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getMockUser();
    if (!user) {
      // No session at all → create a guest session and go to chat
      createGuestUser();
    }
    router.replace("/chat");
  }, [router]);

  return null;
}
