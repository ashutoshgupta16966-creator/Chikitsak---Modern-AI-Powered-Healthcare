import { AlertTriangle, Clock, ShieldCheck, Share2, Pill } from 'lucide-react'

const STATUS_CONFIG = {
  RED: {
    bg:        'bg-red-500/10 border-red-300/80',
    badge:     'bg-gradient-to-r from-red-600 to-rose-600 badge-red text-white',
    icon:      <AlertTriangle className="w-4 h-4 text-white animate-bounce" />,
    label:     'Turant Badlein / Danger',
    labelHi:   'तुरंत बदलें (खराब/असुरक्षित)',
    textColor: 'text-red-700',
  },
  YELLOW: {
    bg:        'bg-amber-500/10 border-amber-300/80',
    badge:     'bg-gradient-to-r from-amber-500 to-yellow-500 badge-yellow text-amber-950',
    icon:      <Clock className="w-4 h-4 text-amber-950" />,
    label:     'Dhyan Dein / Use Soon',
    labelHi:   'ध्यान दें (जल्द इस्तेमाल करें)',
    textColor: 'text-amber-700',
  },
  GREEN: {
    bg:        'bg-emerald-500/10 border-emerald-300/80',
    badge:     'bg-gradient-to-r from-emerald-600 to-teal-600 badge-green text-white',
    icon:      <ShieldCheck className="w-4 h-4 text-white" />,
    label:     'Safe to Use',
    labelHi:   'सुरक्षित (इस्तेमाल योग्य)',
    textColor: 'text-emerald-700',
  },
}

export default function IdentityCard({ analysis, isLoading, isIdle, onShareWhatsApp }) {
  if (isLoading) {
    return (
      <div className="h-full rounded-2xl glass-panel p-3.5 flex flex-col justify-center gap-2 border border-emerald-200/60 shadow-xl">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2 mt-1" />
        <div className="skeleton h-10 w-full mt-2 rounded-xl" />
      </div>
    )
  }

  if (isIdle || !analysis) {
    return (
      <div className="h-full rounded-2xl glass-panel border border-dashed border-emerald-300/80 flex flex-col items-center justify-center gap-1.5 p-3.5 shadow-lg">
        <div className="w-10 h-10 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center">
          <Pill size={20} />
        </div>
        <p className="text-gray-600 font-bold text-xs text-center font-devanagari">
          दवाई का नाम व एक्सपायरी स्थिति
        </p>
        <p className="text-gray-400 text-[10px] text-center">
          Medicine identity &amp; color-coded expiry badge
        </p>
      </div>
    )
  }

  const status  = STATUS_CONFIG[analysis.expiryStatus] || STATUS_CONFIG.GREEN
  const expired = analysis.daysLeft < 0

  const daysLabel = expired
    ? `${Math.abs(analysis.daysLeft)} दिन पहले एक्सपायर!`
    : analysis.daysLeft === 9999
    ? 'एक्सपायरी तारीख अज्ञात'
    : `${analysis.daysLeft} दिन शेष`

  const expiryDisplay = analysis.expiryDate
    ? new Date(analysis.expiryDate + 'T00:00:00').toLocaleDateString('hi-IN', {
        day:   '2-digit',
        month: 'short',
        year:  'numeric',
      })
    : 'N/A'

  return (
    <div className={`h-full rounded-2xl glass-panel border ${status.bg} p-3.5 flex flex-col justify-between shadow-xl animate-bounce-in overflow-hidden relative`}>
      {/* Top Bar: Names & WhatsApp Share Button */}
      <div className="flex items-start justify-between gap-2 flex-1 min-h-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-gray-900 font-bold text-sm leading-tight truncate">
              {analysis.englishName}
            </h2>
          </div>
          <p className="font-devanagari text-emerald-800 font-semibold text-xs leading-tight mt-0.5 truncate">
            {analysis.hindiName}
          </p>
        </div>

        {/* 1-Click WhatsApp Share Button */}
        <button
          onClick={onShareWhatsApp}
          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-md shadow-emerald-600/30 transition-all shrink-0"
          title="Share via WhatsApp"
        >
          <Share2 size={12} />
          <span>शेयर करें</span>
        </button>
      </div>

      {/* Expiry Badge Strip */}
      <div className={`rounded-xl ${status.badge} px-3.5 py-2.5 flex items-center justify-between mt-2 shadow-md`}>
        <div className="flex items-center gap-2">
          {status.icon}
          <div>
            <p className="font-bold text-xs leading-none font-devanagari tracking-wide">
              {status.labelHi}
            </p>
            <p className="text-[10px] leading-none opacity-90 mt-0.5 font-medium">
              {status.label}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="font-devanagari font-bold text-xs leading-none">
            {daysLabel}
          </p>
          <p className="text-[10px] opacity-90 mt-0.5 font-mono leading-none">
            {expired ? '⚠️ EXPIRED' : `Exp: ${expiryDisplay}`}
          </p>
        </div>
      </div>
    </div>
  )
}
