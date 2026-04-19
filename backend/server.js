import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import chatRouter from './routes/chat.js';
import { clients } from './services/streamService.js';
import { getMemoryStats } from './services/memoryService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Request counter for /metrics ─────────────────────────
let totalRequests = 0;
let totalAnalyzed = 0;

// ── Middleware ────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use((req, res, next) => { totalRequests++; next(); });

// ── SSE Real-time Feed ────────────────────────────────────
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  clients.push(res);
  console.log(`📡 SSE: New client connected (${clients.length} total)`);
  req.on('close', () => {
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
    console.log(`📡 SSE: Client disconnected (${clients.length} remaining)`);
  });
});

// ── Routes ────────────────────────────────────────────────
app.use('/analyze', analyzeRouter);
app.use('/chat', chatRouter);

// ── GET /metrics — System Metrics Dashboard ───────────────
app.get('/metrics', (req, res) => {
  const memStats = getMemoryStats();
  res.json({
    engine: "NexusGuard v2.1",
    status: "ONLINE",
    totalRequests,
    activeSSEClients: clients.length,
    uptime: Math.floor(process.uptime()),
    uptimeFormatted: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m ${Math.floor(process.uptime() % 60)}s`,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    slackConfigured: !!process.env.SLACK_WEBHOOK_URL,
    ...memStats,
    timestamp: new Date().toISOString()
  });
});

// ── Health Check ──────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', ts: Date.now() });
});

// ── Start ─────────────────────────────────────────────────
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 NexusGuard API Backend running on http://localhost:${PORT}`);
  console.log(`   → /analyze       — Main analysis pipeline`);
  console.log(`   → /analyze/webhook — External integration hook`);
  console.log(`   → /chat          — AI SRE chat`);
  console.log(`   → /stream        — SSE live feed`);
  console.log(`   → /metrics       — System metrics`);
  console.log(`   → /health        — Health check`);
});
