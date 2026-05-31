"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
  const router = useRouter();

  return (
    <main
      className="flex min-h-screen items-center justify-center"
      style={{ background: "var(--color-bg-base)" }}
    >
      <AuthForm mode="signup" onSuccess={() => router.push("/chat")} />
    </main>
  );
}
