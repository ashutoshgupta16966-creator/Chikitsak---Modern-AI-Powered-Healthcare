/**
 * SolutionCard – BOTTOM CARD (40% viewport)
 *
 * Displays:
 *  • Bimari / Targeted Illness section
 *  • Solution / Sahi Usage section (scrollable if long)
 *  • Skeleton loaders while fetching
 */
export default function SolutionCard({ analysis, isLoading, isIdle }) {

  // ── Skeleton while loading ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-full rounded-2xl bg-white shadow-md border border-emerald-100 p-3 flex flex-col gap-3">
        <div>
          <div className="skeleton h-3 w-24 mb-1.5" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-3/4 mt-1" />
        </div>
        <div className="flex-1">
          <div className="skeleton h-3 w-28 mb-1.5" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-full mt-1" />
          <div className="skeleton h-3 w-2/3 mt-1" />
          <div className="skeleton h-3 w-3/4 mt-1" />
        </div>
      </div>
    )
  }

  // ── Idle / empty state ────────────────────────────────────────────────
  if (isIdle || !analysis) {
    return (
      <div className="h-full rounded-2xl bg-white shadow-md border border-dashed border-emerald-200
                      flex flex-col items-center justify-center gap-1 p-3">
        <span className="text-4xl opacity-25">📋</span>
        <p className="text-gray-400 text-xs text-center font-medium">
          बीमारी और उपाय यहाँ दिखेंगे
        </p>
        <p className="text-gray-300 text-[10px] text-center">
          Purpose &amp; Solution Dashboard
        </p>
      </div>
    )
  }

  // ── Result state ──────────────────────────────────────────────────────
  return (
    <div className="h-full rounded-2xl bg-white shadow-md border border-emerald-100
                    p-3 flex flex-col gap-2 overflow-hidden animate-bounce-in">

      {/* ── Section: Bimari ──────────────────────────────────────── */}
      <section className="shrink-0">
        <SectionLabel icon="🏥" en="Targeted Illness" hi="बीमारी / उपयोग" />
        <p className="font-devanagari text-gray-700 text-xs leading-relaxed line-clamp-2 mt-1">
          {analysis.bimari}
        </p>
      </section>

      {/* Divider */}
      <div className="shrink-0 border-t border-dashed border-emerald-100" />

      {/* ── Section: Solution (scrollable) ───────────────────────── */}
      <section className="flex-1 min-h-0 flex flex-col">
        <SectionLabel icon="💡" en="Sahi Usage" hi="सही खुराक / तरीका" />
        <div className="card-scroll flex-1 min-h-0 mt-1">
          <p className="font-devanagari text-gray-700 text-xs leading-relaxed whitespace-pre-line">
            {analysis.solution}
          </p>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <p className="shrink-0 text-gray-300 text-[9px] text-center leading-tight">
        ⚠️ AI-generated · Doctor की सलाह ज़रूर लें
      </p>
    </div>
  )
}

/** Reusable section label with icon, English subtitle, and Hindi title */
function SectionLabel({ icon, en, hi }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm" role="img">{icon}</span>
      <div>
        <p className="font-devanagari text-brand-primary font-bold text-xs leading-none">{hi}</p>
        <p className="text-gray-400 text-[9px] leading-none mt-0.5">{en}</p>
      </div>
    </div>
  )
}
