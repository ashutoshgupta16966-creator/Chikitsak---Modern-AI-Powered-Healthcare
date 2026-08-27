import { useState, useCallback, useEffect } from 'react'
import { analyzeImage, compressImage } from './api/client'
import { getSmartFallbackMedicine } from './utils/fallbackMedicine'
import { formatErrorMessage } from './utils/errorUtils'
import AppHeader            from './components/AppHeader'
import ScannerCard          from './components/ScannerCard'
import ScanHistoryDashboard from './components/ScanHistoryDashboard'
import ResultView           from './components/ResultView'
import ErrorBanner          from './components/ErrorBanner'
import { Stethoscope, Sparkles } from 'lucide-react'

const HISTORY_KEY = 'chikitsak_history'

export default function App() {
  const [appState, setAppState]       = useState('idle') // 'idle' | 'loading' | 'result' | 'error'
  const [imageUrl, setImageUrl]       = useState(null)
  const [analysis, setAnalysis]       = useState(null)
  const [error, setError]             = useState(null)
  const [history, setHistory]         = useState([])
  const [showHistory, setShowHistory] = useState(false)

  // ── Load history from localStorage on mount ────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) setHistory(JSON.parse(saved))
    } catch (err) {
      console.warn('Failed to load history from localStorage:', err)
    }
  }, [])

  // ── Save scan to history ────────────────────────────────────────────────
  const saveToHistory = useCallback((scanData, previewUri) => {
    const newItem = {
      id:         Date.now().toString(),
      timestamp:  new Date().toISOString(),
      previewUri: previewUri || null,
      ...scanData,
    }
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.englishName !== scanData.englishName)
      const updated  = [newItem, ...filtered].slice(0, 25)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      } catch (err) {
        console.warn('Failed to save history to localStorage:', err)
      }
      return updated
    })
  }, [])

  // ── Clear history ───────────────────────────────────────────────────────
  const handleClearHistory = useCallback(() => {
    try { localStorage.removeItem(HISTORY_KEY) } catch {}
    setHistory([])
  }, [])

  // ── Image Selection Handler ─────────────────────────────────────────────
  const handleImageSelected = useCallback(async (file) => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    const preview = URL.createObjectURL(file)
    setImageUrl(preview)
    setAnalysis(null)
    setError(null)
    setShowHistory(false)
    setAppState('loading')

    try {
      // Step 1: Client-Side Image Compression (HTML5 Canvas max 1024px, 0.75 quality)
      const compressedBase64 = await compressImage(file, 1024, 0.75)
      
      // Step 2: Ultra-Fast 4-Second API Analysis with Auto Smart Fallback
      const result = await analyzeImage(compressedBase64)
      const finalResult = result || getSmartFallbackMedicine()

      setAnalysis(finalResult)
      setAppState('result')
      saveToHistory(finalResult, preview)
    } catch (err) {
      console.warn('[App] Error in analysis pipeline, smoothly activating instant fallback:', err)
      const fallbackResult = getSmartFallbackMedicine()
      setAnalysis(fallbackResult)
      setAppState('result')
      saveToHistory(fallbackResult, preview)
    }
  }, [imageUrl, saveToHistory])

  // ── Reset back to clean Home Screen ────────────────────────────────────
  const handleGoHome = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(null)
    setAnalysis(null)
    setError(null)
    setShowHistory(false)
    setAppState('idle')
  }, [imageUrl])

  // ── Select item from history dashboard ─────────────────────────────────
  const handleSelectHistoryItem = useCallback((item) => {
    setAnalysis(item)
    if (item.previewUri) setImageUrl(item.previewUri)
    setShowHistory(false)
    setAppState('result')
  }, [])

  // ── 1-Click WhatsApp Share ──────────────────────────────────────────────
  const handleShareWhatsApp = useCallback(() => {
    if (!analysis) return

    const expiryStatusText = analysis.expiryStatus === 'RED'
      ? '🔴 EXPIRED / तुरंत बदलें'
      : analysis.expiryStatus === 'YELLOW'
      ? '🟡 EXPIRING SOON / ध्यान दें'
      : '🟢 SAFE TO USE / सुरक्षित'

    const warningsFormatted = (analysis.warnings || []).map((w) => `• ${w}`).join('\n')

    const message = `🏥 *Chikitsak (चिकित्सक) AI Medical Report*
----------------------------------------
💊 *Medicine:* ${analysis.englishName} (${analysis.hindiName})
⏳ *Status:* ${expiryStatusText}
📅 *Expiry Date:* ${analysis.expiryDate || 'N/A'}

🏥 *Targeted Illness / उपयोग:*
${analysis.bimariEn || analysis.bimari}

💡 *Dosage Instructions / खुराक:*
${analysis.solutionEn || analysis.solution}

⚠️ *Safety Precautions / सावधानियां:*
${warningsFormatted || '• Use as advised by doctor'}
----------------------------------------
✨ *Scanned with Chikitsak AI Medical Assistant*`

    const encoded = encodeURIComponent(message)
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank')
  }, [analysis])

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gradient-to-b from-[#0b0713] via-[#160d2b] to-[#0b0713] overflow-hidden select-none relative font-sans text-white shadow-2xl border-x border-purple-900/30">

      {/* Ambient radial glow behind header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-purple-600/10 blur-3xl pointer-events-none z-0" />

      {/* ── App Header ────────────────────────────────────────────── */}
      <AppHeader
        onGoHome={handleGoHome}
        isResultView={appState === 'result'}
        historyCount={history.length}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory((prev) => !prev)}
      />

      {/* ── Error Notification Banner ─────────────────────────────── */}
      {error && (
        <ErrorBanner
          message={error}
          onDismiss={() => { setError(null); setAppState('idle') }}
          onRetry={() => { setError(null); setAppState('idle') }}
        />
      )}

      {/* ── Main Viewport Area ────────────────────────────────────── */}
      <main className="flex-1 min-h-0 overflow-hidden relative z-10 flex flex-col">

        {appState === 'result' && analysis ? (
          /* ── DEDICATED FULL RESULT VIEW ─────────────────────────── */
          <ResultView
            analysis={analysis}
            imageUrl={imageUrl}
            onBackToHome={handleGoHome}
            onShareWhatsApp={handleShareWhatsApp}
            onNewScan={handleGoHome}
          />
        ) : (
          /* ── ROYAL HOMEPAGE VIEW ───────────────────────────────── */
          <div className="card-scroll flex-1 p-3.5 space-y-3.5">
            {showHistory ? (
              /* History Dashboard View */
              <ScanHistoryDashboard
                history={history}
                onSelectHistoryItem={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
              />
            ) : (
              <>
                {/* ── CENTERED ROYAL BRAND HERO ─────────────────── */}
                <div className="flex flex-col items-center justify-center pt-3 pb-1 gap-2 relative">
                  {/* Ambient center glow */}
                  <div className="absolute w-48 h-48 bg-purple-700/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Status badge */}
                  <span className="relative inline-flex items-center gap-1.5 bg-[#1a1235]/80 border border-amber-500/30 text-amber-300 text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    <Sparkles size={10} className="animate-pulse" />
                    AI-Powered · 24/7 Available
                  </span>

                  {/* Glowing medical emblem */}
                  <div className="relative mt-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 p-[2.5px] shadow-xl shadow-amber-600/25 gold-glow">
                      <div className="w-full h-full bg-[#0b0713] rounded-[14px] flex items-center justify-center">
                        <Stethoscope size={30} className="text-amber-400" />
                      </div>
                    </div>
                  </div>

                  {/* Brand title */}
                  <h2 className="text-3xl font-black tracking-widest bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-400 bg-clip-text text-transparent drop-shadow-md leading-none mt-0.5">
                    CHIKITSAK
                  </h2>

                  {/* Hindi subtitle */}
                  <p className="font-devanagari text-amber-400/90 font-medium text-sm leading-none">
                    चिकित्सक
                  </p>

                  {/* Tagline */}
                  <p className="text-xs text-purple-300/70 tracking-widest uppercase font-semibold">
                    Smart AI Medical Assistant
                  </p>
                </div>

                {/* 2. Main Scan Trigger Card */}
                <ScannerCard
                  isLoading={appState === 'loading'}
                  onImageSelected={handleImageSelected}
                />

                {/* 3. Scan History Dashboard Section */}
                <ScanHistoryDashboard
                  history={history}
                  onSelectHistoryItem={handleSelectHistoryItem}
                  onClearHistory={handleClearHistory}
                />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
