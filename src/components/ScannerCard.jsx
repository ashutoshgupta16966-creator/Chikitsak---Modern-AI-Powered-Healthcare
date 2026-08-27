import { useRef, useState } from 'react'
import { Camera, Upload, X, Sparkles, Image as ImageIcon, Scan, Clock } from 'lucide-react'

/**
 * ScannerCard – Main Scanner trigger box with Camera vs Gallery selection modal.
 */
export default function ScannerCard({ imageUrl, isLoading, onImageSelected }) {
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
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Capture photo with camera"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload image from gallery"
      />

      {/* Main Trigger Card Container */}
      <div className="relative rounded-2xl bg-white border-2 border-emerald-500/30 shadow-xl overflow-hidden text-slate-900">
        {isLoading ? (
          /* Loading State Overlay */
          <div className="min-h-56 flex flex-col items-center justify-center bg-slate-900 p-5 text-center z-10 space-y-2.5">
            <ScanLineAnimation />
            <p className="text-emerald-300 text-sm font-extrabold tracking-widest animate-pulse flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400 animate-spin" />
              <span>Analyzing Medicine Image...</span>
            </p>
            <p className="text-emerald-200/90 font-devanagari text-xs font-semibold">
              एआई स्कैन जारी है, कृपया प्रतीक्षा करें…
            </p>

            {/* Cold Start User Notice */}
            <div className="flex items-center justify-center gap-1.5 bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-[11px] font-medium px-3 py-1.5 rounded-xl max-w-xs text-center shadow-inner mt-1">
              <Clock size={13} className="text-emerald-400 shrink-0" />
              <span className="font-devanagari leading-snug">
                पहली बार में थोड़ा टाइम लग सकता है, सर्वर स्टार्ट हो रहा है…
              </span>
            </div>
          </div>
        ) : (
          /* Main Homepage Scan Action Trigger */
          <button
            onClick={openModal}
            className="upload-btn w-full p-5 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 active:scale-[0.99] transition-all group"
          >
            {/* Glowing Green Action Button Ring */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center group-hover:scale-105 transition-transform relative">
              <Camera size={32} strokeWidth={2} />
              <div className="absolute -bottom-1 -right-1 bg-white text-emerald-700 p-1 rounded-full shadow">
                <Scan size={14} />
              </div>
            </div>

            <div className="text-center px-2">
              {/* PRIMARY TITLE – BOLD DARK SLATE */}
              <h3 className="text-slate-900 font-extrabold text-xl tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
                Scan Medicine or Lab Report
              </h3>
              {/* HINDI SUBTITLE – READABLE EMERALD/DARK */}
              <p className="font-devanagari text-emerald-800 font-bold text-sm mt-1 leading-snug">
                📸 दवा या रिपोर्ट की फोटो लें / अपलोड करें
              </p>
              {/* DETAIL SUBTITLE */}
              <p className="text-slate-600 font-semibold text-xs mt-1">
                Medicine Strips · Boxes · Prescriptions · Lab Reports
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Dual Selection Options Modal */}
      <OptionsModal
        isOpen={showOptions}
        onClose={closeModal}
        onCamera={triggerCamera}
        onUpload={triggerGallery}
      />
    </>
  )
}

/** Bottom sheet action modal for choosing Camera vs Gallery */
function OptionsModal({ isOpen, onClose, onCamera, onUpload }) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mb-0 rounded-t-3xl bg-white shadow-2xl border-t border-slate-200 px-5 pt-5 pb-8 animate-[slideUp_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-slate-900 font-extrabold text-lg tracking-tight leading-tight flex items-center gap-2">
              <span>Select Photo Source</span>
              <Sparkles size={18} className="text-emerald-600" />
            </h2>
            <p className="font-devanagari text-emerald-800 font-bold text-xs mt-0.5">
              फोटो का माध्यम चुनें (Camera or Gallery)
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Dual Option Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Option 1: Take Photo / Camera */}
          <button
            onClick={onCamera}
            className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 active:scale-95 p-4 text-center transition-all shadow-sm group"
          >
            <div className="w-13 h-13 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-slate-900 font-extrabold text-sm leading-tight">
                Take Photo
              </p>
              <p className="font-devanagari text-emerald-800 font-bold text-xs mt-0.5">
                कैमरा खोलें
              </p>
            </div>
          </button>

          {/* Option 2: Upload File / Gallery */}
          <button
            onClick={onUpload}
            className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-teal-500/40 bg-teal-50 hover:bg-teal-100 active:scale-95 p-4 text-center transition-all shadow-sm group"
          >
            <div className="w-13 h-13 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-slate-900 font-extrabold text-sm leading-tight">
                Upload File
              </p>
              <p className="font-devanagari text-teal-800 font-bold text-xs mt-0.5">
                गैलरी / फ़ाइल
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function ScanLineAnimation() {
  return (
    <div className="w-48 h-24 relative border-2 border-emerald-400 rounded-xl overflow-hidden bg-slate-950">
      <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
      <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
      <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br" />

      <div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-lg shadow-emerald-400"
        style={{ animation: 'scanline 1.6s ease-in-out infinite', top: 0 }}
      />
    </div>
  )
}
