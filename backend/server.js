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
    networkUptime: "99.998%",
    costsProtected: 842500 + Math.floor(totalAnalyzed * 1250),
    components: [
      { id: "perception", name: "👁️ Perception Agent", status: "OPERATIONAL", latency: "12ms", dot: "#4ade80" },
      { id: "manager", name: "⚙️ Manager Agent", status: "OPERATIONAL", latency: "8ms", dot: "#4ade80" },
      { id: "rag", name: "📚 RAG Retrieval Engine", status: "OPERATIONAL", latency: "45ms", dot: "#4ade80" },
      { id: "reasoning_oa", name: "🔬 AI Reasoning (OpenAI)", status: "OPERATIONAL", latency: `${800 + Math.random() * 100}ms`, dot: "#4ade80" },
      { id: "reasoning_gem", name: "✨ AI Reasoning (Gemini)", status: "DEGRADED", latency: "1.2s", dot: "#fbbf24" },
      { id: "action", name: "🛠️ Action Agent", status: "OPERATIONAL", latency: "22ms", dot: "#4ade80" },
      { id: "memory", name: "🧠 Memory Agent", status: "OPERATIONAL", latency: "5ms", dot: "#4ade80" },
      { id: "sse", name: "📡 SSE Event Stream", status: "OPERATIONAL", latency: "<1ms", dot: "#4ade80" }
    ],
    ...memStats,
    timestamp: new Date().toISOString()
  });
});

// ── MOCK DATA STORES ──────────────────────────────────────────
const AUDIT_LOGS = [
  { ts: new Date().toISOString(), user: "Admin (AD)", action: "System Initialization", impact: "GLOBAL", status: "SUCCESS" },
  { ts: new Date().toISOString(), user: "Perception Hub", action: "Node_01 Handshake", impact: "INFRA", status: "STABLE" }
];

const KNOWLEDGE_SOURCES = [
  { id: 1, name: "Infrastructure Runbook 2026.pdf", type: "PDF", relevance: "98%", status: "INDEXED" },
  { id: 2, name: "Stripe API Documentation", type: "URL", relevance: "85%", status: "SYNCED" },
  { id: 3, name: "Cluster-Alpha Security Specs", type: "DOC", relevance: "92%", status: "INDEXED" }
];

// ── NEW ENTERPRISE ENDPOINTS ──────────────────────────────────

// 1. TOPOLOGY
app.get('/topology', (req, res) => {
  res.json({
    nodes: [
      { id: 'cloud', label: 'AWS Cloud', type: 'cloud', x: 400, y: 50 },
      { id: 'lb', label: 'Load Balancer', type: 'gateway', x: 400, y: 150 },
      { id: 'api', label: 'API Gateway', type: 'service', x: 400, y: 250 },
      { id: 'srv1', label: 'Auth Service', type: 'microservice', x: 250, y: 350 },
      { id: 'srv2', label: 'Payment Service', type: 'microservice', x: 550, y: 350 },
      { id: 'db1', label: 'User DB (RDS)', type: 'database', x: 250, y: 450 },
      { id: 'db2', label: 'Transaction DB', type: 'database', x: 550, y: 450 },
      { id: 'agent', label: 'Nexus Agent', type: 'ai', x: 400, y: 400 }
    ],
    links: [
      { from: 'cloud', to: 'lb' }, { from: 'lb', to: 'api' },
      { from: 'api', to: 'srv1' }, { from: 'api', to: 'srv2' },
      { from: 'srv1', to: 'db1' }, { from: 'srv2', to: 'db2' },
      { from: 'agent', to: 'api' }, { from: 'agent', to: 'cloud' }
    ]
  });
});

// 2. SECURITY
app.get('/security', (req, res) => {
  res.json({
    complianceScore: "94.2%",
    vulnerabilities: { critical: 0, high: 2, medium: 12, low: 45 },
    lastScan: new Date().toISOString(),
    threatMatrix: Array.from({ length: 48 }, () => Math.random() > 0.9 ? 1 : 0)
  });
});

// 3. AUDIT
app.get('/audit', (req, res) => {
  res.json(AUDIT_LOGS);
});

// 4. KNOWLEDGE
app.get('/knowledge', (req, res) => {
  res.json(KNOWLEDGE_SOURCES);
});

// 5. BILLING
app.get('/billing', (req, res) => {
  res.json({
    roi: "$1,245,800",
    tokensUsed: "42.5M",
    monthlyTrend: [120, 150, 180, 210, 240, 280, 310],
    savingsBreakdown: { downtime: "60%", manualLabor: "30%", infrastructure: "10%" }
  });
});

// ── Start ─────────────────────────────────────────────────
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 NexusGuard API Backend running on http://localhost:${PORT}`);
  console.log(`   → /topology      — Infrastructure map data`);
  console.log(`   → /security      — Compliance & threats`);
  console.log(`   → /audit         — Global activity ledger`);
  console.log(`   → /knowledge     — RAG source management`);
  console.log(`   → /billing       — Financial ROI tracking`);
});
