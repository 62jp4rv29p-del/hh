"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

const MAX_CHARS = 2000;

export default function MessageInput({
  onSend,
  disabled = false,
  placeholder = "พิมพ์ความรู้สึกของคุณที่นี่...",
  inputRef: externalRef,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const ref = externalRef ?? internalRef;

  // Auto-resize textarea
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [value, ref]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    const toSend =
      trimmed.length > MAX_CHARS ? trimmed.slice(0, MAX_CHARS) : trimmed;
    onSend(toSend);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasContent = value.trim().length > 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-center"
      style={{ zIndex: 20 }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: "480px",
          background: "var(--color-bg-base)",
          borderTop: "1px solid var(--color-border-subtle)",
          padding: "var(--space-4) var(--space-4) var(--space-6)",
        }}
      >
        <div className="flex items-end gap-3">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "กำลังฟัง..." : placeholder}
            rows={1}
            className="flex-1 font-thai resize-none"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-3) var(--space-4)",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "var(--color-text-primary)",
              minHeight: "52px",
              maxHeight: "120px",
              overflowY: "auto",
              outline: "none",
              transition: `border-color var(--duration-fast) var(--easing-default),
                           box-shadow var(--duration-fast) var(--easing-default)`,
              opacity: disabled ? 0.6 : 1,
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={disabled || !hasContent}
            aria-label="ส่งข้อความ"
            className="flex-shrink-0 flex items-center justify-center transition-opacity"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-full)",
              background: "var(--color-warm)",
              border: "none",
              cursor: disabled || !hasContent ? "not-allowed" : "pointer",
              opacity: disabled ? 0.3 : hasContent ? 1 : 0.4,
              pointerEvents: disabled ? "none" : "auto",
            }}
          >
            <Send size={16} color="#0D1521" />
          </button>
        </div>
      </div>
    </div>
  );
}
