import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "@/styles/globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-noto-thai",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "ไหวไหม",
  description: "มีเราอยู่ตรงนี้ด้วยกันนะ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className="font-thai">{children}</body>
    </html>
  );
}
