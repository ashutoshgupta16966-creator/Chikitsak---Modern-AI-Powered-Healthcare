import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Singleton Gemini client ────────────────────────────────────────────────
let _client = null;
function getClient() {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}

// ── System prompt ──────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0];

const SYSTEM_PROMPT = `
You are Chikitsak, an expert Indian medical AI assistant.
Your task is to analyze an image of a medicine strip, medicine box, or lab report.

STRICT RULES:
1. You MUST respond with ONLY valid JSON — no markdown, no explanation, no extra text.
2. If the image is NOT a medicine or medical document, set englishName to "Unknown Item", hindiName to "अज्ञात वस्तु", and set appropriate error/notice details.
3. Calculate daysLeft from today's date (${TODAY}) to the expiryDate.
4. Set expiryStatus based on daysLeft:
   - "RED"    → daysLeft <= 7 OR already expired (daysLeft < 0)
   - "YELLOW" → daysLeft >= 8 AND daysLeft <= 15
   - "GREEN"  → daysLeft > 15
5. hindiName, bimari, solution, and warnings MUST be in simple, everyday Hindi (Devanagari script).
6. bimariEn, solutionEn, and warningsEn MUST be in clear, simple English.
7. solution must include: dosage, timing (morning/afternoon/night), and any special instructions.
8. warnings / warningsEn should be 2 to 4 concise safety caution alerts (e.g. ["शराब से बचें", "खाना खाने के बाद लें"], ["Avoid alcohol", "Take after meals"]).
9. For expired medicines (daysLeft < 0), set daysLeft to a negative number.

REQUIRED JSON SCHEMA (return EXACTLY this structure, no extra fields):
{
  "englishName": "string — brand/generic name in English",
  "hindiName": "string — name in Hindi (Devanagari)",
  "expiryDate": "YYYY-MM-DD or null if not found",
  "daysLeft": number (negative if expired, 9999 if no date found),
  "expiryStatus": "RED" | "YELLOW" | "GREEN",
  "bimari": "string — illness/condition it treats, in simple Hindi",
  "bimariEn": "string — illness/condition in simple English",
  "solution": "string — dosage and usage instructions in simple Hindi",
  "solutionEn": "string — dosage and usage instructions in simple English",
  "warnings": ["array of short Hindi safety cautions"],
  "warningsEn": ["array of short English safety cautions"]
}
`.trim();

// ── Main analysis function ──────────────────────────────────────────────────
/**
 * Analyzes a medicine image using Gemini Vision and returns structured data.
 * @param {string} base64Image  - Pure base64 string (no data URI prefix)
 * @param {string} mimeType     - MIME type e.g. 'image/jpeg'
 * @returns {Promise<Object>}   - Parsed JSON result
 */
export async function analyzeMedicineImage(base64Image, mimeType) {
  const client = getClient();
  const model  = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent([
    SYSTEM_PROMPT,
    {
      inlineData: {
        data:     base64Image,
        mimeType: mimeType || 'image/jpeg',
      },
    },
  ]);

  const responseText = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps in ```json ... ```
  const jsonText = responseText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${responseText.slice(0, 300)}`);
  }

  // Validate required fields
  const required = ['englishName', 'hindiName', 'expiryDate', 'daysLeft', 'expiryStatus', 'bimari', 'solution'];
  for (const field of required) {
    if (!(field in parsed)) {
      throw new Error(`Missing required field in Gemini response: ${field}`);
    }
  }

  // Ensure default arrays if missing
  if (!Array.isArray(parsed.warnings)) {
    parsed.warnings = ["डॉक्टर की सलाह अनुसार लें", "बच्चो की पहुँच से दूर रखें"];
  }
  if (!Array.isArray(parsed.warningsEn)) {
    parsed.warningsEn = ["Take as advised by doctor", "Keep out of reach of children"];
  }
  if (!parsed.bimariEn) {
    parsed.bimariEn = parsed.bimari;
  }
  if (!parsed.solutionEn) {
    parsed.solutionEn = parsed.solution;
  }

  // Coerce types for safety
  parsed.daysLeft     = Number(parsed.daysLeft);
  parsed.expiryStatus = String(parsed.expiryStatus).toUpperCase();
  if (!['RED', 'YELLOW', 'GREEN'].includes(parsed.expiryStatus)) {
    if (parsed.daysLeft <= 7)       parsed.expiryStatus = 'RED';
    else if (parsed.daysLeft <= 15) parsed.expiryStatus = 'YELLOW';
    else                            parsed.expiryStatus = 'GREEN';
  }

  return parsed;
}
