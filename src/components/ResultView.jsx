import { useState, useEffect } from 'react'
import {
  ArrowLeft, RotateCcw, Volume2, VolumeX, Share2, AlertTriangle,
  Clock, ShieldCheck, Stethoscope, Lightbulb, ShieldAlert, Sparkles, ZoomIn, X, Pill
} from 'lucide-react'

const STATUS_CONFIG = {
  RED: {
    bg:        'bg-red-500/10 border-red-400/50',
    badge:     'bg-gradient-to-r from-red-600 to-rose-600 badge-red text-white',
    icon:      <AlertTriangle className="w-5 h-5 text-white animate-bounce shrink-0" />,
    labelEn:   'EXPIRED OR HIGH RISK - DO NOT USE',
    labelHi:   'तुरंत बदलें (खराब/असुरक्षित)',
    textColor: 'text-red-700',
  },
  YELLOW: {
    bg:        'bg-amber-500/10 border-amber-400/50',
    badge:     'bg-gradient-to-r from-amber-500 to-yellow-500 badge-yellow text-amber-950',
    icon:      <Clock className="w-5 h-5 text-amber-950 shrink-0" />,
    labelEn:   'EXPIRING SOON - USE WITH CAUTION',
    labelHi:   'ध्यान दें (जल्द इस्तेमाल करें)',
    textColor: 'text-amber-800',
  },
  GREEN: {
    bg:        'bg-emerald-500/10 border-emerald-400/50',
    badge:     'bg-gradient-to-r from-emerald-600 to-teal-600 badge-green text-white',
    icon:      <ShieldCheck className="w-5 h-5 text-white shrink-0" />,
    labelEn:   'SAFE TO USE - VALID MEDICINE',
    labelHi:   'सुरक्षित (इस्तेमाल योग्य)',
    textColor: 'text-emerald-800',
  },
}

/**
 * ResultView – Full dedicated Analysis Result View.
 * Displays large English + Hindi typography, zoomable preview image,
 * color-coded expiry badge, dosage instructions, audio read-aloud, and WhatsApp share.
 */
export default function ResultView({ analysis, imageUrl, onBackToHome, onShareWhatsApp, onNewScan }) {
  const [lang, setLang] = useState('hi') // 'hi' | 'en'
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  // Clean up speech synthesis on unmount or analysis change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [analysis])

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Web Speech API is not supported on this browser.')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const textToSpeak = lang === 'hi'
      ? `${analysis.hindiName || analysis.englishName}। बीमारी: ${analysis.bimari}। खुराक: ${analysis.solution}। सावधानियां: ${(analysis.warnings || []).join(', ')}`
      : `${analysis.englishName}. Targeted use: ${analysis.bimariEn || analysis.bimari}. Dosage instructions: ${analysis.solutionEn || analysis.solution}. Safety cautions: ${(analysis.warningsEn || []).join(', ')}`

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.9

    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v => v.lang.includes(lang === 'hi' ? 'hi' : 'en'))
    if (voice) utterance.voice = voice

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  if (!analysis) return null

  const status = STATUS_CONFIG[analysis.expiryStatus] || STATUS_CONFIG.GREEN
  const expired = analysis.daysLeft < 0

  const daysLabelEn = expired
    ? `Expired ${Math.abs(analysis.daysLeft)} days ago`
    : analysis.daysLeft === 9999
    ? 'Expiry Date Not Found'
    : `${analysis.daysLeft} Days Remaining`

  const daysLabelHi = expired
    ? `${Math.abs(analysis.daysLeft)} दिन पहले खत्म!`
    : analysis.daysLeft === 9999
    ? 'तारीख नहीं मिली'
    : `${analysis.daysLeft} दिन शेष`

  const expiryDateDisplay = analysis.expiryDate
    ? new Date(analysis.expiryDate + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    : 'N/A'

  const bimariText = lang === 'hi' ? analysis.bimari : (analysis.bimariEn || analysis.bimari)
  const solutionText = lang === 'hi' ? analysis.solution : (analysis.solutionEn || analysis.solution)
  const warningsList = lang === 'hi' ? (analysis.warnings || []) : (analysis.warningsEn || analysis.warnings || [])

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 text-gray-100 overflow-hidden animate-[fadeIn_0.2s_ease-out] relative">

      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-950/80 backdrop-blur-xl border-b border-emerald-700/40 shadow-lg shrink-0">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-800/80 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 transition-all shadow-sm"
          aria-label="Back to home"
        >
          <ArrowLeft size={15} />
          <span>Home / Home Page</span>
        </button>

        <div className="flex items-center gap-2">
          {/* WhatsApp Share */}
          <button
            onClick={onShareWhatsApp}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md shadow-emerald-600/30 transition-all"
            title="Share report via WhatsApp"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>

          {/* New Scan */}
          <button
            onClick={onNewScan}
            className="flex items-center gap-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md transition-all"
          >
            <RotateCcw size={13} />
            <span>New Scan</span>
          </button>
        </div>
      </header>

      {/* ── Scrollable Body Content ────────────────────────────────────────── */}
      <div className="card-scroll flex-1 min-h-0 p-3 space-y-3">

        {/* 1. Header Card: Image Preview + Large Bilingual Title */}
        <div className="rounded-2xl glass-panel p-3.5 border border-emerald-300/40 bg-white/95 text-slate-900 shadow-xl flex items-start gap-3 relative">
          {/* Image Thumbnail with Zoom trigger */}
          {imageUrl ? (
            <div
              onClick={() => setIsZoomOpen(true)}
              className="w-20 h-20 rounded-xl bg-emerald-50 border border-emerald-200 overflow-hidden shrink-0 relative group cursor-pointer shadow-md"
            >
              <img src={imageUrl} alt={analysis.englishName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-emerald-950/30 group-hover:bg-emerald-950/10 flex items-center justify-center text-white opacity-90 transition-opacity">
                <ZoomIn size={16} />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-3xl shrink-0">
              💊
            </div>
          )}

          {/* Titles & Subtitles */}
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md tracking-wider">
              <Pill size={11} className="text-emerald-700" />
              <span>Medicine Identity</span>
            </span>

            {/* ENGLISH NAME – LARGE & BOLD */}
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight mt-1 truncate">
              {analysis.englishName}
            </h1>

            {/* HINDI NAME */}
            <p className="font-devanagari text-emerald-800 font-bold text-sm leading-tight mt-0.5 truncate">
              {analysis.hindiName}
            </p>
          </div>
        </div>

        {/* 2. Color-coded Expiry & Safety Status Banner */}
        <div className={`rounded-2xl border p-3.5 shadow-xl ${status.bg} backdrop-blur-md`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {status.icon}
              <div>
                <p className="font-extrabold text-xs tracking-wider uppercase leading-none font-sans text-white">
                  {status.labelEn}
                </p>
                <p className="font-devanagari font-bold text-xs leading-tight mt-1 text-white/90">
                  {status.labelHi}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="font-extrabold text-sm text-white font-mono leading-none">
                {daysLabelEn}
              </p>
              <p className="font-devanagari text-xs text-white/80 mt-1 font-semibold leading-none">
                {daysLabelHi}
              </p>
              <p className="text-[10px] text-white/70 font-mono mt-1 leading-none">
                EXP: {expiryDateDisplay}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Voice Output & Language Toggle Controls */}
        <div className="rounded-2xl glass-panel p-2.5 border border-emerald-300/40 bg-white/95 text-slate-900 shadow-lg flex items-center justify-between gap-2">
          {/* Audio Listen Button */}
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2 rounded-xl shadow-md transition-all ${
              isSpeaking
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={16} />
                <span>Stop Audio / रुकें</span>
              </>
            ) : (
              <>
                <Volume2 size={16} />
                <span>🔊 Listen Audio / सुनें</span>
              </>
            )}
          </button>

          {/* Hindi / English Language Switcher */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-300 text-xs font-bold">
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1 rounded-lg transition-all ${
                lang === 'hi'
                  ? 'bg-emerald-600 text-white shadow font-devanagari'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg transition-all ${
                lang === 'en'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* 4. Purpose & Targeted Illness Section */}
        <div className="rounded-2xl glass-panel p-3.5 border border-emerald-300/40 bg-white/95 text-slate-900 shadow-xl space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-800">
            <Stethoscope size={18} className="text-emerald-600 shrink-0" />
            <h2 className="font-extrabold text-sm uppercase tracking-wide">
              Targeted Illness &amp; Use / बीमारी व उपयोग
            </h2>
          </div>
          <p className="font-devanagari text-gray-800 text-xs leading-relaxed font-semibold">
            {bimariText}
          </p>
        </div>

        {/* 5. Dosage & Usage Instructions Section */}
        <div className="rounded-2xl glass-panel p-3.5 border border-emerald-300/40 bg-white/95 text-slate-900 shadow-xl space-y-1.5">
          <div className="flex items-center gap-2 text-teal-800">
            <Lightbulb size={18} className="text-teal-600 shrink-0" />
            <h2 className="font-extrabold text-sm uppercase tracking-wide">
              Dosage &amp; Usage Instructions / खुराक व सही तरीका
            </h2>
          </div>
          <p className="font-devanagari text-gray-800 text-xs leading-relaxed font-semibold whitespace-pre-line">
            {solutionText}
          </p>
        </div>

        {/* 6. Smart Safety Caution & Warning Cards */}
        {warningsList && warningsList.length > 0 && (
          <div className="rounded-2xl border border-amber-300/80 bg-amber-50/95 text-amber-950 p-3.5 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldAlert size={18} className="text-amber-700 shrink-0" />
              <h2 className="font-extrabold text-sm uppercase tracking-wide">
                Safety Cautions &amp; Warnings / सावधानियां
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {warningsList.map((warn, idx) => (
                <div
                  key={idx}
                  className="bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 font-devanagari shadow-sm"
                >
                  <AlertTriangle size={12} className="text-amber-700 shrink-0" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-gray-400 text-[10px] font-devanagari pb-2">
          ⚠️ AI-generated analysis. Please consult a registered doctor before taking medicine.
        </p>
      </div>

      {/* ── Image Zoom Modal ──────────────────────────────────────────────── */}
      {isZoomOpen && imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/40"
          >
            <X size={20} />
          </button>
          <img src={imageUrl} alt="Zoomed medicine" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        </div>
      )}
    </div>
  )
}
