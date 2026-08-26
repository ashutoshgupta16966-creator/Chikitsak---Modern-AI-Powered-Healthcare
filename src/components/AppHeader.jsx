import { RotateCcw, Sparkles, History, Pill } from 'lucide-react'

/**
 * AppHeader – Glassmorphism header bar at the top of the mobile screen.
 */
export default function AppHeader({ onReset, hasResult, historyCount, showHistory, onToggleHistory }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 backdrop-blur-lg border-b border-emerald-700/40 shadow-lg shrink-0">

      {/* Brand identity */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={onReset}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-900/40 flex items-center justify-center">
          <div className="w-full h-full bg-emerald-950/80 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
            <Pill size={20} className="text-emerald-400 transform -rotate-45" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-white font-bold text-base leading-none tracking-wide font-devanagari">
              चिकित्सक
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-1.5 py-0.5 rounded-full font-mono flex items-center gap-0.5">
              <Sparkles size={8} /> AI
            </span>
          </div>
          <p className="text-emerald-300/80 text-[10px] leading-none font-medium mt-0.5">
            Chikitsak · Smart Scanner
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* History Toggle Button */}
        <button
          onClick={onToggleHistory}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-all duration-200 ${
            showHistory
              ? 'bg-emerald-400 text-emerald-950 border-emerald-300 shadow-md shadow-emerald-400/20'
              : 'bg-emerald-950/60 text-emerald-200 border-emerald-700/50 hover:bg-emerald-900/80'
          }`}
          aria-label="Toggle history"
          title="Scan History / इतिहास"
        >
          <History size={14} />
          <span className="hidden sm:inline">इतिहास</span>
          {historyCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>

        {/* Scan-again button (visible after result) */}
        {hasResult && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md shadow-emerald-900/50 transition-all duration-150"
            aria-label="Scan new medicine"
          >
            <RotateCcw size={13} />
            <span>नई स्कैन</span>
          </button>
        )}
      </div>
    </header>
  )
}
