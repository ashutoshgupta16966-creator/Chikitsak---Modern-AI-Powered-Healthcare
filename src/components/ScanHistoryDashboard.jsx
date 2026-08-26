import { History, Trash2, ChevronRight, Calendar, AlertCircle, ShieldCheck, Clock, Pill } from 'lucide-react'

/**
 * ScanHistoryDashboard – Recent Medicines Scan History list for the home screen.
 */
export default function ScanHistoryDashboard({ history, onSelectHistoryItem, onClearHistory, onNewScan }) {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl glass-panel p-5 flex flex-col items-center justify-center text-center gap-3 border border-emerald-200/60 shadow-xl bg-white/90">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 shadow-inner">
          <History size={28} />
        </div>
        <div>
          <h3 className="text-slate-900 font-extrabold text-sm tracking-tight">
            No Recent Scans Yet
          </h3>
          <p className="font-devanagari text-gray-500 text-xs mt-0.5">
            आपकी पुरानी दवाइयों का इतिहास यहाँ सुरक्षित रहेगा।
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl glass-panel p-3.5 flex flex-col gap-2.5 border border-emerald-200/60 shadow-xl bg-white/95 text-slate-900">
      {/* Dashboard Title & Clear button */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
            <History size={18} />
          </div>
          <div>
            <h3 className="text-slate-900 font-extrabold text-sm leading-tight tracking-tight">
              Recent Scans History
            </h3>
            <p className="font-devanagari text-emerald-800 text-[11px] font-semibold leading-tight">
              हाल की दवाइयाँ ({history.length})
            </p>
          </div>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors font-bold"
          title="Clear scan history"
        >
          <Trash2 size={12} />
          <span>Clear All</span>
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-2 max-h-72 card-scroll pr-0.5">
        {history.map((item) => {
          const isRed = item.expiryStatus === 'RED'
          const isYellow = item.expiryStatus === 'YELLOW'

          const badgeBg = isRed
            ? 'bg-red-500 text-white badge-red'
            : isYellow
            ? 'bg-amber-400 text-amber-950 badge-yellow'
            : 'bg-emerald-600 text-white badge-green'

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
              className="group p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-100/70 border border-emerald-200/80 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 overflow-hidden shrink-0 flex items-center justify-center relative shadow-sm">
                {item.previewUri ? (
                  <img src={item.previewUri} alt={item.englishName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">💊</span>
                )}
              </div>

              {/* Middle details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* LARGE ENGLISH NAME */}
                  <h4 className="text-slate-900 font-extrabold text-sm truncate leading-tight group-hover:text-emerald-800 transition-colors">
                    {item.englishName}
                  </h4>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${badgeBg}`}>
                    {badgeIcon}
                    <span>{item.expiryStatus}</span>
                  </span>
                </div>

                {/* HINDI NAME */}
                <p className="font-devanagari text-emerald-800 text-xs truncate leading-tight mt-0.5 font-bold">
                  {item.hindiName}
                </p>

                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500 font-semibold">
                  <span className="flex items-center gap-0.5">
                    <Calendar size={10} />
                    {formattedTime}
                  </span>
                  <span>•</span>
                  <span className="truncate text-teal-800 font-bold font-devanagari">
                    {item.bimari}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-gray-400 group-hover:text-emerald-700 transition-colors shrink-0">
                <ChevronRight size={18} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
