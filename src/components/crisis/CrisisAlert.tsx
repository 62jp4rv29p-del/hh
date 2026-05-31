"use client";

interface CrisisAlertProps {
  onClose: () => void;
}

export default function CrisisAlert({ onClose }: CrisisAlertProps) {
  return (
    <div
      className="crisis-alert-enter font-thai"
      style={{
        background: "var(--color-crisis-bg)",
        border: "1px solid var(--color-crisis-border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4) var(--space-5)",
        maxWidth: "90%",
        margin: "var(--space-4) 0",
      }}
    >
      <p
        className="font-medium"
        style={{ fontSize: "18px", color: "var(--color-crisis-text)" }}
      >
        ยังอยู่ตรงนี้ด้วยกันนะ
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "var(--color-crisis-text)",
          opacity: 0.8,
          marginTop: "var(--space-2)",
          lineHeight: 1.7,
        }}
      >
        หากรู้สึกอยากทำร้ายตัวเอง มีคนพร้อมรับฟังตลอด 24 ชม.{" "}
        โทร{" "}
        <a
          href="tel:1323"
          className="font-semibold"
          style={{ color: "var(--color-warm-text)", textDecoration: "none" }}
        >
          1323
        </a>{" "}
        ได้เลย
      </p>

      <button
        onClick={onClose}
        className="mt-3 transition-colors"
        style={{
          background: "transparent",
          border: "none",
          fontSize: "12px",
          color: "var(--color-text-secondary)",
          cursor: "pointer",
          padding: 0,
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
        เข้าใจแล้ว
      </button>
    </div>
  );
}
