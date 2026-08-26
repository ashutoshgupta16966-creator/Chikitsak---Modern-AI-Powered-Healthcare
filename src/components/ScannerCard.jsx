import { useRef, useState } from 'react'
import { Camera, Upload, X, Sparkles, Image as ImageIcon } from 'lucide-react'

/**
 * ScannerCard – TOP CARD (30% viewport)
 * Provides dual camera/gallery file selection modal and scan line animation.
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
      {/* Hidden Inputs */}
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
        aria-label="Upload image from device"
      />

      {/* Card Container */}
      <div className="relative h-full rounded-2xl glass-panel border border-emerald-200/60 shadow-xl overflow-hidden">
        {imageUrl ? (
          /* Preview state */
          <div className="relative h-full flex items-center justify-center bg-emerald-950/20 backdrop-blur-sm">
            <img
              src={imageUrl}
              alt="Medicine preview"
              className="h-full w-full object-contain p-1"
            />

            {/* Scanning Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/70 backdrop-blur-md z-10">
                <ScanLineAnimation />
                <p className="text-emerald-200 text-xs font-bold mt-2.5 tracking-widest animate-pulse font-devanagari flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-400 animate-spin" />
                  AI स्कैन जारी है…
                </p>
              </div>
            )}

            {/* Re-scan button */}
            {!isLoading && (
              <button
                onClick={openModal}
                className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-emerald-900/80 hover:bg-emerald-800 active:bg-emerald-950 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border border-emerald-500/30 transition-all"
              >
                <Camera size={13} className="text-emerald-300" />
                <span>बदलें</span>
              </button>
            )}
          </div>
        ) : (
          /* Idle trigger button */
          <button
            onClick={openModal}
            className="upload-btn h-full w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/90 via-emerald-50/70 to-teal-50/90 hover:from-emerald-100/90 hover:to-teal-100/90 active:scale-[0.99] transition-all group"
          >
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Camera size={26} strokeWidth={2} />
            </div>

            <div className="text-center px-4">
              <p className="text-emerald-900 font-bold text-sm leading-tight flex items-center justify-center gap-1.5 font-devanagari">
                <span>📸 दवा या रिपोर्ट की फोटो लें</span>
              </p>
              <p className="text-gray-500 text-[10px] mt-1 leading-snug font-medium">
                Strip · Box · Doctor Prescriptions · Lab Reports
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Options Modal */}
      <OptionsModal
        isOpen={showOptions}
        onClose={closeModal}
        onCamera={triggerCamera}
        onUpload={triggerGallery}
      />
    </>
  )
}

/** Bottom sheet modal for selecting Camera vs Gallery */
function OptionsModal({ isOpen, onClose, onCamera, onUpload }) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/60 backdrop-blur-md animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mb-0 rounded-t-3xl bg-white/95 backdrop-blur-xl shadow-2xl border-t border-emerald-200/80 px-5 pt-5 pb-8 animate-[slideUp_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900 font-bold text-base leading-tight font-devanagari flex items-center gap-2">
              <span>फोटो का स्रोत चुनें</span>
              <Sparkles size={14} className="text-emerald-600" />
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Select your medicine image source
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCamera}
            className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-emerald-300/80 bg-gradient-to-b from-emerald-50 to-teal-50/80 hover:from-emerald-100 hover:to-teal-100 active:scale-95 p-4 text-center transition-all shadow-sm group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="font-devanagari text-gray-900 font-bold text-sm leading-tight">
                कैमरा खोलें
              </p>
              <p className="text-emerald-700 text-[10px] font-semibold mt-0.5">
                Take Photo / Camera
              </p>
            </div>
          </button>

          <button
            onClick={onUpload}
            className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-teal-300/80 bg-gradient-to-b from-teal-50 to-cyan-50/80 hover:from-teal-100 hover:to-cyan-100 active:scale-95 p-4 text-center transition-all shadow-sm group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon size={24} strokeWidth={2} />
            </div>
            <div>
              <p className="font-devanagari text-gray-900 font-bold text-sm leading-tight">
                गैलरी / फ़ाइल
              </p>
              <p className="text-teal-700 text-[10px] font-semibold mt-0.5">
                Upload File / Gallery
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
    <div className="w-44 h-24 relative border-2 border-emerald-400/80 rounded-xl overflow-hidden bg-emerald-950/40">
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
