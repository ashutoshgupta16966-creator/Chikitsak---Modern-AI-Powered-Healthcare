/**
 * ErrorBanner – dismissible error notification strip.
 */
export default function ErrorBanner({ message, onDismiss }) {
  return (
    <div
      role="alert"
      className="mx-3 mt-1 mb-0 flex items-start gap-2 bg-red-50 border border-red-200
                 rounded-xl px-3 py-2 shrink-0 animate-bounce-in"
    >
      {/* Icon */}
      <span className="text-red-500 text-base shrink-0 mt-0.5" aria-hidden>⚠️</span>

      {/* Message */}
      <p className="text-red-700 text-xs leading-snug flex-1">{message}</p>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 active:text-red-800
                   transition-colors shrink-0 mt-0.5"
        aria-label="Dismiss error"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
