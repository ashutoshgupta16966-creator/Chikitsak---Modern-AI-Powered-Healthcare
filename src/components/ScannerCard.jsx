import { useRef, useState } from 'react'
import { Camera, Image as ImageIcon, X, Sparkles, Scan, Clock, Zap } from 'lucide-react'

/**
 * ScannerCard – Royal dark glass scanner trigger with Camera vs Gallery modal.
 */
export default function ScannerCard({ isLoading, onImageSelected }) {
  const [showOptions, setShowOptions] = useState(false)
  const cameraInputRef  = useRef(null)
  const galleryInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onImageSelected(file)
    e.target.value = ''
  }

  const openModal  = () => setShowOptions(true)
  const closeModal = () => setShowOptions(false)
  const triggerCamera  = () => { closeModal(); cameraInputRef.current?.click() }
  const triggerGallery = () => { closeModal(); galleryInputRef.current?.click() }

  return (
    <>
      {/* Hidden File Inputs */}
      <input ref={cameraInputRef}  type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} aria-label="Capture with camera" />
      <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} aria-label="Upload from gallery" />

      {/* Outer glass card */}
      <div className="relative rounded-2xl bg-[#181130]/90 border border-purple-500/20 backdrop-blur-xl shadow-2xl shadow-purple-950/60 overflow-hidden">

        {/* Gold accent badge floating at top */}
        <div className="flex justify-center pt-3.5 pb-0">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[10px] uppercase tracking-widest px-3.5 py-1 rounded-full shadow-lg shadow-amber-500/25">
            <Zap size={10} strokeWidth={3} />
            AI Medicine Scanner
          </span>
        </div>

        {isLoading ? (
          /* ── Loading State ─────────────────────────────────────────── */
          <div className="min-h-52 flex flex-col items-center justify-center p-5 text-center space-y-2.5">
            <ScanLineAnimation />
            <p className="text-emerald-400 text-sm font-extrabold tracking-widest animate-pulse flex items-center gap-2 mt-1">
              <Sparkles size={15} className="animate-spin" />
              Analyzing Medicine Image...
            </p>
            <p className="font-devanagari text-purple-300 text-xs font-semibold">
              एआई स्कैन जारी है, कृपया प्रतीक्षा करें…
            </p>
            {/* Cold-start notice */}
            <div className="flex items-center justify-center gap-1.5 bg-purple-950/80 border border-amber-500/20 text-amber-300 text-[11px] font-medium px-3 py-1.5 rounded-xl max-w-xs text-center shadow-inner">
              <Clock size={12} className="text-amber-400 shrink-0" />
              <span className="font-devanagari leading-snug">
                पहली बार में थोड़ा टाइम लग सकता है, सर्वर स्टार्ट हो रहा है…
              </span>
            </div>
          </div>
        ) : (
          /* ── Main Scan Trigger ─────────────────────────────────────── */
          <button
            onClick={openModal}
            className="w-full p-5 flex flex-col items-center justify-center gap-3.5 hover:bg-purple-900/20 active:scale-[0.99] transition-all group"
          >
            {/* Glowing emerald/gold CTA button ring */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform relative">
              <Camera size={30} strokeWidth={2.2} className="text-slate-950" />
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow">
                <Scan size={12} />
              </div>
            </div>

            <div className="text-center px-2">
              <h3 className="text-white font-black text-xl tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
                Scan Medicine or Lab Report
              </h3>
              <p className="font-devanagari text-amber-300/90 font-bold text-sm mt-1 leading-snug">
                📸 दवा या रिपोर्ट की फोटो लें / अपलोड करें
              </p>
              <p className="text-purple-300/70 font-semibold text-xs mt-1">
                Medicine Strips · Boxes · Prescriptions · Lab Reports
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Dual Selection Modal */}
      <OptionsModal
        isOpen={showOptions}
        onClose={closeModal}
        onCamera={triggerCamera}
        onUpload={triggerGallery}
      />
    </>
  )
}

/** Bottom-sheet dark glass modal */
function OptionsModal({ isOpen, onClose, onCamera, onUpload }) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-[#130e24]/95 border-t border-purple-700/40 shadow-2xl px-5 pt-5 pb-8 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-purple-700/50 rounded-full mx-auto mb-4" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 border-b border-purple-800/40 pb-3">
          <div>
            <h2 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
              Select Photo Source
              <Sparkles size={16} className="text-amber-400" />
            </h2>
            <p className="font-devanagari text-purple-300 font-bold text-xs mt-0.5">
              फोटो का माध्यम चुनें
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-purple-900/60 hover:bg-purple-800 text-purple-300 flex items-center justify-center transition-colors"
          >
            <X size={17} strokeWidth={2.5} />
          </button>
        </div>

        {/* Option Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Camera */}
          <button
            onClick={onCamera}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/60 hover:bg-emerald-900/50 active:scale-95 p-4 text-center transition-all shadow-md group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-tight">Take Photo</p>
              <p className="font-devanagari text-emerald-400 font-bold text-xs mt-0.5">कैमरा खोलें</p>
            </div>
          </button>

          {/* Gallery */}
          <button
            onClick={onUpload}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/30 active:scale-95 p-4 text-center transition-all shadow-md group"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-white font-extrabold text-sm leading-tight">Upload File</p>
              <p className="font-devanagari text-amber-400 font-bold text-xs mt-0.5">गैलरी / फ़ाइल</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function ScanLineAnimation() {
  return (
    <div className="w-48 h-20 relative border border-emerald-500/50 rounded-xl overflow-hidden bg-[#0d0920]">
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br" />
      <div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 shadow-lg shadow-emerald-400/50"
        style={{ animation: 'scanline 1.6s ease-in-out infinite', top: 0 }}
      />
    </div>
  )
}
