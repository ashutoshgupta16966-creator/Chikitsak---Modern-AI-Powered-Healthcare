import { useState, useCallback, useEffect } from 'react'
import { analyzeImage, fileToBase64 } from './api/client'
import { formatErrorMessage } from './utils/errorUtils'
import AppHeader            from './components/AppHeader'
import HeroIntroCard        from './components/HeroIntroCard'
import ScannerCard          from './components/ScannerCard'
import ScanHistoryDashboard from './components/ScanHistoryDashboard'
import ResultView           from './components/ResultView'
import ErrorBanner          from './components/ErrorBanner'

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
      if (saved) {
        setHistory(JSON.parse(saved))
      }
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
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch (err) {
      console.warn('Failed to clear localStorage:', err)
    }
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
      const base64Uri = await fileToBase64(file)
      const result    = await analyzeImage(base64Uri)
      setAnalysis(result)
      setAppState('result')

      // Save to localStorage history
      saveToHistory(result, preview)
    } catch (err) {
      console.error('[App] Image analysis error:', err)
      setError(formatErrorMessage(err))
      setAppState('error')
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
    if (item.previewUri) {
      setImageUrl(item.previewUri)
    }
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

    const warningsFormatted = (analysis.warnings || [])
      .map((w) => `• ${w}`)
      .join('\n')

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
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-slate-100 overflow-hidden select-none relative font-sans text-slate-900 shadow-2xl border-x border-slate-300">

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
      <main className="flex-1 min-h-0 overflow-hidden relative z-10 flex flex-col bg-slate-100">

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
          /* ── CLEAN HOMEPAGE VIEW ───────────────────────────────── */
          <div className="card-scroll flex-1 p-3.5 space-y-3.5">
            {showHistory ? (
              /* History Dashboard View */
              <ScanHistoryDashboard
                history={history}
                onSelectHistoryItem={handleSelectHistoryItem}
                onClearHistory={handleClearHistory}
              />
            ) : (
              /* Clean Home View */
              <>
                {/* 1. Revamped Hero Intro Card */}
                <HeroIntroCard />

                {/* 2. Main Scan Trigger Card (CTA Box + Dual Modal) */}
                <ScannerCard
                  imageUrl={imageUrl}
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
