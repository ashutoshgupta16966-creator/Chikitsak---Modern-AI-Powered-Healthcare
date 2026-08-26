import { Sparkles, ShieldCheck, Volume2, Share2, Zap, Pill } from 'lucide-react'

/**
 * HeroIntroCard – Modern glassmorphism hero header box for the home screen.
 * Displays Chikitsak AI branding, mission tagline, and quick feature badges.
 */
export default function HeroIntroCard({ onScanClick }) {
  return (
    <div className="rounded-2xl glass-panel p-4 border border-emerald-300/40 shadow-xl relative overflow-hidden bg-gradient-to-br from-emerald-900/90 via-teal-900/80 to-slate-900/95 text-white">
      {/* Background ambient lighting */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          <Sparkles size={11} className="text-emerald-400 animate-pulse" />
          <span>AI-Powered Medical Assistant</span>
        </span>
        <span className="text-[10px] text-emerald-300/70 font-mono font-medium">
          24/7 Smart Scan
        </span>
      </div>

      {/* Main Title & Bilingual Subtitle */}
      <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
        <span>Chikitsak</span>
        <span className="text-emerald-400 font-devanagari text-lg font-bold">चिकित्सक</span>
      </h2>

      <p className="text-gray-200 text-xs font-semibold leading-relaxed mt-1">
        Your 24/7 Smart AI Medical Assistant for instant medicine &amp; lab report analysis.
      </p>

      <p className="font-devanagari text-emerald-200/90 text-xs leading-relaxed mt-0.5 font-medium">
        दवाई के पत्ते, डिब्बे या रिपोर्ट की फोटो लें — पाएं तुरंत सही जानकारी व सावधानियां।
      </p>

      {/* Feature Badges Grid */}
      <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-emerald-700/40">
        <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1.5 rounded-lg">
          <Zap size={13} className="text-emerald-400 shrink-0" />
          <span className="text-[11px] font-semibold text-gray-200">Instant Scan</span>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1.5 rounded-lg">
          <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
          <span className="text-[11px] font-semibold text-gray-200">Expiry Alert</span>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1.5 rounded-lg">
          <Volume2 size={13} className="text-emerald-400 shrink-0" />
          <span className="text-[11px] font-semibold text-gray-200">Voice Read-Aloud</span>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/20 px-2 py-1.5 rounded-lg">
          <Share2 size={13} className="text-emerald-400 shrink-0" />
          <span className="text-[11px] font-semibold text-gray-200">WhatsApp Share</span>
        </div>
      </div>
    </div>
  )
}
