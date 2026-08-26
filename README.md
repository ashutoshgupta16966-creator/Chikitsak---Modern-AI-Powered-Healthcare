# 💊 चिकित्सक — Chikitsak (AI Medical Scanner)

> **High-Impact AI-Powered Medicine & Lab Report Scanner for India**  
> Scan medicine strips, boxes, or doctor reports → Instant bilingual analysis (Hindi & English), Web Speech audio read-aloud, smart safety cautions, color-coded expiry badges, scan history dashboard, and 1-click WhatsApp sharing.

---

## 🌟 Key Features

1. **Modern Glassmorphism Medical Dashboard**:
   - Translucent glass panels with emerald/teal gradients, glowing active badges, ambient background lighting.
   - Fits on a single 100vh viewport without page scrolling.
   - **Recent Scans Dashboard**: Stores up to 20 past medicine scans in `localStorage` with status badges, search preview, and 1-click reload.

2. **Dual Upload Selection Modal (Camera vs Gallery)**:
   - Eliminates direct camera launch issues on desktop/iOS.
   - **Option 1**: Camera capture (`capture="environment"` for mobile rear lens).
   - **Option 2**: Gallery / File system upload (`accept="image/*"`).

3. **Multi-Language Voice Output (Web Speech API)**:
   - Integrated `window.speechSynthesis` audio playback.
   - **हिंदी (Hindi) & English** language toggle for elderly or illiterate users.
   - Live soundwave audio equalizer animation when speaking.

4. **Smart Caution Alerts & Color-Coded Expiry Badges**:
   - **🔴 RED**: Expired or ≤ 7 days left (*"Turant Badlein / Danger"*).
   - **🟡 YELLOW**: 8 to 15 days left (*"Dhyan Dein / Use Soon"*).
   - **🟢 GREEN**: > 15 days left (*"Safe to Use / सुरक्षित"*).
   - High-contrast visual caution alert pills (*"Avoid alcohol"*, *"Take after food"*, *"Do not drive"*).

5. **1-Click WhatsApp Sharing**:
   - One tap formats medicine details, usage instructions, expiry status, and safety cautions into a clean WhatsApp text ready to send to doctors or family.

---

## 🚀 Quick Start

### 1. Configure Environment

Create `.env` in the root folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

> Get your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Run in Development Mode

```bash
npm run dev
```

Runs Vite dev server (`http://localhost:5173`) and Express backend (`http://localhost:3001`) concurrently.

### 3. Production Build & Server

```bash
npm run build
npm start
```

Express serves the production bundle from `dist/` on port `3001`.

---

## 🗂 Project Structure

```
chikitsak/
├── server/
│   ├── index.js                  # Express server (CORS, body parser, static serve)
│   ├── routes/
│   │   └── analyze.js            # POST /api/analyze endpoint
│   └── services/
│       └── geminiService.js      # Gemini 1.5 Flash Vision prompt & JSON parser
├── src/
│   ├── api/
│   │   └── client.js             # API client fetch wrapper with 30s timeout
│   ├── components/
│   │   ├── AppHeader.jsx         # Glassmorphism header & history toggle
│   │   ├── ScannerCard.jsx       # TOP CARD — dual camera/gallery selection modal
│   │   ├── IdentityCard.jsx      # MIDDLE CARD — bilingual names & expiry badge
│   │   ├── SolutionCard.jsx      # BOTTOM CARD — voice output, dosage & caution cards
│   │   ├── ScanHistoryDashboard.jsx # Recent medicine scan history (localStorage)
│   │   └── ErrorBanner.jsx       # Glassmorphism error alert
│   ├── App.jsx                   # Main state machine & WhatsApp share logic
│   ├── index.css                 # Glassmorphism utilities & soundwave keyframes
│   └── main.jsx                  # React 18 entry point
├── tailwind.config.js            # Devanagari font & color palette
├── vite.config.js                # Vite build & API proxy setup
└── package.json
```

---

## ⚠️ Medical Disclaimer

*Chikitsak is an AI-powered assistant designed for educational and informational purposes. Always consult a certified healthcare professional or doctor before starting or stopping any medication.*
