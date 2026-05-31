"use client";

import { useEffect, useRef, useCallback } from "react";
import { useChat } from "ai/react";
import { nanoid } from "nanoid";
import { detectCrisis } from "@/lib/crisis";
import { getCrisisShownKey, appendMessage } from "@/lib/mock-messages";
import { useChatStore } from "@/stores/chatStore";
import { useUserStore } from "@/stores/userStore";
import GreetingCard from "./GreetingCard";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import CrisisAlert from "@/components/crisis/CrisisAlert";

interface ChatWindowProps {
  userId: string;
}

// Greeting message injected if user has no messages today
function buildGreetingMessage(nickname: string) {
  return `${nickname}，ไหวไหมวันนี้ บอกเล่าให้ฟังนะ`;
}

export default function ChatWindow({ userId }: ChatWindowProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    messages: storedMessages,
    loadMessages,
    addMessage,
    isLoading,
    setLoading,
    isCrisisAlertVisible,
    showCrisisAlert,
    hideCrisisAlert,
  } = useChatStore();

  const {
    nickname,
    todayGreetingRead,
    markGreetingRead,
    initGreetingState,
  } = useUserStore();

  // Load today's messages on mount
  useEffect(() => {
    loadMessages(userId);
    initGreetingState();
  }, [userId, loadMessages, initGreetingState]);

  // Show greeting card if no messages today (mock: treat empty messages as unread greeting)
  const showGreeting = !todayGreetingRead;

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storedMessages]);

  // Vercel AI SDK useChat
  const { messages: streamMessages, append, isLoading: aiLoading } = useChat({
    api: "/api/chat",
    body: { userName: nickname ?? "คุณ" },
    onFinish: (message) => {
      // Persist AI response
      const msg = {
        id: nanoid(),
        role: "assistant" as const,
        content: message.content,
        conversationDate: new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Bangkok",
        }),
        isCrisisDetected: false,
        createdAt: new Date(),
      };
      addMessage(msg);
      appendMessage(userId, msg);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const handleSend = useCallback(
    (content: string) => {
      if (!content.trim() || aiLoading) return;

      // Crisis detection (local, sync)
      const isCrisis = detectCrisis(content);
      if (isCrisis) {
        const alreadyShown =
          typeof window !== "undefined" &&
          localStorage.getItem(getCrisisShownKey()) === "true";
        if (!alreadyShown) {
          if (typeof window !== "undefined") {
            localStorage.setItem(getCrisisShownKey(), "true");
          }
          showCrisisAlert();
        }
      }

      // Persist user message
      const userMsg = {
        id: nanoid(),
        role: "user" as const,
        content,
        conversationDate: new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Bangkok",
        }),
        isCrisisDetected: isCrisis,
        createdAt: new Date(),
      };
      addMessage(userMsg);
      appendMessage(userId, userMsg);

      setLoading(true);
      append({ role: "user", content });
    },
    [aiLoading, append, addMessage, userId, showCrisisAlert, setLoading]
  );

  function handleGreetingRespond() {
    markGreetingRead();
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleGreetingDismiss() {
    markGreetingRead();
  }

  // Merge stored messages with any streaming AI content
  // streamMessages has the live stream; storedMessages has persisted history.
  // For display: show storedMessages + streaming bubble if AI is responding.
  const streamingContent =
    aiLoading && streamMessages.length > 0
      ? streamMessages[streamMessages.length - 1]?.role === "assistant"
        ? streamMessages[streamMessages.length - 1].content
        : null
      : null;

  // Build display list: storedMessages, but exclude the last AI message if we're streaming it
  // to avoid duplication when onFinish fires.
  const displayMessages = aiLoading
    ? storedMessages.filter((_, i) => {
        // While streaming, don't show the last stored assistant msg if we have a stream
        if (
          streamingContent &&
          i === storedMessages.length - 1 &&
          storedMessages[i].role === "assistant"
        )
          return false;
        return true;
      })
    : storedMessages;

  const emptyState =
    storedMessages.length === 0 && !showGreeting;

  return (
    <div
      className="flex flex-col h-screen max-w-[480px] mx-auto relative"
      style={{ background: "var(--color-bg-base)" }}
    >
      {/* Greeting card overlay */}
      {showGreeting && (
        <GreetingCard
          userName={nickname ?? "คุณ"}
          onRespond={handleGreetingRespond}
          onDismiss={handleGreetingDismiss}
        />
      )}

      {/* Message list */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4"
        style={{ paddingBottom: "100px", paddingTop: "var(--space-6)" }}
      >
        {emptyState && (
          <p
            className="font-thai text-center px-4"
            style={{
              fontSize: "16px",
              color: "var(--color-text-muted)",
              marginTop: "40vh",
              lineHeight: 1.8,
            }}
          >
            ยินดีต้อนรับนะ วันนี้จะมีเราคอยอยู่ตรงนี้ด้วย
            <br />
            ไว้คืนนี้คุยกันนะ
          </p>
        )}

        {displayMessages.map((msg, idx) => {
          const prev = displayMessages[idx - 1];
          const isFirst = !prev || prev.role !== msg.role;
          return (
            <MessageBubble
              key={msg.id}
              role={msg.role}
              content={msg.content}
              isFirst={isFirst}
            />
          );
        })}

        {/* Streaming bubble */}
        {aiLoading && streamingContent !== null && (
          <MessageBubble
            key="streaming"
            role="assistant"
            content={streamingContent}
            isStreaming
            isFirst={
              displayMessages.length === 0 ||
              displayMessages[displayMessages.length - 1].role !== "assistant"
            }
          />
        )}

        {/* CrisisAlert inline */}
        {isCrisisAlertVisible && (
          <div className="flex justify-start mt-2">
            <CrisisAlert onClose={hideCrisisAlert} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        disabled={aiLoading || isLoading}
        inputRef={inputRef}
      />
    </div>
  );
}
