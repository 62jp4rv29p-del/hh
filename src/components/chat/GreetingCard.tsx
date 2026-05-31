"use client";

import { useState } from "react";

interface GreetingCardProps {
  userName: string;
  onRespond: () => void;
  onDismiss: () => void;
}

export default function GreetingCard({
  userName,
  onRespond,
  onDismiss,
}: GreetingCardProps) {
  const [exiting, setExiting] = useState(false);

  function handleAction(cb: () => void) {
    setExiting(true);
    setTimeout(cb, 250);
  }

  return (
    // Full-screen overlay
    <div
      className="absolute inset-0 flex items-center justify-center z-10"
      style={{ background: "rgba(36, 51, 82, 0.85)" }}
    >
      {/* Card */}
      <div
        className={`${exiting ? "greeting-card-exit" : "greeting-card-enter"} flex flex-col gap-6`}
        style={{
          width: "calc(100% - 48px)",
          maxWidth: "400px",
          background: "var(--color-warm-subtle)",
          border: "1px solid rgba(201, 123, 46, 0.3)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-10) var(--space-8)",
        }}
      >
        {/* Greeting text */}
        <p
          className="font-thai font-medium"
          style={{
            fontSize: "20px",
            lineHeight: 1.7,
            color: "var(--color-warm-text)",
          }}
        >
          {userName}，ไหวไหมวันนี้
          <br />
          บอกเล่าให้ฟังนะ
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={() => handleAction(onRespond)}
            className="w-full font-thai font-medium transition-opacity hover:opacity-85 active:opacity-75"
            style={{
              background: "var(--color-warm)",
              color: "#0D1521",
              borderRadius: "var(--radius-md)",
              padding: "12px 24px",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
            }}
          >
            บอกเล่าให้ฟังนะ
          </button>

          <button
            onClick={() => handleAction(onDismiss)}
            className="font-thai transition-colors"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-secondary)",
              fontSize: "16px",
              padding: "var(--space-2)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.color =
                "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.color =
                "var(--color-text-secondary)";
            }}
          >
            ไม่เป็นไร
          </button>
        </div>
      </div>
    </div>
  );
}
