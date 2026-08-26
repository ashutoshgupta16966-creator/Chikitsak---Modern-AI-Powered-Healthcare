import { History, Trash2, ChevronRight, Calendar, AlertCircle, ShieldCheck, Clock, Pill, Sparkles } from 'lucide-react'

/**
 * ScanHistoryDashboard – Recent Scans History list with engaging empty state & high-contrast card styling.
 */
export default function ScanHistoryDashboard({ history, onSelectHistoryItem, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col items-center justify-center text-center gap-3 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-inner">
          <Pill size={32} className="transform -rotate-45" />
        </div>
        <div>
          <h3 className="text-slate-900 font-extrabold text-base tracking-tight flex items-center justify-center gap-1.5">
            <span>No Recent Scans Yet</span>
            <Sparkles size={16} className="text-emerald-600" />
          </h3>
          <p className="font-devanagari text-slate-700 font-bold text-xs mt-1">
            आपकी स्कैन की गई दवाइयों का इतिहास यहाँ सुरक्षित रहेगा।
          </p>
          <p className="text-slate-500 font-medium text-[11px] mt-1">
            Scan any medicine strip, box or report above to see history here!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col gap-3 shadow-md text-slate-900">
      {/* Dashboard Title & Clear Button */}
      <div className="flex items-center justify-between px-0.5 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <History size={18} />
          </div>
          <div>
            <h3 className="text-slate-900 font-extrabold text-base leading-tight tracking-tight">
              Recent Scans History
            </h3>
            <p className="font-devanagari text-emerald-800 font-bold text-xs leading-tight">
              हाल की दवाइयाँ ({history.length})
            </p>
          </div>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition-colors font-extrabold"
          title="Clear scan history"
        >
          <Trash2 size={13} />
          <span>Clear All</span>
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-2.5 max-h-72 card-scroll pr-0.5">
        {history.map((item) => {
          const isRed = item.expiryStatus === 'RED'
          const isYellow = item.expiryStatus === 'YELLOW'

          const badgeBg = isRed
            ? 'bg-red-600 text-white font-extrabold badge-red'
            : isYellow
            ? 'bg-amber-500 text-slate-950 font-extrabold badge-yellow'
            : 'bg-emerald-600 text-white font-extrabold badge-green'

          const badgeIcon = isRed ? (
            <AlertCircle size={11} />
          ) : isYellow ? (
            <Clock size={11} />
          ) : (
            <ShieldCheck size={11} />
          )

          const formattedTime = new Date(item.timestamp || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short'
          })

          return (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="group p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                {item.previewUri ? (
                  <img src={item.previewUri} alt={item.englishName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">💊</span>
                )}
              </div>

              {/* Middle details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* BOLD DARK SLATE TITLE */}
                  <h4 className="text-slate-900 font-extrabold text-sm truncate leading-tight group-hover:text-emerald-800 transition-colors">
                    {item.englishName}
                  </h4>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 ${badgeBg}`}>
                    {badgeIcon}
                    <span>{item.expiryStatus}</span>
                  </span>
                </div>

                {/* HINDI SUBTITLE – HIGH CONTRAST DARK */}
                <p className="font-devanagari text-slate-700 font-bold text-xs truncate leading-tight mt-0.5">
                  {item.hindiName}
                </p>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600 font-semibold">
                  <span className="flex items-center gap-0.5">
                    <Calendar size={11} />
                    {formattedTime}
                  </span>
                  <span>•</span>
                  <span className="truncate text-teal-800 font-bold font-devanagari">
                    {item.bimari}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-slate-400 group-hover:text-emerald-700 transition-colors shrink-0">
                <ChevronRight size={20} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
