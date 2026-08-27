import { Pill, Sparkles, Home, History } from 'lucide-react'

/**
 * AppHeader – Royal dark glass top navigation bar for Chikitsak.
 */
export default function AppHeader({ onGoHome, isResultView, historyCount, showHistory, onToggleHistory }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-3.5 py-2.5 bg-[#0d0920]/95 text-white border-b border-purple-900/50 shadow-lg shadow-purple-950/40 backdrop-blur-xl shrink-0">

      {/* Brand logo trigger */}
      <div
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={onGoHome}
        title="Go to Chikitsak Home"
      >
        {/* Gold-rimmed icon emblem */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-[2px] shadow-md shadow-amber-900/40 gold-glow flex items-center justify-center group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#0d0920] rounded-[10px] flex items-center justify-center">
            <Pill size={18} className="text-amber-400 transform -rotate-45" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-black text-base leading-none tracking-widest bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-400 bg-clip-text text-transparent">
              CHIKITSAK
            </h1>
            <span className="bg-purple-800/60 text-purple-200 border border-purple-600/40 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full font-mono flex items-center gap-0.5">
              <Sparkles size={8} /> AI
            </span>
          </div>
          <p className="font-devanagari text-amber-400/80 text-[11px] leading-none font-bold mt-0.5">
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
            className="flex items-center gap-1.5 bg-purple-900/60 hover:bg-purple-800/80 text-white border border-purple-700/50 text-xs font-extrabold px-3.5 py-1.5 rounded-full transition-all shadow-sm"
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
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/30'
                : 'bg-purple-900/60 text-white border-purple-700/50 hover:bg-purple-800/80'
            }`}
            title="Scan History / इतिहास"
          >
            <History size={14} />
            <span>History</span>
            {historyCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
