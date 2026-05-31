// Mock AI route — streams a pre-written Thai response, no API key needed.
// TODO: swap back to Claude when ANTHROPIC_API_KEY is available.

export const runtime = "edge";

const MOCK_RESPONSES = [
  "ได้ยินนะ ฟังดูหนักมากเลย ขอบคุณที่เล่าให้ฟัง\nวันนี้มีอะไรที่หนักเป็นพิเศษไหม?",
  "อยู่ตรงนี้ด้วยกันนะ ไม่ได้อยู่คนเดียว\nที่เล่ามา รู้สึกว่ามันสะสมมานานแล้วใช่ไหม?",
  "เข้าใจเลย มันเหนื่อยมากเวลาที่ต้องแบกทุกอย่างไว้คนเดียว\nแล้ววันนี้ยังพอมีแรงไหม?",
  "ฟังอยู่นะ ทุกคำที่เล่ามามันสำคัญมาก\nตอนนี้รู้สึกยังไงบ้าง?",
  "ไม่ต้องสู้คนเดียวนะ เราอยู่ตรงนี้\nสิ่งที่เล่ามา มันหนักมากจริงๆ อยากให้รู้ว่าความรู้สึกนี้มันสมเหตุสมผลมาก",
  "ได้ยินนะ และรู้สึกได้ว่ามันไม่ง่ายเลยสักนิด\nมีใครรอบข้างรู้บ้างไหมว่าคุณรู้สึกแบบนี้?",
  "ขอบคุณที่ไว้วางใจเล่าให้ฟังนะ\nที่บอกมานั้น ฟังดูเหมือนมันกดดันมาสักพักแล้ว ใช่ไหม?",
  "อยู่ด้วยกันนะตอนนี้\nสิ่งที่รู้สึกอยู่นี้ ไม่มีถูกไม่มีผิด มันคือความรู้สึกของคุณ",
];

function pickResponse(userMessage: string): string {
  // Very naive context-awareness: longer messages get empathetic openers
  const idx = Math.floor(Math.random() * MOCK_RESPONSES.length);
  return MOCK_RESPONSES[idx];
}

// Returns a ReadableStream that drip-feeds the response character by character,
// formatted as Vercel AI SDK data-stream protocol (text parts).
function mockStream(text: string): ReadableStream {
  const encoder = new TextEncoder();
  const chars = Array.from(text); // unicode-safe split
  let i = 0;

  return new ReadableStream({
    async pull(controller) {
      if (i >= chars.length) {
        controller.close();
        return;
      }
      // Emit a small chunk (1-3 chars) at a time
      const chunkSize = Math.min(Math.ceil(Math.random() * 3), chars.length - i);
      const chunk = chars.slice(i, i + chunkSize).join("");
      i += chunkSize;

      // Vercel AI SDK data-stream text part format: `0:"<text>"\n`
      const escaped = JSON.stringify(chunk);
      controller.enqueue(encoder.encode(`0:${escaped}\n`));

      // ~30ms per chunk → realistic typing speed
      await new Promise((r) => setTimeout(r, 30 + Math.random() * 40));
    },
  });
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === "user");
  const responseText = pickResponse(lastUserMsg?.content ?? "");

  const stream = mockStream(responseText);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "x-vercel-ai-data-stream": "v1",
      "Transfer-Encoding": "chunked",
    },
  });
}
