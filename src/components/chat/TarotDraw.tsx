"use client";

import { useState } from "react";
import { drawThreeCards, type TarotCard } from "@/lib/tarot";

interface TarotDrawProps {
  onClose: () => void;
  onResult: (card: TarotCard) => void;
}

export default function TarotDraw({ onClose, onResult }: TarotDrawProps) {
  const [cards] = useState(() => drawThreeCards());
  const [flipped, setFlipped] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  function handlePick(idx: number) {
    if (flipped !== null) return;
    setFlipped(idx);
    setTimeout(() => {
      setDone(true);
    }, 800);
  }

  function handleConfirm() {
    if (flipped === null) return;
    onResult(cards[flipped]);
    onClose();
  }

  return (
    // Full-screen overlay
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-30"
      style={{ background: "rgba(13, 21, 33, 0.92)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && flipped === null) onClose();
      }}
    >
      <div className="flex flex-col items-center gap-8 px-6 w-full max-w-[480px]">
        {/* Title */}
        <div className="text-center">
          <p
            className="font-thai font-medium"
            style={{ fontSize: "20px", color: "var(--color-warm-text)", lineHeight: 1.6 }}
          >
            {flipped === null ? "เลือกไพ่หนึ่งใบ" : cards[flipped].nameTh}
          </p>
          <p
            className="font-thai mt-1"
            style={{ fontSize: "14px", color: "var(--color-text-muted)" }}
          >
            {flipped === null
              ? "ตั้งใจกับสิ่งที่อยากรู้ แล้วเลือกไพ่ที่รู้สึกว่าใช่"
              : cards[flipped].keywords.join(" · ")}
          </p>
        </div>

        {/* Cards row */}
        <div className="flex gap-4 justify-center">
          {cards.map((card, idx) => {
            const isFlipped = flipped === idx;
            const isOther = flipped !== null && flipped !== idx;

            return (
              <button
                key={card.id}
                onClick={() => handlePick(idx)}
                disabled={flipped !== null}
                style={{
                  width: "96px",
                  height: "152px",
                  borderRadius: "var(--radius-lg)",
                  border: isFlipped
                    ? "1px solid rgba(201, 123, 46, 0.6)"
                    : "1px solid var(--color-border)",
                  background: isFlipped
                    ? "var(--color-warm-subtle)"
                    : "var(--color-bg-elevated)",
                  cursor: flipped === null ? "pointer" : "default",
                  opacity: isOther ? 0.3 : 1,
                  transition: "all 0.4s ease",
                  transform: isFlipped ? "scale(1.06)" : "scale(1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Card back pattern */}
                {!isFlipped && (
                  <>
                    {/* Subtle geometric pattern */}
                    <div style={{
                      position: "absolute", inset: "8px",
                      border: "1px solid var(--color-border-subtle)",
                      borderRadius: "8px",
                    }} />
                    <div style={{
                      width: "32px", height: "32px",
                      border: "1px solid var(--color-border)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ color: "var(--color-text-muted)", fontSize: "16px" }}>✦</span>
                    </div>
                    <p style={{ fontSize: "10px", color: "var(--color-text-muted)", fontFamily: "var(--font-noto-thai)" }}>
                      ไหวไหม
                    </p>
                  </>
                )}

                {/* Card face */}
                {isFlipped && (
                  <>
                    <span style={{
                      fontSize: "32px",
                      color: "var(--color-warm-text)",
                      lineHeight: 1,
                    }}>
                      {card.symbol}
                    </span>
                    <p
                      className="font-thai text-center"
                      style={{
                        fontSize: "11px",
                        color: "var(--color-warm-text)",
                        lineHeight: 1.4,
                      }}
                    >
                      {card.nameTh}
                    </p>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Reading text */}
        {done && flipped !== null && (
          <div
            className="font-thai crisis-alert-enter"
            style={{
              background: "var(--color-warm-subtle)",
              border: "1px solid rgba(201,123,46,0.25)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4) var(--space-5)",
              fontSize: "16px",
              lineHeight: 1.8,
              color: "var(--color-warm-text)",
              width: "100%",
              textAlign: "center",
            }}
          >
            {cards[flipped].message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          {done ? (
            <button
              onClick={handleConfirm}
              className="flex-1 font-thai font-medium transition-opacity hover:opacity-85"
              style={{
                background: "var(--color-warm)",
                color: "#0D1521",
                borderRadius: "var(--radius-md)",
                padding: "12px",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
              }}
            >
              บันทึกลงในบทสนทนา
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="font-thai transition-colors"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "14px",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              padding: "12px",
              flex: done ? "0 0 auto" : "1",
            }}
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
