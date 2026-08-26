import express from 'express';
import { analyzeMedicineImage } from '../services/geminiService.js';

const router = express.Router();

// ── POST /api/analyze ──────────────────────────────────────────────────────
/**
 * Accepts a base64-encoded image and returns structured medicine analysis.
 *
 * Request body:
 *   { "image": "data:image/jpeg;base64,/9j/4AAQ..." }  ← full data URI
 *   OR
 *   { "image": "/9j/4AAQ...", "mimeType": "image/jpeg" }  ← raw base64
 *
 * Response (200):
 *   { "success": true, "data": { ...MedicineAnalysis } }
 *
 * Response (4xx/5xx):
 *   { "success": false, "error": "message" }
 */
router.post('/analyze', async (req, res, next) => {
  try {
    const { image, mimeType: clientMime } = req.body;

    // ── Validate input ──────────────────────────────────────────────────
    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "image" field. Provide a base64 string or data URI.',
      });
    }

    // ── Parse data URI or raw base64 ───────────────────────────────────
    let base64Data = image;
    let mimeType   = clientMime || 'image/jpeg';

    if (image.startsWith('data:')) {
      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({
          success: false,
          error: 'Invalid data URI format. Expected data:<mimeType>;base64,<data>',
        });
      }
      mimeType   = matches[1];
      base64Data = matches[2];
    }

    // ── Validate MIME type ─────────────────────────────────────────────
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(mimeType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Unsupported image type: ${mimeType}. Allowed: ${allowedTypes.join(', ')}`,
      });
    }

    // ── Rough size check (~10MB decoded limit) ─────────────────────────
    const approximateBytes = (base64Data.length * 3) / 4;
    if (approximateBytes > 10 * 1024 * 1024) {
      return res.status(413).json({
        success: false,
        error: 'Image too large. Maximum allowed size is 10MB.',
      });
    }

    // ── Call Gemini ────────────────────────────────────────────────────
    console.log(`[/api/analyze] Processing image | type=${mimeType} | ~${(approximateBytes / 1024).toFixed(1)}KB`);
    const analysis = await analyzeMedicineImage(base64Data, mimeType);
    console.log(`[/api/analyze] Success | medicine=${analysis.englishName} | status=${analysis.expiryStatus}`);

    return res.status(200).json({ success: true, data: analysis });

  } catch (err) {
    if (err.message?.includes('API_KEY') || err.message?.includes('API key')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or missing Gemini API key. Check your .env file.',
      });
    }
    if (err.message?.includes('quota') || err.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Gemini API quota exceeded. Please try again later.',
      });
    }
    next(err);
  }
});

export default router;
