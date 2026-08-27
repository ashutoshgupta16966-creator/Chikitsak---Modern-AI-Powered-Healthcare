import { AlertCircle, RefreshCw, X, Wifi, Clock, AlertTriangle } from 'lucide-react'
import { categorizeError } from '../utils/errorUtils'

/**
 * ErrorBanner – Dismissible bilingual error notification with categorized
 * title, Hindi+English detail, and a Retry action button.
 */
export default function ErrorBanner({ message, onDismiss, onRetry }) {
  const { title, detail, color } = categorizeError(message)

  // Split the detail on newline: first line is English, second is Hindi
  const [englishDetail, hindiDetail] = detail.split('\n')

  const colorMap = {
    red:    { bg: 'bg-red-600',    border: 'border-red-400',    icon: 'text-red-100',    badge: 'bg-red-700',    text: 'text-red-50' },
    amber:  { bg: 'bg-amber-600',  border: 'border-amber-400',  icon: 'text-amber-100',  badge: 'bg-amber-700',  text: 'text-amber-50' },
    orange: { bg: 'bg-orange-600', border: 'border-orange-400', icon: 'text-orange-100', badge: 'bg-orange-700', text: 'text-orange-50' },
  }
  const c = colorMap[color] || colorMap.red

  const IconComponent =
    color === 'amber'  ? Clock :
    color === 'orange' ? AlertTriangle :
    message && String(message).toLowerCase().includes('network') ? Wifi :
    AlertCircle

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`mx-3 mt-2 mb-0 rounded-2xl ${c.bg} ${c.border} border shadow-xl relative z-30 overflow-hidden`}
    >
      {/* Top stripe — title row */}
      <div className={`flex items-center justify-between gap-2 px-3.5 pt-3 pb-2 ${c.badge} border-b ${c.border}`}>
        <div className="flex items-center gap-2">
          <IconComponent size={16} className={`${c.icon} shrink-0`} />
          <span className={`font-extrabold text-sm tracking-tight ${c.text}`}>{title}</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-white/70 hover:text-white active:scale-90 transition-all shrink-0 p-0.5 rounded"
          aria-label="Dismiss error"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Detail body */}
      <div className="px-3.5 pt-2.5 pb-3 space-y-1">
        {/* English detail */}
        <p className={`text-xs font-semibold leading-snug ${c.text}`}>
          {englishDetail}
        </p>
        {/* Hindi detail */}
        {hindiDetail && (
          <p className={`font-devanagari text-xs font-bold leading-snug ${c.text} opacity-90`}>
            {hindiDetail}
          </p>
        )}

        {/* Retry button (shown only if onRetry is provided) */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm w-full justify-center"
          >
            <RefreshCw size={13} strokeWidth={2.5} />
            <span>Retry / दोबारा प्रयास करें</span>
          </button>
        )}
      </div>
    </div>
  )
}
