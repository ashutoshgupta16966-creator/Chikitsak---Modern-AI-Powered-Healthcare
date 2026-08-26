import { useState, useCallback, useEffect } from 'react'
import { analyzeImage, fileToBase64 } from './api/client'
import ScannerCard          from './components/ScannerCard'
import IdentityCard         from './components/IdentityCard'
import SolutionCard         from './components/SolutionCard'
import ScanHistoryDashboard from './components/ScanHistoryDashboard'
import AppHeader            from './components/AppHeader'
import ErrorBanner          from './components/ErrorBanner'

const HISTORY_KEY = 'chikitsak_history'

export default function App() {
  const [appState,     setAppState]     = useState('idle') // 'idle' | 'loading' | 'result' | 'error'
  const [imageUrl,     setImageUrl]     = useState(null)
  const [analysis,     setAnalysis]     = useState(null)
  const [error,        setError]        = useState(null)
  const [history,      setHistory]      = useState([])
  const [showHistory,  setShowHistory]  = useState(false)

  // ── Load history from localStorage on mount ────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) {
        setHistory(JSON.parse(saved))
      }
    } catch (err) {
      console.warn('Failed to read scan history from localStorage:', err)
    }
  }, [])

  // ── Save scan to history ────────────────────────────────────────────────
  const saveToHistory = useCallback((scanData, previewUri) => {
    const newItem = {
      id:          Date.now().toString(),
      timestamp:   new Date().toISOString(),
      previewUri:  previewUri || null,
      ...scanData,
    }

    setHistory((prev) => {
      // Filter out duplicate by englishName if scanned recently
      const filtered = prev.filter((item) => item.englishName !== scanData.englishName)
      const updated  = [newItem, ...filtered].slice(0, 20) // Keep last 20
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      } catch (err) {
        console.warn('Failed to save to localStorage:', err)
      }
      return updated
    })
  }, [])

  // ── Clear history ───────────────────────────────────────────────────────
  const handleClearHistory = useCallback(() => {
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch (err) {
      console.warn('Failed to clear localStorage:', err)
    }
    setHistory([])
  }, [])

  // ── Image selected callback ─────────────────────────────────────────────
  const handleImageSelected = useCallback(async (file) => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)

    const preview = URL.createObjectURL(file)
    setImageUrl(preview)
    setAnalysis(null)
    setError(null)
    setShowHistory(false)
    setAppState('loading')

    try {
      const base64Uri = await fileToBase64(file)
      const result    = await analyzeImage(base64Uri)
      setAnalysis(result)
      setAppState('result')

      // Save to localStorage history
      saveToHistory(result, preview)
    } catch (err) {
      console.error('[App] Analysis failed:', err)
      setError(err.message || 'Something went wrong while analyzing image. Please try again.')
      setAppState('error')
    }
  }, [imageUrl, saveToHistory])

  // ── Reset to main state ─────────────────────────────────────────────────
  const handleReset = useCallback(() => {
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
    if (item.previewUri) {
      setImageUrl(item.previewUri)
    }
    setShowHistory(false)
    setAppState('result')
  }, [])

  // ── 1-Click WhatsApp Share Formatter ────────────────────────────────────
  const handleShareWhatsApp = useCallback(() => {
    if (!analysis) return

    const expiryStatusText = analysis.expiryStatus === 'RED'
      ? '🔴 तुरंत बदलें / EXPIRED'
      : analysis.expiryStatus === 'YELLOW'
      ? '🟡 ध्यान दें / Use Soon'
      : '🟢 Safe to Use / सुरक्षित'

    const warningsFormatted = (analysis.warnings || [])
      .map((w) => `• ${w}`)
      .join('\n')

    const message = `🏥 *Chikitsak (चिकित्सक) Medical Scanner Report*
----------------------------------------
💊 *Medicine:* ${analysis.englishName}
🇮🇳 *नाम:* ${analysis.hindiName}
⏳ *Expiry Status:* ${expiryStatusText} (${analysis.expiryDate || 'N/A'})

🏥 *Illness / उपयोग:*
${analysis.bimari}

💡 *Dosage & Instructions / खुराक:*
${analysis.solution}

⚠️ *Safety Caution / सावधानियां:*
${warningsFormatted || '• Use as advised by doctor'}
----------------------------------------
✨ *Scanned with Chikitsak AI Assistant*`

    const encoded = encodeURIComponent(message)
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank')
  }, [analysis])

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950 overflow-hidden select-none relative">

      {/* Background ambient glowing light spots */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── App Header ────────────────────────────────────────────── */}
      <AppHeader
        onReset={handleReset}
        hasResult={appState === 'result'}
        historyCount={history.length}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory((prev) => !prev)}
      />

      {/* ── Error Banner ──────────────────────────────────────────── */}
      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}

      {/* ── Main Viewport Content ─────────────────────────────────── */}
      <main className="flex flex-col flex-1 gap-2 p-2.5 overflow-hidden relative z-10">
        {showHistory ? (
          /* History View Dashboard */
          <div className="h-full">
            <ScanHistoryDashboard
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={handleClearHistory}
              onNewScan={() => setShowHistory(false)}
            />
          </div>
        ) : (
          /* 3-Card Medical Scanner Layout */
          <>
            {/* TOP CARD – 28% Viewport */}
            <div className="h-[28%] min-h-0">
              <ScannerCard
                imageUrl={imageUrl}
                isLoading={appState === 'loading'}
                onImageSelected={handleImageSelected}
              />
            </div>

            {/* MIDDLE CARD – 28% Viewport */}
            <div className="h-[28%] min-h-0">
              <IdentityCard
                analysis={analysis}
                isLoading={appState === 'loading'}
                isIdle={appState === 'idle'}
                onShareWhatsApp={handleShareWhatsApp}
              />
            </div>

            {/* BOTTOM CARD – 44% Viewport */}
            <div className="h-[44%] min-h-0">
              <SolutionCard
                analysis={analysis}
                isLoading={appState === 'loading'}
                isIdle={appState === 'idle'}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
