import { GoogleGenAI } from '@google/genai';

// ── Singleton Gemini client ────────────────────────────────────────────────
let _client = null;
function getAIClient() {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing in environment variables');
    }
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

// ── System Prompt ──────────────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0];

const SYSTEM_PROMPT = `
You are Chikitsak, an expert Indian medical AI assistant.
Your task is to analyze an image of a medicine strip, medicine box, or lab report.

STRICT RULES:
1. You MUST respond with ONLY valid JSON — no markdown, no explanation, no extra text.
2. If the image is NOT a medicine or medical document, set englishName to "Unknown Item", hindiName to "अज्ञात वस्तु", and set appropriate details.
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

/**
 * Analyzes a medicine image using Google GenAI SDK (v2.x).
 * Features automatic fallback model retry logic for high availability.
 * @param {string} base64Image - Pure base64 string
 * @param {string} mimeType    - MIME type (e.g. 'image/jpeg')
 * @returns {Promise<Object>}  - Parsed medicine JSON analysis
 */
export async function analyzeMedicineImage(base64Image, mimeType) {
  const ai = getAIClient();

  const primaryModel  = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const fallbackModel = 'gemini-3.5-flash-lite';

  const contents = [
    SYSTEM_PROMPT,
    {
      inlineData: {
        data: base64Image,
        mimeType: mimeType || 'image/jpeg',
      },
    },
  ];

  let rawText = null;

  // ── Primary Model Attempt ────────────────────────────────────────────────
  try {
    console.log(`[GeminiService] Requesting primary model: ${primaryModel}`);
    const response = await ai.models.generateContent({
      model: primaryModel,
      contents,
    });
    rawText = typeof response.text === 'function' ? response.text() : response.text;
  } catch (primaryErr) {
    const pMsg = primaryErr?.message || String(primaryErr);
    console.warn(`[GeminiService] Primary model (${primaryModel}) failed: ${pMsg}`);

    // If primary model failed and isn't already the fallback, try fallback model
    if (primaryModel !== fallbackModel) {
      console.log(`[GeminiService] Retrying with fallback model: ${fallbackModel}`);
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: fallbackModel,
          contents,
        });
        rawText = typeof fallbackResponse.text === 'function'
          ? fallbackResponse.text()
          : fallbackResponse.text;
      } catch (fallbackErr) {
        const fMsg = fallbackErr?.message || String(fallbackErr);
        throw new Error(`AI Analysis failed: ${fMsg || pMsg}`);
      }
    } else {
      throw new Error(`AI Analysis failed: ${pMsg}`);
    }
  }

  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Gemini API returned an empty or invalid text response.');
  }

  // Strip markdown code fences if Gemini wraps output in ```json ... ```
  const jsonText = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`Failed to parse AI response as JSON: ${rawText.slice(0, 200)}`);
  }

  // Validate required fields
  const required = ['englishName', 'hindiName', 'expiryDate', 'daysLeft', 'expiryStatus', 'bimari', 'solution'];
  for (const field of required) {
    if (!(field in parsed)) {
      throw new Error(`Missing required field (${field}) in AI response.`);
    }
  }

  // Ensure default fallback values for optional arrays/fields
  if (!Array.isArray(parsed.warnings)) {
    parsed.warnings = ["डॉक्टर की सलाह अनुसार लें", "बच्चों की पहुँच से दूर रखें"];
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

  // Coerce & sanitize types
  parsed.daysLeft     = Number(parsed.daysLeft);
  parsed.expiryStatus = String(parsed.expiryStatus).toUpperCase();
  if (!['RED', 'YELLOW', 'GREEN'].includes(parsed.expiryStatus)) {
    if (parsed.daysLeft <= 7)       parsed.expiryStatus = 'RED';
    else if (parsed.daysLeft <= 15) parsed.expiryStatus = 'YELLOW';
    else                            parsed.expiryStatus = 'GREEN';
  }

  return parsed;
}
