import { Sparkles, ShieldCheck, Volume2, Share2, Zap } from 'lucide-react'

/**
 * HeroIntroCard – Revamped high-impact AI medical intro widget.
 * Features rich gradient background, crisp white typography, and solid feature pill badges.
 */
export default function HeroIntroCard() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white p-4 shadow-xl border border-emerald-400/30 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex items-center justify-between mb-2.5 relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          <Sparkles size={12} className="text-yellow-300 animate-pulse" />
          <span>AI-Powered Medical Assistant</span>
        </span>
        <span className="text-[10px] text-emerald-100 font-mono font-bold tracking-wide">
          24/7 Smart Scanner
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="relative z-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <span>Chikitsak</span>
          <span className="text-emerald-200 font-devanagari text-xl font-bold">चिकित्सक</span>
        </h2>

        <p className="text-white text-xs font-semibold leading-relaxed mt-1">
          Your 24/7 Smart AI Medical Assistant for instantly analyzing medicine packages &amp; lab reports.
        </p>

        <p className="font-devanagari text-emerald-100 text-xs leading-relaxed mt-1 font-medium">
          दवाई के पत्ते, डिब्बे या रिपोर्ट की फोटो लें — पाएं तुरंत सही जानकारी व सावधानियां।
        </p>
      </div>

      {/* Visual Feature Pill Badges */}
      <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-white/20 relative z-10">
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1.5 rounded-xl text-white shadow-sm">
          <Zap size={14} className="text-yellow-300 shrink-0" />
          <span className="text-xs font-bold tracking-wide">Instant Scan</span>
        </div>

        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1.5 rounded-xl text-white shadow-sm">
          <ShieldCheck size={14} className="text-emerald-300 shrink-0" />
          <span className="text-xs font-bold tracking-wide">Expiry Alert</span>
        </div>

        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1.5 rounded-xl text-white shadow-sm">
          <Volume2 size={14} className="text-teal-200 shrink-0" />
          <span className="text-xs font-bold tracking-wide">Voice Read-Aloud</span>
        </div>

        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1.5 rounded-xl text-white shadow-sm">
          <Share2 size={14} className="text-cyan-200 shrink-0" />
          <span className="text-xs font-bold tracking-wide">WhatsApp Share</span>
        </div>
      </div>
    </div>
  )
}
