"use client";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
  timestamp?: Date;
  isFirst?: boolean; // first in a consecutive run from same role
}

export default function MessageBubble({
  role,
  content,
  isStreaming = false,
  timestamp,
  isFirst = true,
}: MessageBubbleProps) {
  if (role === "system") {
    return (
      <div className="flex justify-center py-2">
        <p
          className="font-thai text-center"
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "var(--color-text-muted)",
          }}
        >
          {content}
        </p>
      </div>
    );
  }

  const isUser = role === "user";

  // Asymmetric border-radius per DESIGN.md §4.3
  const radiusSm = "8px";
  const radiusLg = "16px";
  const userRadius = `${radiusLg} ${radiusSm} ${radiusLg} ${radiusLg}`; // tl tr br bl
  const aiRadius   = `${radiusSm} ${radiusLg} ${radiusLg} ${radiusLg}`;

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} message-bubble-enter`}
      style={{ marginTop: isFirst ? "var(--space-4)" : "var(--space-2)" }}
    >
      <div
        className="font-thai"
        style={{
          maxWidth: "80%",
          background: isUser
            ? "var(--color-bubble-user)"
            : "var(--color-bubble-ai)",
          borderRadius: isUser ? userRadius : aiRadius,
          padding: "var(--space-3) var(--space-4)",
          fontSize: "18px",
          lineHeight: 1.8,
          color: "var(--color-text-primary)",
          wordBreak: "break-word",
        }}
      >
        <span>
          {content}
          {isStreaming && <span className="typing-cursor" />}
        </span>

        {timestamp && (
          <p
            className="font-thai"
            style={{
              fontSize: "14px",
              color: "var(--color-text-muted)",
              marginTop: "var(--space-1)",
              textAlign: isUser ? "right" : "left",
            }}
          >
            {timestamp.toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
