/**
 * Chikitsak API client
 * Handles communication with /api/analyze endpoint with safe error parsing.
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Converts a File object to a base64 data URI string.
 * @param {File} file
 * @returns {Promise<string>} data URI string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file from device.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Sends a base64 image to the backend and returns structured medicine analysis.
 * Safely parses response to prevent "Unexpected token 'T'" JSON syntax crashes.
 * @param {string} base64DataUri - Full data URI string
 * @returns {Promise<Object>} Medicine analysis object
 */
export async function analyzeImage(base64DataUri) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 35_000); // 35s timeout

  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify({ image: base64DataUri }),
      signal:  controller.signal,
    });

    // Read response text first to safely inspect before parsing JSON
    const responseText = await response.text();

    let json = null;
    try {
      json = JSON.parse(responseText);
    } catch {
      // Failed to parse JSON (server likely returned HTML error page or standard 404/500 text)
      console.error('[API Client] Non-JSON server response:', responseText.slice(0, 200));
      if (response.status === 404) {
        throw new Error('API server route not found. Make sure backend server is running on port 3001.');
      }
      throw new Error(`Server returned status ${response.status} (${response.statusText}). Please check your backend connection.`);
    }

    if (!response.ok || !json.success) {
      const msg = json?.error || `Server analysis error (${response.status})`;
      throw new Error(msg);
    }

    if (!json.data) {
      throw new Error('Invalid analysis format received from server.');
    }

    return json.data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Analysis timed out (35s). Please check your internet connection or try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
