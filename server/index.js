import 'dotenv/config';
import express    from 'express';
import cors       from 'cors';
import path       from 'path';
import fs         from 'fs';
import { fileURLToPath } from 'url';
import analyzeRouter from './routes/analyze.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? false
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', analyzeRouter);

// Health-check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback 404 handler for any unmatched /api/* requests (Always return JSON)
app.all('/api/*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found. Please verify the request URL.',
  });
});

// ── Serve React build (Single Server for both Frontend + Backend) ─────────
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  console.log(`[Server] Serving production bundle from: ${distPath}`);
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── Global Error Handler (Guarantees JSON output) ─────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Global Server Error]', err);
  const status = err.status || err.statusCode || 500;
  const message = typeof err === 'string' ? err : (err?.message || 'Internal server error occurred.');
  res.status(status).json({
    success: false,
    error: String(message),
  });
});

// Start Express server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🏥  Chikitsak server running on http://localhost:${PORT}`);
    console.log(`   Mode : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   API  : http://localhost:${PORT}/api/analyze\n`);
  });
}

export default app;
