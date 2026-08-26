import { useState, useCallback } from 'react'
import { analyzeImage, fileToBase64 } from './api/client'
import ScannerCard      from './components/ScannerCard'
import IdentityCard     from './components/IdentityCard'
import SolutionCard     from './components/SolutionCard'
import AppHeader        from './components/AppHeader'
import ErrorBanner      from './components/ErrorBanner'

/**
 * App states:
 *  'idle'     – nothing uploaded yet
 *  'loading'  – waiting for Gemini response
 *  'result'   – analysis data available
 *  'error'    – API / network error
 */

export default function App() {
  const [appState,  setAppState]  = useState('idle')
  const [imageUrl,  setImageUrl]  = useState(null)   // object URL for preview
  const [analysis,  setAnalysis]  = useState(null)   // MedicineAnalysis object
  const [error,     setError]     = useState(null)   // string

  /** Called by ScannerCard when the user picks a file */
  const handleImageSelected = useCallback(async (file) => {
    // Revoke previous object URL to avoid memory leaks
    if (imageUrl) URL.revokeObjectURL(imageUrl)

    const preview = URL.createObjectURL(file)
    setImageUrl(preview)
    setAnalysis(null)
    setError(null)
    setAppState('loading')

    try {
      const base64Uri = await fileToBase64(file)
      const result    = await analyzeImage(base64Uri)
      setAnalysis(result)
      setAppState('result')
    } catch (err) {
      console.error('[App] Analysis failed:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setAppState('error')
    }
  }, [imageUrl])

  /** Reset everything back to idle */
  const handleReset = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(null)
    setAnalysis(null)
    setError(null)
    setAppState('idle')
  }, [imageUrl])

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gradient-to-b from-brand-bg to-emerald-50 overflow-hidden select-none">

      {/* ── App Header ────────────────────────────────────────────── */}
      <AppHeader onReset={handleReset} hasResult={appState === 'result'} />

      {/* ── Error Banner ──────────────────────────────────────────── */}
      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}

      {/* ── Three-card layout ─────────────────────────────────────── */}
      <main className="flex flex-col flex-1 gap-2 px-3 pb-3 overflow-hidden">

        {/* TOP CARD – 30% viewport */}
        <div className="h-[28%] min-h-0">
          <ScannerCard
            imageUrl={imageUrl}
            isLoading={appState === 'loading'}
            onImageSelected={handleImageSelected}
          />
        </div>

        {/* MIDDLE CARD – 30% viewport */}
        <div className="h-[28%] min-h-0">
          <IdentityCard
            analysis={analysis}
            isLoading={appState === 'loading'}
            isIdle={appState === 'idle'}
          />
        </div>

        {/* BOTTOM CARD – 40% viewport */}
        <div className="h-[38%] min-h-0">
          <SolutionCard
            analysis={analysis}
            isLoading={appState === 'loading'}
            isIdle={appState === 'idle'}
          />
        </div>

      </main>
    </div>
  )
}
