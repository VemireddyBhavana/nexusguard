import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import chatRouter from './routes/chat.js';
import { clients, broadcast } from './services/streamService.js';
import { getMemoryStats } from './services/memoryService.js';
import { ingestFact, getAllLearnedFacts } from './services/knowledgeService.js';
import os from 'os';

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
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const memUsagePercent = Math.round(((totalMem - freeMem) / totalMem) * 100);
  
  const cpus = os.cpus();
  const cpuModel = cpus[0].model;
  const load = os.loadavg(); // [1m, 5m, 15m]

  res.json({
    engine: "NexusGuard v2.1",
    status: "ONLINE",
    hostname: os.hostname(),
    platform: os.platform(),
    totalRequests,
    activeSSEClients: clients.length,
    uptime: Math.floor(process.uptime()),
    systemUptime: Math.floor(os.uptime()),
    uptimeFormatted: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m ${Math.floor(process.uptime() % 60)}s`,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    systemMemory: {
        free: Math.round(freeMem / 1024 / 1024),
        total: Math.round(totalMem / 1024 / 1024),
        percent: memUsagePercent
    },
    cpu: {
        model: cpuModel,
        cores: cpus.length,
        load1m: load[0].toFixed(2)
    },
    slackConfigured: !!process.env.SLACK_WEBHOOK_URL,
    networkUptime: "99.998%",
    costsProtected: 842500 + Math.floor(totalAnalyzed * 1250),
    components: [
      { 
        id: "perception", 
        name: "👁️ Perception Agent", 
        status: "OPERATIONAL", 
        latency: "12ms", 
        dot: "#4ade80",
        role: "Data Ingestion & Monitoring",
        desc: "Continuously scans infrastructure logs, URLs, and telemetry streams for anomalies using pattern-matching and heuristic analysis."
      },
      { 
        id: "manager", 
        name: "⚙️ Manager Agent", 
        status: "OPERATIONAL", 
        latency: "8ms", 
        dot: "#4ade80",
        role: "Orchestration & Routing",
        desc: "The brain of the operation. Determines which specialized agents to dispatch based on the severity and type of the detected anomaly."
      },
      { 
        id: "rag", 
        name: "📚 RAG Retrieval Engine", 
        status: "OPERATIONAL", 
        latency: "45ms", 
        dot: "#4ade80",
        role: "Knowledge Ingestion",
        desc: "Retrieves context from internal runbooks and documentation to ground the AI's reasoning in company-specific best practices."
      },
      { 
        id: "reasoning_oa", 
        name: "🔬 AI Reasoning (OpenAI)", 
        status: "OPERATIONAL", 
        latency: `${800 + Math.random() * 100}ms`, 
        dot: "#4ade80",
        role: "Deep Analysis & Logic",
        desc: "Uses large language models to perform complex root-cause analysis and generate non-obvious remediation strategies."
      },
      { 
        id: "action", 
        name: "🛠️ Action Agent", 
        status: "OPERATIONAL", 
        latency: "22ms", 
        dot: "#4ade80",
        role: "Remediation & Execution",
        desc: "Executes verified fixes, interacts with cloud provider APIs, and dispatches notifications via Slack, PagerDuty, or Email."
      },
      { 
        id: "memory", 
        name: "🧠 Memory Agent", 
        status: "OPERATIONAL", 
        latency: "5ms", 
        dot: "#4ade80",
        role: "Long-term Persistence",
        desc: "Stores incident history and agent decisions to allow the system to learn from past successes and failures."
      }
    ],
    ...memStats,
    timestamp: new Date().toISOString()
  });
});

// ── DYNAMIC DATA STORES ─────────────────────────────────────────
const AUDIT_LOGS = [
  { ts: new Date().toISOString(), user: "Admin (AD)", action: "System Initialization", impact: "GLOBAL", status: "SUCCESS" },
  { ts: new Date().toISOString(), user: "Perception Hub", action: "Node_01 Handshake", impact: "INFRA", status: "STABLE" }
];

export function addAuditLog(user, action, impact, status) {
    AUDIT_LOGS.unshift({ ts: new Date().toISOString(), user, action, impact, status });
    if (AUDIT_LOGS.length > 50) AUDIT_LOGS.pop();
}

const KNOWLEDGE_SOURCES = [
  { id: 1, name: "Infrastructure Runbook 2026.pdf", type: "PDF", relevance: "98%", status: "INDEXED" },
  { id: 2, name: "Stripe API Documentation", type: "URL", relevance: "85%", status: "SYNCED" },
  { id: 3, name: "Cluster-Alpha Security Specs", type: "DOC", relevance: "92%", status: "INDEXED" }
];

// ── NEW ENTERPRISE ENDPOINTS ──────────────────────────────────

// 1. TOPOLOGY
app.get('/topology', (req, res) => {
  const host = os.hostname();
  const arch = os.arch();
  res.json({
    nodes: [
      { 
        id: 'cloud', 
        label: 'Cloud Uplink', 
        type: 'cloud', 
        x: 400, y: 50,
        role: "Global Edge Gateway",
        desc: "Primary entry point for all external traffic. Performs DDoS mitigation and global TLS termination."
      },
      { 
        id: 'lb', 
        label: 'Global Load Balancer', 
        type: 'gateway', 
        x: 400, y: 150,
        role: "Traffic Orchestration",
        desc: "Distributes incoming requests across the healthy service nodes using a weighted round-robin algorithm."
      },
      { 
        id: 'api', 
        label: `${host} (${arch})`, 
        type: 'service', 
        x: 400, y: 250,
        role: "Main API Cluster",
        desc: "The primary compute cluster hosting the NexusGuard reasoning engine and core API services."
      },
      { 
        id: 'srv1', 
        label: 'Auth Service', 
        type: 'microservice', 
        x: 250, y: 350,
        role: "Identity Management",
        desc: "Handles JWT validation, OAuth2 flows, and user permission checks for all incoming requests."
      },
      { 
        id: 'srv2', 
        label: 'Payment Gateway', 
        type: 'microservice', 
        x: 550, y: 350,
        role: "Transaction Processor",
        desc: "Securely bridges with third-party payment providers like Stripe and PayPal for transaction settlement."
      },
      { 
        id: 'db1', 
        label: 'Postgres Cluster', 
        type: 'database', 
        x: 250, y: 450,
        role: "Primary Persistent Store",
        desc: "Highly available PostgreSQL cluster with synchronous replication for mission-critical audit and user data."
      },
      { 
        id: 'db2', 
        label: 'Memory Cache', 
        type: 'database', 
        x: 550, y: 450,
        role: "High-Speed Key-Value Store",
        desc: "Redis-backed caching layer used for session management and real-time anomaly pattern lookups."
      },
      { 
        id: 'agent', 
        label: 'NexusGuard Engine', 
        type: 'ai', 
        x: 400, y: 400,
        role: "Autonomous SRE Agent",
        desc: "Multi-agent reasoning engine that monitors the entire topology and executes autonomous remediation steps."
      }
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
  const hasKeys = !!(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY);
  const score = hasKeys ? 98.4 : 64.2;
  res.json({
    complianceScore: `${score}%`,
    vulnerabilities: { 
        critical: hasKeys ? 0 : 2, 
        high: hasKeys ? 1 : 5, 
        medium: 12, 
        low: 45 
    },
    lastScan: new Date().toISOString(),
    threatMatrix: Array.from({ length: 48 }, () => Math.random() > (hasKeys ? 0.95 : 0.8) ? 1 : 0)
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

import { probeURL } from './services/probeService.js';

// 5. BILLING & ROI
app.get('/billing', (req, res) => {
  res.json({
    roi: '847%',
    totalSaved: '$1,247,500',
    mttrReduction: '94%',
    incidentsAutoResolved: 342,
    costPerIncident: '$12.40',
    sparkline: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50 + 50))
  });
});


// 6. PROACTIVE URL SCANNER [NEW]
app.post('/scan-url', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required for probing." });
  
  try {
    const diagnostic = await probeURL(url);
    res.json(diagnostic);
  } catch (error) {
    res.status(500).json({ error: "Prober Engine Failure", details: error.message });
  }
});

// 7. KNOWLEDGE INGESTION [NEW - Step 7 Blueprint]
app.post('/ingest-knowledge', (req, res) => {
    const { content, category } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required for ingestion." });
    const fact = ingestFact(content, category);
    addAuditLog("SRE User", `Ingested Knowledge: ${category}`, "KNOWLEDGE", "SUCCESS");
    res.json({ success: true, message: "Brain expanded. Runbook context ingested.", fact });
});

app.get('/learned-facts', (req, res) => {
    res.json(getAllLearnedFacts());
});

// ── AUTONOMOUS ANOMALY GENERATOR ─────────────────────────────
// Periodically emits system deviations to simulate real-world infrastructure activity
setInterval(() => {
  const anomalies = [
    { type: 'LATENCY', level: 'MEDIUM', component: 'Payment Gateway', delta: '450ms' },
    { type: 'STORAGE', level: 'LOW', component: 'Image CDN', delta: '88% Capacity' },
    { type: 'NETWORK', level: 'MINIMAL', component: 'Internal Bridge', delta: 'Packet Drop 0.02%' }
  ];
  const choice = anomalies[Math.floor(Math.random() * anomalies.length)];
  broadcast({
    type: 'ANOMALY_DETECTED',
    timestamp: new Date().toISOString(),
    ...choice,
    agent: 'Guardian Perception Node'
  });
}, 90000); // Every 90 seconds

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


// ── BACKWARD COMPATIBILITY & 404 FIXES ─────────────────────────
app.get('/api/status', (req, res) => res.redirect('/metrics'));
app.get('/api/system-info', (req, res) => res.redirect('/topology'));
app.get('/api/health', (req, res) => res.redirect('/metrics'));
