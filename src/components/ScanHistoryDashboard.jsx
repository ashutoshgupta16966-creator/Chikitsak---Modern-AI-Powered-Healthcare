import { History, Trash2, ChevronRight, Calendar, AlertCircle, ShieldCheck, Clock } from 'lucide-react'

/**
 * ScanHistoryDashboard – Recent Medicines & Scan History Dashboard
 * Displays stored scans from localStorage with filterable status & 1-click reload.
 */
export default function ScanHistoryDashboard({ history, onSelectHistoryItem, onClearHistory, onNewScan }) {
  if (!history || history.length === 0) {
    return (
      <div className="h-full rounded-2xl glass-panel p-5 flex flex-col items-center justify-center text-center gap-3 border border-emerald-200/60 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-600 shadow-inner">
          <History size={32} />
        </div>
        <div>
          <h3 className="text-gray-800 font-bold text-base font-devanagari">
            कोई पुराना स्कैन नहीं मिला
          </h3>
          <p className="text-gray-500 text-xs mt-1 max-w-xs leading-relaxed">
            आपके द्वारा स्कैन की गई दवाइयों का इतिहास यहाँ सुरक्षित रहेगा।
          </p>
        </div>
        <button
          onClick={onNewScan}
          className="mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
        >
          <span>📸 पहली स्कैन करें</span>
        </button>
      </div>
    )
  }

  return (
    <div className="h-full rounded-2xl glass-panel p-3.5 flex flex-col gap-2.5 border border-emerald-200/60 shadow-xl overflow-hidden">
      {/* Dashboard Title & Clear button */}
      <div className="flex items-center justify-between shrink-0 px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
            <History size={16} />
          </div>
          <div>
            <h3 className="text-gray-800 font-bold text-sm leading-tight font-devanagari">
              हाल की दवाइयाँ (Scan History)
            </h3>
            <p className="text-gray-400 text-[10px] leading-tight">
              {history.length} saved scans in local storage
            </p>
          </div>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors font-medium"
          title="Clear all history"
        >
          <Trash2 size={12} />
          <span>साफ़ करें</span>
        </button>
      </div>

      {/* Scrollable Cards Grid */}
      <div className="card-scroll flex-1 min-h-0 space-y-2 pr-0.5">
        {history.map((item) => {
          const isRed = item.expiryStatus === 'RED'
          const isYellow = item.expiryStatus === 'YELLOW'

          const badgeBg = isRed
            ? 'bg-red-500 text-white badge-red'
            : isYellow
            ? 'bg-amber-400 text-amber-950 badge-yellow'
            : 'bg-emerald-500 text-white badge-green'

          const badgeIcon = isRed ? (
            <AlertCircle size={12} />
          ) : isYellow ? (
            <Clock size={12} />
          ) : (
            <ShieldCheck size={12} />
          )

          const formattedTime = new Date(item.timestamp || Date.now()).toLocaleDateString('hi-IN', {
            day: 'numeric',
            month: 'short',
          })

          return (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="group p-2.5 rounded-xl bg-white/90 hover:bg-white border border-emerald-100/80 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              {/* Left thumbnail / badge */}
              <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 overflow-hidden shrink-0 flex items-center justify-center relative">
                {item.previewUri ? (
                  <img src={item.previewUri} alt={item.englishName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">💊</span>
                )}
              </div>

              {/* Middle details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-gray-800 font-bold text-xs truncate leading-tight group-hover:text-emerald-700 transition-colors">
                    {item.englishName}
                  </h4>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${badgeBg}`}>
                    {badgeIcon}
                    <span>{item.expiryStatus}</span>
                  </span>
                </div>
                <p className="font-devanagari text-gray-500 text-[11px] truncate leading-tight mt-0.5">
                  {item.hindiName}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <Calendar size={10} />
                    {formattedTime}
                  </span>
                  <span>•</span>
                  <span className="truncate text-emerald-700 font-medium font-devanagari">
                    {item.bimari}
                  </span>
                </div>
              </div>

              {/* Right Arrow */}
              <div className="text-gray-300 group-hover:text-emerald-600 transition-colors shrink-0">
                <ChevronRight size={18} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
