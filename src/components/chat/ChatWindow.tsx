"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useChat } from "ai/react";
import { nanoid } from "nanoid";
import { detectCrisis } from "@/lib/crisis";
import { getCrisisShownKey, appendMessage } from "@/lib/mock-messages";
import { useChatStore } from "@/stores/chatStore";
import { useUserStore } from "@/stores/userStore";
import type { TarotCard } from "@/lib/tarot";
import GreetingCard from "./GreetingCard";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TarotDraw from "./TarotDraw";
import CrisisAlert from "@/components/crisis/CrisisAlert";

interface ChatWindowProps {
  userId: string;
}

export default function ChatWindow({ userId }: ChatWindowProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [tarotOpen, setTarotOpen] = useState(false);

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

  useEffect(() => {
    loadMessages(userId);
    initGreetingState();
  }, [userId, loadMessages, initGreetingState]);

  const showGreeting = !todayGreetingRead;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storedMessages]);

  const { messages: streamMessages, append, isLoading: aiLoading } = useChat({
    api: "/api/chat",
    body: { userName: nickname ?? "คุณ" },
    onFinish: (message) => {
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

  // When user confirms a tarot card, insert it as a system bubble + trigger AI response
  const handleTarotResult = useCallback(
    (card: TarotCard) => {
      const cardMsg = {
        id: nanoid(),
        role: "system" as const,
        content: `✦ ไพ่วันนี้: ${card.nameTh}\n${card.message}`,
        conversationDate: new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Bangkok",
        }),
        isCrisisDetected: false,
        createdAt: new Date(),
      };
      addMessage(cardMsg);
      appendMessage(userId, cardMsg);
    },
    [addMessage, userId]
  );

  const streamingContent =
    aiLoading && streamMessages.length > 0
      ? streamMessages[streamMessages.length - 1]?.role === "assistant"
        ? streamMessages[streamMessages.length - 1].content
        : null
      : null;

  const displayMessages = aiLoading
    ? storedMessages.filter((_, i) => {
        if (
          streamingContent &&
          i === storedMessages.length - 1 &&
          storedMessages[i].role === "assistant"
        )
          return false;
        return true;
      })
    : storedMessages;

  const emptyState = storedMessages.length === 0 && !showGreeting;

  return (
    <div
      className="flex flex-col h-screen max-w-[480px] mx-auto relative"
      style={{ background: "var(--color-bg-base)" }}
    >
      {/* Greeting card overlay */}
      {showGreeting && (
        <GreetingCard
          userName={nickname ?? "คุณ"}
          onRespond={() => { markGreetingRead(); setTimeout(() => inputRef.current?.focus(), 100); }}
          onDismiss={() => markGreetingRead()}
        />
      )}

      {/* Tarot overlay */}
      {tarotOpen && (
        <TarotDraw
          onClose={() => setTarotOpen(false)}
          onResult={handleTarotResult}
        />
      )}

      {/* Message list */}
      <div
        className="flex-1 overflow-y-auto px-4"
        style={{ paddingBottom: "110px", paddingTop: "var(--space-6)" }}
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
        onTarot={() => setTarotOpen(true)}
      />
    </div>
  );
}
