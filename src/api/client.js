/**
 * Chikitsak API client
 * Wraps the /api/analyze endpoint with robust error handling.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Converts a File object to a base64 data URI string.
 * @param {File} file
 * @returns {Promise<string>} data URI like "data:image/jpeg;base64,..."
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Sends a base64 image to the backend and returns the medicine analysis.
 * @param {string} base64DataUri - Full data URI string
 * @returns {Promise<import('./types').MedicineAnalysis>}
 */
export async function analyzeImage(base64DataUri) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 30_000); // 30s timeout

  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ image: base64DataUri }),
      signal:  controller.signal,
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      // Surface the server's error message if available
      const msg = json?.error || `Server error: ${response.status} ${response.statusText}`;
      throw new Error(msg);
    }

    return json.data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out (30s). Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
