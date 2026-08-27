import { History, Trash2, ChevronRight, Calendar, AlertCircle, ShieldCheck, Clock, Pill, Sparkles } from 'lucide-react'

/**
 * ScanHistoryDashboard – Royal dark glass recent scans history list.
 */
export default function ScanHistoryDashboard({ history, onSelectHistoryItem, onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl bg-[#181130]/90 border border-purple-500/20 backdrop-blur-xl shadow-xl p-6 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-900 border border-purple-700/40 flex items-center justify-center text-purple-400 shadow-inner">
          <Pill size={30} className="transform -rotate-45 text-amber-400/70" />
        </div>
        <div>
          <h3 className="text-white font-extrabold text-base tracking-tight flex items-center justify-center gap-1.5">
            <span>No Recent Scans Yet</span>
            <Sparkles size={15} className="text-amber-400" />
          </h3>
          <p className="font-devanagari text-purple-300 font-bold text-xs mt-1">
            आपकी स्कैन की गई दवाइयों का इतिहास यहाँ सुरक्षित रहेगा।
          </p>
          <p className="text-purple-400/60 font-medium text-[11px] mt-1">
            Scan any medicine strip, box or report above to see history here!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-[#181130]/90 border border-purple-500/20 backdrop-blur-xl shadow-xl p-4 flex flex-col gap-3">
      {/* Dashboard Title & Clear Button */}
      <div className="flex items-center justify-between px-0.5 border-b border-purple-800/40 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-900/60 text-amber-400 border border-purple-700/40 flex items-center justify-center shrink-0">
            <History size={17} />
          </div>
          <div>
            <h3 className="text-white font-extrabold text-base leading-tight tracking-tight">
              Recent Scans
            </h3>
            <p className="font-devanagari text-amber-400/80 font-bold text-xs leading-tight">
              हाल की दवाइयाँ ({history.length})
            </p>
          </div>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 px-3 py-1.5 rounded-xl border border-red-800/40 transition-colors font-extrabold"
          title="Clear scan history"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-2 max-h-72 card-scroll pr-0.5">
        {history.map((item) => {
          const isRed    = item.expiryStatus === 'RED'
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
              className="group p-3 rounded-xl bg-[#0f0c1e]/70 hover:bg-purple-900/30 border border-purple-800/30 hover:border-amber-500/30 shadow-sm hover:shadow-md hover:shadow-amber-900/20 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-xl bg-[#0d0920] border border-purple-800/40 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                {item.previewUri ? (
                  <img src={item.previewUri} alt={item.englishName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">💊</span>
                )}
              </div>

              {/* Middle details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-white font-extrabold text-sm truncate leading-tight group-hover:text-emerald-300 transition-colors">
                    {item.englishName}
                  </h4>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 ${badgeBg}`}>
                    {badgeIcon}
                    <span>{item.expiryStatus}</span>
                  </span>
                </div>

                <p className="font-devanagari text-purple-300 font-bold text-xs truncate leading-tight mt-0.5">
                  {item.hindiName}
                </p>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-purple-400/70 font-semibold">
                  <span className="flex items-center gap-0.5">
                    <Calendar size={11} />
                    {formattedTime}
                  </span>
                  <span>•</span>
                  <span className="truncate text-amber-400/70 font-bold font-devanagari">
                    {item.bimari}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-purple-600/50 group-hover:text-amber-400 transition-colors shrink-0">
                <ChevronRight size={20} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
