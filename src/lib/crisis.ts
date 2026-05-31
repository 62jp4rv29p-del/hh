const CRISIS_KEYWORDS_TH = [
  "ไม่อยากอยู่",
  "อยากหายไป",
  "หายไปจากโลก",
  "ทำร้ายตัวเอง",
  "ฆ่าตัวตาย",
  "พอแล้วกับชีวิต",
  "ไม่อยากมีชีวิต",
  "จบชีวิต",
];

export function detectCrisis(text: string): boolean {
  try {
    return CRISIS_KEYWORDS_TH.some((keyword) => text.includes(keyword));
  } catch {
    return false;
  }
}
