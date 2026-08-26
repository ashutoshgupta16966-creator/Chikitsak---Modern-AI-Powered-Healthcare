import { Pill, Sparkles, Home, History } from 'lucide-react'

/**
 * AppHeader – High-contrast dark top navigation bar for Chikitsak.
 */
export default function AppHeader({ onGoHome, isResultView, historyCount, showHistory, onToggleHistory }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-3.5 py-2.5 bg-slate-950 text-white border-b border-slate-800 shadow-lg shrink-0">

      {/* Brand logo trigger */}
      <div
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={onGoHome}
        title="Go to Chikitsak Home"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-900/50 flex items-center justify-center group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Pill size={18} className="text-emerald-400 transform -rotate-45" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-white font-extrabold text-base leading-none tracking-tight">
              Chikitsak
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full font-mono flex items-center gap-0.5">
              <Sparkles size={8} /> AI
            </span>
          </div>
          <p className="font-devanagari text-emerald-300 text-[11px] leading-none font-bold mt-0.5">
            चिकित्सक · Medical Assistant
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Home Button (shown in Result view) */}
        {isResultView && (
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-extrabold px-3.5 py-1.5 rounded-full transition-all shadow-sm"
          >
            <Home size={14} />
            <span>Home</span>
          </button>
        )}

        {/* History Toggle Button (shown in Home view) */}
        {!isResultView && (
          <button
            onClick={onToggleHistory}
            className={`flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-full border transition-all shadow-sm ${
              showHistory
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-900 text-white border-slate-700 hover:bg-slate-800'
            }`}
            title="Scan History / इतिहास"
          >
            <History size={14} />
            <span>History</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
