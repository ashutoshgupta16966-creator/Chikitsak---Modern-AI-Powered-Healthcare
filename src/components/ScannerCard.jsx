import { useRef } from 'react'

/**
 * ScannerCard – TOP CARD (30% viewport)
 *
 * Displays:
 *  • Upload / capture button (file input hidden behind it)
 *  • Thumbnail preview of the selected image
 *  • Animated scanning overlay while loading
 */
export default function ScannerCard({ imageUrl, isLoading, onImageSelected }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onImageSelected(file)
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  return (
    <div className="relative h-full rounded-2xl bg-white shadow-md border border-emerald-100 overflow-hidden">

      {/* ── Hidden file input ────────────────────────────────────── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Select medicine image"
      />

      {/* ── Image preview (when available) ────────────────────────── */}
      {imageUrl ? (
        <div className="relative h-full flex items-center justify-center bg-black/5">
          <img
            src={imageUrl}
            alt="Medicine preview"
            className="h-full w-full object-contain"
          />

          {/* Scanning animation overlay while loading */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
              <ScanLineAnimation />
              <p className="text-white text-xs font-semibold mt-2 tracking-widest animate-pulse">
                स्कैन हो रही है…
              </p>
            </div>
          )}

          {/* Re-scan tap target (top-right corner) */}
          {!isLoading && (
            <button
              onClick={triggerFileInput}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white
                         text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm
                         transition-colors duration-150"
            >
              📷 बदलें
            </button>
          )}
        </div>
      ) : (
        /* ── Empty state: big upload button ──────────────────────── */
        <button
          onClick={triggerFileInput}
          className="upload-btn h-full w-full flex flex-col items-center justify-center gap-2
                     bg-gradient-to-br from-emerald-50 to-teal-50
                     hover:from-emerald-100 hover:to-teal-100
                     active:scale-95 transition-all duration-200"
        >
          {/* Camera icon */}
          <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center
                          border-2 border-dashed border-brand-primary/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-brand-primary"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>

          <div className="text-center px-4">
            <p className="text-brand-primary font-bold text-sm leading-tight">
              📸 फोटो लें / अपलोड करें
            </p>
            <p className="text-gray-400 text-[10px] mt-0.5 leading-snug">
              Medicine strip · Lab report · Box
            </p>
          </div>
        </button>
      )}
    </div>
  )
}

/** Animated horizontal scan line SVG overlay */
function ScanLineAnimation() {
  return (
    <div className="w-40 h-24 relative border-2 border-emerald-400 rounded-lg overflow-hidden">
      {/* Corner markers */}
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br" />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-0.5 bg-emerald-400/80"
        style={{
          animation: 'scanline 1.6s ease-in-out infinite',
          top: 0,
        }}
      />

      <style>{`
        @keyframes scanline {
          0%   { top: 10%; opacity: 1; }
          50%  { top: 85%; opacity: 0.7; }
          100% { top: 10%; opacity: 1; }
        }
      `}</style>
    </div>
  )
}
