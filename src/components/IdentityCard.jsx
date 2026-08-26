/**
 * IdentityCard – MIDDLE CARD (30% viewport)
 *
 * Displays:
 *  • English name + Hindi name (dual language)
 *  • Dynamic expiry badge (RED / YELLOW / GREEN) with days-left countdown
 *  • Skeleton loaders while fetching
 */

const STATUS_CONFIG = {
  RED: {
    bg:      'bg-red-50',
    border:  'border-red-200',
    badge:   'bg-red-500 badge-red',
    icon:    '🔴',
    label:   'Turant Badlein',
    labelHi: 'तुरंत बदलें',
    textColor: 'text-red-600',
  },
  YELLOW: {
    bg:      'bg-amber-50',
    border:  'border-amber-200',
    badge:   'bg-amber-400 badge-yellow',
    icon:    '🟡',
    label:   'Dhyan Dein',
    labelHi: 'ध्यान दें',
    textColor: 'text-amber-600',
  },
  GREEN: {
    bg:      'bg-emerald-50',
    border:  'border-emerald-200',
    badge:   'bg-emerald-500 badge-green',
    icon:    '🟢',
    label:   'Safe to Use',
    labelHi: 'सुरक्षित',
    textColor: 'text-emerald-600',
  },
}

export default function IdentityCard({ analysis, isLoading, isIdle }) {
  // ── Skeleton while loading ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-full rounded-2xl bg-white shadow-md border border-emerald-100 p-3 flex flex-col gap-2 justify-center">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2 mt-1" />
        <div className="skeleton h-8 w-full mt-2 rounded-xl" />
      </div>
    )
  }

  // ── Idle / empty state ────────────────────────────────────────────────
  if (isIdle || !analysis) {
    return (
      <div className="h-full rounded-2xl bg-white shadow-md border border-dashed border-emerald-200
                      flex flex-col items-center justify-center gap-1 p-3">
        <span className="text-3xl opacity-30">💊</span>
        <p className="text-gray-400 text-xs text-center font-medium">
          दवाई की जानकारी यहाँ दिखेगी
        </p>
        <p className="text-gray-300 text-[10px] text-center">
          Identity &amp; Expiry Status
        </p>
      </div>
    )
  }

  // ── Result state ──────────────────────────────────────────────────────
  const status  = STATUS_CONFIG[analysis.expiryStatus] || STATUS_CONFIG.GREEN
  const expired = analysis.daysLeft < 0

  const daysLabel = expired
    ? `${Math.abs(analysis.daysLeft)} दिन पहले खत्म`
    : analysis.daysLeft === 9999
      ? 'तारीख नहीं मिली'
      : `${analysis.daysLeft} दिन बाकी`

  const expiryDisplay = analysis.expiryDate
    ? new Date(analysis.expiryDate + 'T00:00:00').toLocaleDateString('hi-IN', {
        day:   '2-digit',
        month: 'short',
        year:  'numeric',
      })
    : 'N/A'

  return (
    <div
      className={`h-full rounded-2xl shadow-md border ${status.border} ${status.bg}
                  p-3 flex flex-col justify-between animate-bounce-in overflow-hidden`}
    >
      {/* ── Name block ─────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0">
        <h2 className="text-gray-800 font-bold text-sm leading-tight line-clamp-1">
          {analysis.englishName}
        </h2>
        <p className="font-devanagari text-gray-500 text-xs leading-tight mt-0.5 line-clamp-1">
          {analysis.hindiName}
        </p>
      </div>

      {/* ── Expiry badge strip ─────────────────────────────────────── */}
      <div className={`rounded-xl ${status.badge} px-3 py-2 flex items-center justify-between mt-1`}>

        {/* Status icon + labels */}
        <div className="flex items-center gap-1.5">
          <span className="text-base" role="img" aria-label={analysis.expiryStatus}>
            {status.icon}
          </span>
          <div>
            <p className="text-white font-bold text-xs leading-none">{status.labelHi}</p>
            <p className="text-white/80 text-[10px] leading-none mt-0.5">{status.label}</p>
          </div>
        </div>

        {/* Days countdown */}
        <div className="text-right">
          <p className="font-devanagari text-white font-bold text-xs leading-none">{daysLabel}</p>
          <p className="text-white/80 text-[10px] mt-0.5 leading-none">
            {expired ? '⚠️ Expired' : `Exp: ${expiryDisplay}`}
          </p>
        </div>
      </div>
    </div>
  )
}
