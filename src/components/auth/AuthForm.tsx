"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMockUser, setMockUser, createGuestUser } from "@/lib/mock-auth";

interface AuthFormProps {
  mode: "login" | "signup";
  onSuccess: () => void;
}

export default function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    if (mode === "signup" && !nickname.trim()) {
      setError("กรุณากรอกชื่อเล่นของคุณ");
      return;
    }

    setLoading(true);
    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 600));

    // TODO: replace with Supabase Auth when keys are available
    const user = createMockUser(
      email,
      mode === "signup" ? nickname.trim() : email.split("@")[0]
    );
    setMockUser(user);
    setLoading(false);
    onSuccess();
  }

  return (
    <div
      className="w-full max-w-[360px] mx-auto px-4"
      style={{ padding: "var(--space-8)" }}
    >
      {/* Product name */}
      <div className="mb-8 text-center">
        <h1
          className="font-thai font-semibold"
          style={{
            fontSize: "24px",
            lineHeight: 1.5,
            color: "var(--color-warm-text)",
          }}
        >
          ไหวไหม
        </h1>
        <p
          className="font-thai mt-1"
          style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}
        >
          มีเราอยู่ตรงนี้ด้วยกันนะ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "signup" && (
          <div>
            <label
              className="block font-thai mb-1"
              style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}
            >
              ชื่อเล่น
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="ชื่อที่คุณอยากให้เราเรียก"
              className="w-full font-thai rounded-[var(--radius-sm)] px-4 py-3"
              style={{
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                fontSize: "18px",
                lineHeight: 1.8,
                outline: "none",
              }}
              disabled={loading}
            />
          </div>
        )}

        <div>
          <label
            className="block font-thai mb-1"
            style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}
          >
            อีเมล
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full font-thai rounded-[var(--radius-sm)] px-4 py-3"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontSize: "18px",
              lineHeight: 1.8,
              outline: "none",
            }}
            disabled={loading}
            autoComplete="email"
          />
        </div>

        <div>
          <label
            className="block font-thai mb-1"
            style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}
          >
            รหัสผ่าน
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full font-thai rounded-[var(--radius-sm)] px-4 py-3"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontSize: "18px",
              lineHeight: 1.8,
              outline: "none",
            }}
            disabled={loading}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && (
          <p
            className="font-thai"
            style={{ fontSize: "14px", color: "var(--color-error-text)" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-thai font-medium rounded-[var(--radius-md)] transition-opacity"
          style={{
            background: "var(--color-warm)",
            color: "#0D1521",
            height: "var(--space-12)",
            fontSize: "16px",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
            border: "none",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="31.4"
                  strokeDashoffset="10"
                />
              </svg>
            </span>
          ) : mode === "login" ? (
            "เข้าสู่ระบบ"
          ) : (
            "สมัครสมาชิก"
          )}
        </button>
      </form>

      {/* Guest entry */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => { createGuestUser(); router.push("/chat"); }}
          className="font-thai transition-colors"
          style={{
            background: "transparent",
            border: "none",
            fontSize: "14px",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            padding: "var(--space-2) 0",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.color = "var(--color-text-secondary)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.color = "var(--color-text-muted)";
          }}
        >
          ลองใช้แบบไม่สมัครก่อน →
        </button>
      </div>

      <p
        className="font-thai text-center mt-2"
        style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}
      >
        {mode === "login" ? (
          <>
            ยังไม่มีบัญชี?{" "}
            <a
              href="/signup"
              className="transition-colors hover:text-[var(--color-text-primary)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              สมัครสมาชิก
            </a>
          </>
        ) : (
          <>
            มีบัญชีแล้ว?{" "}
            <a
              href="/login"
              className="transition-colors hover:text-[var(--color-text-primary)]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              เข้าสู่ระบบ
            </a>
          </>
        )}
      </p>
    </div>
  );
}
