import { useState, useEffect } from 'react'
import { Volume2, VolumeX, AlertTriangle, Lightbulb, Stethoscope, Languages, ShieldAlert } from 'lucide-react'

/**
 * SolutionCard – BOTTOM CARD (40% viewport)
 * Features:
 *  - Multi-language Voice Output (Web Speech API) with Hindi & English toggle
 *  - High-contrast visual Smart Caution/Warning cards
 *  - Scrollable dosage & usage instructions
 */
export default function SolutionCard({ analysis, isLoading, isIdle }) {
  const [lang, setLang] = useState('hi') // 'hi' | 'en'
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Clean up speech synthesis if component unmounts or analysis changes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [analysis])

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech Synthesis is not supported in this browser.')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const textToSpeak = lang === 'hi'
      ? `${analysis.hindiName || analysis.englishName}। बीमारी: ${analysis.bimari}। खुराक और तरीका: ${analysis.solution}। सावधानियां: ${(analysis.warnings || []).join(', ')}`
      : `${analysis.englishName}. Use for: ${analysis.bimariEn || analysis.bimari}. Dosage instructions: ${analysis.solutionEn || analysis.solution}. Warnings: ${(analysis.warningsEn || []).join(', ')}`

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.9

    // Attempt to pick a natural voice if available
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v => v.lang.includes(lang === 'hi' ? 'hi' : 'en'))
    if (voice) utterance.voice = voice

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.cancel() // stop any prior speech
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  if (isLoading) {
    return (
      <div className="h-full rounded-2xl glass-panel p-3.5 flex flex-col gap-3 border border-emerald-200/60 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
        <div className="skeleton h-16 w-full rounded-xl mt-1" />
      </div>
    )
  }

  if (isIdle || !analysis) {
    return (
      <div className="h-full rounded-2xl glass-panel border border-dashed border-emerald-300/80 flex flex-col items-center justify-center gap-1.5 p-3.5 shadow-lg">
        <div className="w-10 h-10 rounded-full bg-teal-100/60 text-teal-600 flex items-center justify-center">
          <Stethoscope size={20} />
        </div>
        <p className="text-gray-600 font-bold text-xs text-center font-devanagari">
          उपयोग, खुराक व सावधानियां
        </p>
        <p className="text-gray-400 text-[10px] text-center">
          Purpose, dosage dashboard &amp; audio read-aloud
        </p>
      </div>
    )
  }

  const bimariText  = lang === 'hi' ? analysis.bimari : (analysis.bimariEn || analysis.bimari)
  const solutionText = lang === 'hi' ? analysis.solution : (analysis.solutionEn || analysis.solution)
  const warningsList = lang === 'hi' ? (analysis.warnings || []) : (analysis.warningsEn || analysis.warnings || [])

  return (
    <div className="h-full rounded-2xl glass-panel p-3 flex flex-col gap-2 border border-emerald-200/60 shadow-xl overflow-hidden animate-bounce-in">

      {/* Control Header: Voice Output & Language Switch */}
      <div className="flex items-center justify-between shrink-0 bg-emerald-50/70 p-1.5 rounded-xl border border-emerald-100/80">

        {/* Audio Listen Button */}
        <button
          onClick={toggleSpeech}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all ${
            isSpeaking
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
          }`}
          aria-label="Listen audio instructions"
        >
          {isSpeaking ? (
            <>
              <VolumeX size={14} />
              <span>रुकें (Stop)</span>
              <div className="flex items-end gap-0.5 h-3 ml-1">
                <span className="w-1 bg-white rounded-full bar-1" />
                <span className="w-1 bg-white rounded-full bar-2" />
                <span className="w-1 bg-white rounded-full bar-3" />
              </div>
            </>
          ) : (
            <>
              <Volume2 size={14} />
              <span>🔊 सुनें (Listen)</span>
            </>
          )}
        </button>

        {/* Language Toggle Button */}
        <div className="flex items-center bg-white p-0.5 rounded-lg border border-emerald-200 text-[11px] font-bold">
          <button
            onClick={() => setLang('hi')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              lang === 'hi'
                ? 'bg-emerald-600 text-white shadow-sm font-devanagari'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              lang === 'en'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card-scroll flex-1 min-h-0 space-y-2 pr-0.5">

        {/* Section 1: Bimari / Targeted Illness */}
        <section className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-1.5">
            <Stethoscope size={14} className="text-emerald-600" />
            <h3 className="text-emerald-900 font-bold text-xs font-devanagari">
              {lang === 'hi' ? 'बीमारी / उपयोग (Targeted Illness)' : 'Targeted Illness'}
            </h3>
          </div>
          <p className="font-devanagari text-gray-800 text-xs leading-relaxed font-medium mt-1">
            {bimariText}
          </p>
        </section>

        {/* Section 2: Solution / Sahi Usage */}
        <section className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-1.5">
            <Lightbulb size={14} className="text-teal-600" />
            <h3 className="text-teal-900 font-bold text-xs font-devanagari">
              {lang === 'hi' ? 'सही खुराक व तरीका (Dosage & Instructions)' : 'Dosage & Instructions'}
            </h3>
          </div>
          <p className="font-devanagari text-gray-800 text-xs leading-relaxed font-medium mt-1 whitespace-pre-line">
            {solutionText}
          </p>
        </section>

        {/* Section 3: Smart Caution & Warnings Cards */}
        {warningsList && warningsList.length > 0 && (
          <section className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
            <div className="flex items-center gap-1.5 mb-1.5">
              <ShieldAlert size={14} className="text-amber-700" />
              <h3 className="text-amber-950 font-bold text-xs font-devanagari">
                {lang === 'hi' ? 'सावधानियां (Safety Caution Alerts)' : 'Safety Cautions'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {warningsList.map((warn, idx) => (
                <span
                  key={idx}
                  className="bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 font-devanagari shadow-2xs"
                >
                  <AlertTriangle size={10} className="text-amber-700 shrink-0" />
                  <span>{warn}</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* AI Medical Disclaimer */}
      <div className="shrink-0 text-center pt-0.5">
        <p className="text-gray-400 text-[9px] font-devanagari leading-none">
          ⚠️ AI-generated · कृपया डॉक्टर की सलाह ज़रूर लें
        </p>
      </div>
    </div>
  )
}
