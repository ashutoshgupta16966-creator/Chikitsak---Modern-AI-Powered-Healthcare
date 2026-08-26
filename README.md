# 💊 चिकित्सक — Chikitsak

> **AI-powered Medicine & Lab Report Scanner for India**  
> Scan any medicine strip or lab report → Get instant Hindi/English analysis, expiry status, and dosage guidance.

---

## 📱 App Preview

Single-screen mobile layout with 3 cards:

| Card | Height | Purpose |
|------|--------|---------|
| **Scanner** | 30% | Upload / capture image → live preview |
| **Identity** | 30% | Name (EN + HI) + dynamic expiry badge (🔴🟡🟢) |
| **Solution** | 40% | Illness info + dosage instructions in Hindi |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd chikitsak
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=development
```

> **Get your API key**: [Google AI Studio](https://aistudio.google.com/app/apikey)  
> The free tier of **Gemini 1.5 Flash** is sufficient for development.

### 3. Run in Development

```bash
npm run dev
```

This runs both the Vite dev server (port `5173`) and the Express server (port `3001`) concurrently.  
Open **http://localhost:5173** in your browser (or on mobile, use your machine's IP).

### 4. Build for Production

```bash
npm run build
NODE_ENV=production npm start
```

The Express server will serve the built React app from `dist/`.

---

## 🗂 Project Structure

```
chikitsak/
├── public/
│   └── favicon.svg
├── server/
│   ├── index.js                  # Express entry point
│   ├── routes/
│   │   └── analyze.js            # POST /api/analyze
│   └── services/
│       └── geminiService.js      # Gemini Vision API client
├── src/
│   ├── api/
│   │   └── client.js             # Frontend fetch wrapper
│   ├── components/
│   │   ├── AppHeader.jsx         # Top nav bar
│   │   ├── ScannerCard.jsx       # TOP CARD — image upload
│   │   ├── IdentityCard.jsx      # MIDDLE CARD — name + expiry
│   │   ├── SolutionCard.jsx      # BOTTOM CARD — bimari + solution
│   │   └── ErrorBanner.jsx       # Error notification strip
│   ├── App.jsx                   # Root state & layout
│   ├── index.css                 # Global styles + Tailwind
│   └── main.jsx                  # React entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🔌 API Reference

### `POST /api/analyze`

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "data": {
    "englishName": "Paracetamol 500mg",
    "hindiName": "पेरासिटामॉल",
    "expiryDate": "2025-12-31",
    "daysLeft": 127,
    "expiryStatus": "GREEN",
    "bimari": "बुखार, सिरदर्द, और हल्के दर्द में राहत",
    "solution": "1 गोली सुबह, दोपहर और शाम को खाने के बाद लें। पानी के साथ निगलें। 24 घंटे में 3 से ज़्यादा गोली न लें।"
  }
}
```

**Expiry Status Logic:**
| `expiryStatus` | Condition | Badge |
|---|---|---|
| `RED` | `daysLeft <= 7` OR expired | 🔴 तुरंत बदलें |
| `YELLOW` | `8 <= daysLeft <= 15` | 🟡 ध्यान दें |
| `GREEN` | `daysLeft > 15` | 🟢 सुरक्षित |

---

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ Yes | — | Google Gemini API key |
| `PORT` | No | `3001` | Express server port |
| `NODE_ENV` | No | `development` | App environment |
| `VITE_API_URL` | No | `""` (same origin) | Override API base URL |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Backend | Node.js + Express 4 |
| AI Vision | Google Gemini 1.5 Flash |
| Fonts | Inter + Noto Sans Devanagari |

---

## ⚠️ Disclaimer

This app provides AI-generated information for **educational purposes only**.  
Always consult a qualified doctor (डॉक्टर) before taking or discontinuing any medicine.
