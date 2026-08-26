import 'dotenv/config';
import express    from 'express';
import cors       from 'cors';
import path       from 'path';
import { fileURLToPath } from 'url';
import analyzeRouter from './routes/analyze.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? false
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', analyzeRouter);

// Health-check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Serve React build in production ────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── Global Error Handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`\n🏥  Chikitsak server running on http://localhost:${PORT}`);
  console.log(`   Mode : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API  : http://localhost:${PORT}/api/analyze\n`);
});
