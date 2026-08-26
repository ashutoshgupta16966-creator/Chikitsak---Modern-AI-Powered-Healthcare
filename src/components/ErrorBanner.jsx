import { AlertCircle, X } from 'lucide-react'

/**
 * ErrorBanner – Dismissible glassmorphism error notification banner.
 */
export default function ErrorBanner({ message, onDismiss }) {
  return (
    <div
      role="alert"
      className="mx-2.5 mt-1.5 mb-0 flex items-start gap-2 bg-red-500/15 border border-red-400/40 backdrop-blur-md text-red-200 rounded-xl p-2.5 shrink-0 animate-bounce-in shadow-lg shadow-red-950/40 relative z-30"
    >
      <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
      <p className="text-xs leading-snug flex-1 font-medium font-devanagari">
        {message}
      </p>
      <button
        onClick={onDismiss}
        className="text-red-300 hover:text-white active:scale-90 transition-all shrink-0 p-0.5"
        aria-label="Dismiss error"
      >
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  )
}
