import express from 'express';
import { analyzeMedicineImage } from '../services/geminiService.js';

const router = express.Router();

// ── POST /api/analyze ──────────────────────────────────────────────────────
router.post('/analyze', async (req, res) => {
  try {
    const { image, mimeType: clientMime } = req.body || {};

    // ── Validate input ──────────────────────────────────────────────────
    if (!image || typeof image !== 'string') {
      console.warn('[/api/analyze] Missing or invalid image payload');
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid image payload. Please select or capture a medicine photo.',
      });
    }

    // ── Parse data URI or raw base64 ───────────────────────────────────
    let base64Data = image;
    let mimeType   = clientMime || 'image/jpeg';

    if (image.startsWith('data:')) {
      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        console.warn('[/api/analyze] Invalid base64 format');
        return res.status(400).json({
          success: false,
          error: 'Invalid image format. Expected valid base64 data URI.',
        });
      }
      mimeType   = matches[1];
      base64Data = matches[2];
    }

    // ── Validate MIME type ─────────────────────────────────────────────
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(mimeType.toLowerCase())) {
      console.warn(`[/api/analyze] Unsupported MIME type: ${mimeType}`);
      return res.status(400).json({
        success: false,
        error: `Unsupported image format (${mimeType}). Please upload JPG, PNG, WEBP, or HEIC image.`,
      });
    }

    // ── Size check (~12MB decoded limit) ───────────────────────────────
    const approximateBytes = (base64Data.length * 3) / 4;
    if (approximateBytes > 12 * 1024 * 1024) {
      console.warn(`[/api/analyze] Image size exceeds 12MB limit: ${(approximateBytes / (1024 * 1024)).toFixed(2)}MB`);
      return res.status(413).json({
        success: false,
        error: 'Image size too large. Please upload an image under 10MB.',
      });
    }

    // ── Call Gemini API ────────────────────────────────────────────────
    console.log(`[/api/analyze] Analyzing image | type=${mimeType} | size=${(approximateBytes / 1024).toFixed(1)}KB`);
    const analysis = await analyzeMedicineImage(base64Data, mimeType);
    console.log(`[/api/analyze] Success | Medicine: ${analysis.englishName} | Status: ${analysis.expiryStatus}`);

    return res.status(200).json({ success: true, data: analysis });

  } catch (err) {
    console.error('[/api/analyze Error Details]:', {
      name: err?.name,
      message: err?.message,
      status: err?.status,
      stack: err?.stack,
      rawError: String(err),
    });

    let status = 500;
    let errorMessage = typeof err === 'string'
      ? err
      : (err?.message && typeof err.message === 'string' ? err.message : 'Failed to analyze medicine image. Please try again.');

    if (errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('API_KEY')) {
      status = 401;
      errorMessage = 'Gemini API Key is missing or invalid. Please configure GEMINI_API_KEY in server environment.';
    } else if (errorMessage.includes('quota') || err.status === 429) {
      status = 429;
      errorMessage = 'AI service quota limit reached. Please try again in a few moments.';
    }

    return res.status(status).json({
      success: false,
      error: String(errorMessage),
    });
  }
});

export default router;
