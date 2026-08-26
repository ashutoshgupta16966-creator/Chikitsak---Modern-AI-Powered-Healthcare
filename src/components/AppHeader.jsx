/**
 * AppHeader – branding bar at the top of the screen.
 * Shows a reset/scan-again button when a result is visible.
 */
export default function AppHeader({ onReset, hasResult }) {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-brand-primary shadow-md shrink-0">

      {/* Brand identity */}
      <div className="flex items-center gap-2">
        {/* Caduceus / pill icon */}
        <span className="text-2xl" role="img" aria-label="medicine">💊</span>
        <div>
          <h1 className="text-white font-bold text-base leading-tight tracking-wide">
            चिकित्सक
          </h1>
          <p className="text-emerald-200 text-[10px] leading-none font-medium">
            Chikitsak · AI Medicine Scanner
          </p>
        </div>
      </div>

      {/* Scan-again button (visible after result) */}
      {hasResult && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 bg-white/20 hover:bg-white/30 active:bg-white/40
                     text-white text-xs font-semibold px-3 py-1.5 rounded-full
                     transition-colors duration-150"
          aria-label="Scan new medicine"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.22-8.56" />
            <polyline points="21 3 21 9 15 9" />
          </svg>
          नई स्कैन
        </button>
      )}

      {/* Version tag */}
      {!hasResult && (
        <span className="text-emerald-300 text-[10px] font-mono">v1.0</span>
      )}
    </header>
  )
}
