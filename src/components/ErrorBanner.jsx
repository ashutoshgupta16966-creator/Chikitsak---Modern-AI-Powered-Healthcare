import { AlertCircle, X } from 'lucide-react'

/**
 * ErrorBanner – Dismissible glassmorphism error notification banner.
 * Defensively extracts text to prevent rendering "[object Object]".
 */
export default function ErrorBanner({ message, onDismiss }) {
  let displayMessage = 'An error occurred. Please try again.';

  if (typeof message === 'string' && message.trim().length > 0) {
    displayMessage = message;
  } else if (message && typeof message === 'object') {
    displayMessage = message.error || message.message || JSON.stringify(message);
  }

  return (
    <div
      role="alert"
      className="mx-3 mt-2 mb-0 flex items-start gap-2.5 bg-red-600/90 border border-red-400 text-white rounded-xl p-3 shrink-0 animate-bounce-in shadow-lg relative z-30 font-sans"
    >
      <AlertCircle size={18} className="text-white shrink-0 mt-0.5" />
      <p className="text-xs leading-snug flex-1 font-bold font-devanagari">
        {displayMessage}
      </p>
      <button
        onClick={onDismiss}
        className="text-white/80 hover:text-white active:scale-90 transition-all shrink-0 p-0.5"
        aria-label="Dismiss error"
      >
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  )
}
