export interface TarotCard {
  id: string;
  nameTh: string;
  nameEn: string;
  symbol: string;       // single unicode symbol rendered on card face
  keywords: string[];   // Thai keywords
  message: string;      // Thai reading shown to user
}

export const TAROT_DECK: TarotCard[] = [
  {
    id: "fool",
    nameTh: "นักผจญภัย",
    nameEn: "The Fool",
    symbol: "☽",
    keywords: ["เริ่มต้นใหม่", "ความกล้า", "อิสรภาพ"],
    message:
      "วันนี้มีพลังงานของการเริ่มต้นใหม่อยู่รอบตัวคุณ บางทีสิ่งที่ดูเหมือนก้าวกระโดดที่น่ากลัว อาจเป็นแค่ก้าวแรกสู่บางอย่างที่ดีกว่า",
  },
  {
    id: "high_priestess",
    nameTh: "นักบวชหญิง",
    nameEn: "The High Priestess",
    symbol: "◈",
    keywords: ["สัญชาตญาณ", "ความลึกซึ้ง", "การรับฟังตัวเอง"],
    message:
      "ลองหยุดฟังเสียงข้างในตัวเองดูนะ บางคำตอบที่คุณกำลังมองหาอยู่ในตัวคุณเองแล้ว ไม่ต้องรีบ",
  },
  {
    id: "empress",
    nameTh: "จักรพรรดินี",
    nameEn: "The Empress",
    symbol: "✦",
    keywords: ["ความเอ็นดู", "การดูแลตัวเอง", "ความอุดมสมบูรณ์"],
    message:
      "วันนี้ลองดูแลตัวเองก่อนเป็นอันดับแรกนะ คุณให้กับคนอื่นมากพอแล้ว ถึงเวลาเติมพลังให้ตัวเองบ้าง",
  },
  {
    id: "strength",
    nameTh: "พลัง",
    nameEn: "Strength",
    symbol: "∞",
    keywords: ["ความอดทน", "ความกล้าหาญภายใน", "ความอ่อนโยน"],
    message:
      "ความแข็งแกร่งที่แท้จริงไม่ใช่การไม่เจ็บปวด แต่คือการเดินต่อแม้จะเจ็บ คุณมีพลังนั้นอยู่แล้ว",
  },
  {
    id: "hermit",
    nameTh: "ผู้สันโดษ",
    nameEn: "The Hermit",
    symbol: "⟡",
    keywords: ["การพักผ่อน", "การสะท้อนตัวเอง", "ความสงบ"],
    message:
      "บางทีการถอยออกมาจากทุกอย่างสักพักไม่ใช่การหนี แต่เป็นการเติมเต็มตัวเองเพื่อก้าวต่อไป",
  },
  {
    id: "star",
    nameTh: "ดาว",
    nameEn: "The Star",
    symbol: "★",
    keywords: ["ความหวัง", "การฟื้นฟู", "ความเชื่อมั่น"],
    message:
      "แม้ตอนนี้จะมืดแค่ไหน แต่ดาวยังอยู่ตรงนั้น ความหวังไม่ได้หายไปไหน มันแค่รอให้คุณมองเห็นมันอีกครั้ง",
  },
  {
    id: "moon",
    nameTh: "ดวงจันทร์",
    nameEn: "The Moon",
    symbol: "☾",
    keywords: ["ความไม่แน่นอน", "ความฝัน", "การยอมรับความรู้สึก"],
    message:
      "ความรู้สึกที่สับสนวุ่นวายอยู่ตอนนี้มันโอเคนะ ไม่ต้องเข้าใจทุกอย่างในทันที บางทีแค่ปล่อยให้มันไหลไปก็พอ",
  },
  {
    id: "sun",
    nameTh: "ดวงอาทิตย์",
    nameEn: "The Sun",
    symbol: "☀",
    keywords: ["ความสุข", "ความชัดเจน", "พลังงาน"],
    message:
      "มีบางอย่างสว่างขึ้นรอบตัวคุณในวันนี้ ลองมองหามันดูนะ อาจเป็นเรื่องเล็กๆ แต่มันมีความหมาย",
  },
  {
    id: "world",
    nameTh: "โลก",
    nameEn: "The World",
    symbol: "⊕",
    keywords: ["การสำเร็จ", "ความสมบูรณ์", "การเดินทาง"],
    message:
      "คุณมาไกลมากแล้วนะ แม้จะรู้สึกว่ายังไปไม่ถึงไหน แต่ลองมองย้อนกลับไปดู คุณผ่านอะไรมามากมายจริงๆ",
  },
  {
    id: "wheel",
    nameTh: "วงล้อแห่งโชคชะตา",
    nameEn: "Wheel of Fortune",
    symbol: "⊛",
    keywords: ["การเปลี่ยนแปลง", "โอกาส", "วัฏจักร"],
    message:
      "ทุกอย่างกำลังเปลี่ยนแปลง ทั้งสิ่งที่ดีและไม่ดีล้วนไม่ถาวร วันนี้ลองปล่อยวางสิ่งที่ควบคุมไม่ได้ดูนะ",
  },
];

export function drawRandomCard(): TarotCard {
  return TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
}

export function drawThreeCards(): [TarotCard, TarotCard, TarotCard] {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1], shuffled[2]];
}
