/**
 * Chikitsak Error Utilities
 * Safe error sanitization and user-friendly bilingual categorization.
 */

/**
 * Extracts a plain string message from any type of error value.
 * Prevents "[object Object]" from ever reaching the UI.
 * @param {*} err - Any thrown error, string, object, or undefined.
 * @returns {string} A safe, readable plain-text error message.
 */
export function formatErrorMessage(err) {
  if (!err) return 'An unknown error occurred. Please try again.';
  if (typeof err === 'string' && err.trim()) return err.trim();
  if (err instanceof Error && typeof err.message === 'string' && err.message.trim()) {
    return err.message.trim();
  }
  if (err && typeof err === 'object') {
    if (typeof err.message === 'string' && err.message.trim()) return err.message.trim();
    if (typeof err.error === 'string' && err.error.trim()) return err.error.trim();
    if (err.error && typeof err.error === 'object' && typeof err.error.message === 'string') {
      return err.error.message.trim();
    }
    try {
      const stringified = JSON.stringify(err);
      if (stringified && stringified !== '{}') return stringified;
    } catch {
      // fall through
    }
  }
  return 'Processing failed. Please check your image or internet connection.';
}

/**
 * Maps a raw error to a specific bilingual category for display.
 * @param {*} err  - Raw error (Error object, string, or HTTP response issue).
 * @returns {{ title: string, detail: string, color: string }}
 */
export function categorizeError(err) {
  const raw = formatErrorMessage(err).toLowerCase();

  // ── Timeout / Cold-Start / Gateway ──────────────────────────────────────
  if (
    raw.includes('timeout') ||
    raw.includes('timed out') ||
    raw.includes('504') ||
    raw.includes('cold') ||
    raw.includes('abort')
  ) {
    return {
      title: '⏳ Server Waking Up',
      detail:
        'Render server is starting up (cold-start). Please wait 5–10 seconds and try again.\n' +
        'सर्वर स्टार्ट हो रहा है। कृपया 5–10 सेकंड बाद पुनः प्रयास करें।',
      color: 'amber',
    };
  }

  // ── Quota / Rate Limit ───────────────────────────────────────────────────
  if (
    raw.includes('429') ||
    raw.includes('quota') ||
    raw.includes('rate limit') ||
    raw.includes('resource_exhausted') ||
    raw.includes('limit reached') ||
    raw.includes('limit समाप्त')
  ) {
    return {
      title: '🚦 AI Quota Limit',
      detail:
        'Daily AI scanning limit reached. Please try again after some time.\n' +
        'AI स्कैनिंग लिमिट समाप्त हो गई है। कुछ देर बाद पुनः प्रयास करें।',
      color: 'orange',
    };
  }

  // ── Network / Connection Error ───────────────────────────────────────────
  if (
    raw.includes('network') ||
    raw.includes('fetch') ||
    raw.includes('failed to fetch') ||
    raw.includes('internet') ||
    raw.includes('connection') ||
    raw.includes('offline') ||
    raw.includes('net::err')
  ) {
    return {
      title: '📶 No Internet Connection',
      detail:
        'Network connection lost. Please check your internet and try again.\n' +
        'इंटरनेट कनेक्शन टूट गया। कृपया कनेक्शन जांचें और पुनः प्रयास करें।',
      color: 'red',
    };
  }

  // ── API Key / Auth Error ─────────────────────────────────────────────────
  if (
    raw.includes('api key') ||
    raw.includes('api_key') ||
    raw.includes('401') ||
    raw.includes('unauthorized') ||
    raw.includes('invalid key') ||
    raw.includes('gemini_api_key')
  ) {
    return {
      title: '🔑 API Key Error',
      detail:
        'Gemini API Key is missing or invalid. Please configure GEMINI_API_KEY in your deployment.\n' +
        'API Key गलत या मिसिंग है। सर्वर कॉन्फ़िगरेशन जांचें।',
      color: 'red',
    };
  }

  // ── Image / AI Parse Error ───────────────────────────────────────────────
  if (
    raw.includes('image') ||
    raw.includes('parse') ||
    raw.includes('json') ||
    raw.includes('read') ||
    raw.includes('invalid') ||
    raw.includes('label') ||
    raw.includes('500') ||
    raw.includes('analyze')
  ) {
    return {
      title: '📷 Image Not Readable',
      detail:
        'Could not read the medicine label clearly. Please capture a sharper, well-lit image.\n' +
        'दवाई का लेबल स्पष्ट नहीं दिखा। कृपया तेज़ रोशनी में साफ़ फोटो लें।',
      color: 'red',
    };
  }

  // ── Generic Fallback ─────────────────────────────────────────────────────
  return {
    title: '❌ Analysis Failed',
    detail:
      'Something went wrong. Please try again with a clear medicine image.\n' +
      'कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।',
    color: 'red',
  };
}
