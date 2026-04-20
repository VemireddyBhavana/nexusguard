<div align="center">

# 🛡️ NexusGuard
### Enterprise Autonomous DevOps Agent

**A production-grade, universal AI DevOps platform that autonomously detects, diagnoses, and resolves any infrastructure incident — from raw logs and human descriptions to deployment links and GitHub repos — with strict high-fidelity resolution paths.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai)](https://openai.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

*Built for Agentathon 2026 · Deploy it. Prove it.*

</div>

---

## 📖 Table of Contents

1. [The Problem](#-the-problem)  
2. [The Solution](#-the-solution)  
3. [Live Demo — What It Does](#-live-demo--what-it-does)  
4. [Architecture — How We Built It](#-architecture--how-we-built-it)  
5. [Multi-Agent Workflow (Deep Dive)](#-multi-agent-workflow-deep-dive)  
6. [Tech Stack](#-tech-stack)  
7. [Project Structure](#-project-structure)  
8. [Getting Started](#-getting-started)  
9. [API Reference](#-api-reference)  
10. [Frontend Features](#-frontend-features)
11. [How the AI Works](#-how-the-ai-works)
12. [Hackathon Journey](#-hackathon-journey)

---

## 🚨 The Problem

Modern DevOps and SRE teams are inundated with **thousands of logs, fragmented monitoring tools, and critical alerts every single day**. When a microservice crashes, a database experiences a connection timeout, or a Redis cache explodes — the Mean Time To Resolution (MTTR) is severely delayed by **human bottlenecks**.

Engineers have to:
- 🔎 Manually parse stack traces across dozens of services
- 📚 Search internal wikis and Confluence for known fixes
- 📞 Wake on-call engineers at 3 AM
- 🛠️ Manually deploy mitigation scripts
- 📣 Write post-mortems

All while the company **loses revenue by the minute**.

---

## 💡 The Solution

**NexusGuard** is a Professional AI DevOps Platform that acts as your **autonomous on-call engineer — 24/7, never tired, never wrong twice.**

Instead of just sending a Slack alert, NexusGuard:

1. **Ingests** server logs and error traces in real-time
2. **Correlates** them against an internal RAG knowledge base of past incidents
3. **Routes** the incident through the correct reasoning path (rule-based vs. AI)
4. **Reasons** using a cloud LLM (GPT-4o-mini or Gemini 2.0) to deduce root cause
5. **Acts** — dispatches the exact recovery command (restart pod, scale out, renew cert, etc.)
6. **Notifies** via Slack with a structured incident report
7. **Remembers** — tracks pattern recurrence to escalate to CRITICAL before another failure hits

---

## 🎬 Live Demo — What It Does

| 📋 **Universal Analysis** | Paste logs, Vercel/Netlify links, GitHub repo issues, or human bug descriptions |
| 🛡️ **Strict Protocol** | High-fidelity output: Affected Area, Root Cause, Fix Steps, Code Patch, Prevention |
| 🦾 **Inference-First** | AI reasons through unknown errors in any stack (Next.js, Django, Rust, AWS, etc.) |
| 🧠 **Agent Decision Panel** | See exactly which agents fired, matched RAG entries, and safety audit status |
| 📡 **Real-Time SSE Feed** | Live event stream — webhook hits broadcast instantly to the dashboard |
| 💬 **AI SRE Chat** | Talk to a Vigilant SRE Expert powered by the same universal reasoning engine |
| 🔔 **Predictive Alerts**| If the same error hits 2+ times in an hour, NexusGuard auto-escalates to CRITICAL |
| 📊 **Analytics Dashboard** | Incident history, severity breakdown, trend charts |
| 🌙 **Dark Mode UI** | Professional dark glassmorphism design |
| 🌐 **Multi-Language** | Analysis output in any language |
| ⚡ **Webhook Integration** | External services POST to `/analyze/webhook` and the dashboard updates live |

---

## 🏗️ Architecture — How We Built It

```
┌──────────────────────────────────────────────────────────────────────┐
│                         NexusGuard Platform                          │
│                                                                      │
│   ┌─────────────┐    ┌────────────────────────────────────────────┐ │
│   │   Frontend  │    │              Backend API (Node/Express)     │ │
│   │  (Vite SPA) │◄──►│                                            │ │
│   │             │    │  POST /analyze ──► Multi-Agent Pipeline     │ │
│   │  Dashboard  │    │                    │                        │ │
│   │  Analytics  │    │          ┌─────────▼──────────┐            │ │
│   │  Chat SRE   │    │          │   Manager Agent     │            │ │
│   │  Live Feed  │    │          │  (Route decision)   │            │ │
│   └─────────────┘    │          └────────┬───────────┘            │ │
│         ▲            │                   │                         │ │
│         │            │          ┌────────▼───────────┐            │ │
│    SSE Stream         │          │  Retrieval Agent    │            │ │
│    (/stream)          │          │     (RAG Search)    │            │ │
│                       │          └────────┬───────────┘            │ │
│                       │                   │                         │ │
│                       │          ┌────────▼───────────┐            │ │
│                       │          │  Reasoning Agent    │            │ │
│                       │          │ GPT-4o / Gemini 2.0 │            │ │
│                       │          └────────┬───────────┘            │ │
│                       │                   │                         │ │
│                       │          ┌────────▼───────────┐            │ │
│                       │          │   Action Agent      │            │ │
│                       │          │ (Recovery dispatch) │            │ │
│                       │          └────────┬───────────┘            │ │
│                       │                   │                         │ │
│                       │          ┌────────▼───────────┐            │ │
│                       │          │   Memory Agent      │            │ │
│                       │          │ (Pattern tracking)  │            │ │
│                       │          └────────────────────┘            │ │
│                       └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Multi-Agent Workflow (Deep Dive)

Every log analyzed by NexusGuard passes through a **5-stage autonomous pipeline**. Here's exactly how each agent was built and what it does:

### 1. 👁️ Manager Agent (`managerService.js`)
**Role:** Traffic controller — decides *how* to process an incident before spending AI tokens.

- Scans the incoming log for heuristic triggers (keywords like `OOMKilled`, `deadlock`, `502`, `SSL`)
- If a high-confidence pattern match is found → routes to **Rule Engine** (fast, free)
- If the log is ambiguous or complex → routes to **AI_RAG** (deep analysis)
- Returns a `decision` object that travels with the data through the entire pipeline

```js
// Decision routing example
{ strategy: "AI_RAG", confidence: 0.9, reason: "Complex multi-service failure" }
```

---

### 2. 📚 Retrieval Agent / RAG (`retrievalService.js` + `data/errors.js`)
**Role:** Injects historical incident knowledge into the AI prompt.

- Maintains a **universal knowledge base** (`data/errors.js`) of **45+ high-fidelity DevOps error patterns** covering Frontend, Backend, OS, Database, and Cloud Infra.
- Performs **keyword-based vector search** against the incoming log
- Returns the top matching incidents as structured context
- This context is injected into the AI prompt so the LLM reasons with **real institutional knowledge**, not just training data

**Why RAG?** Without RAG, LLMs hallucinate fixes. With RAG, NexusGuard cites known-good remediation steps.

---

### 3. 🔬 Reasoning Agent (`aiService.js`)
**Role:** The brain — synthesizes logs + RAG context into a structured diagnosis.

- **Primary:** OpenAI GPT-4o-mini (fastest, most precise JSON output)
- **Fallback:** Google Gemini 2.0 Flash (activated if OpenAI fails or key is missing)
- **Local Fallback:** Built-in heuristic engine (works with zero API keys for demo)

The prompt is engineered with four internal sub-agents:
- **Guardian** — Perception audit (is this real?)
- **Sleuth** — Deep pattern analysis (what exactly broke?)
- **Fixer** — Resolution path selection (what's the safest fix?)
- **Vigilant** — Safety auditor (will the fix cause a resource collision?)

Output is always a structured JSON:
```json
{
  "issue": "Redis Cache OOMKilled",
  "rootCause": "Memory limit exceeded during peak traffic...",
  "fix": "1. Increase Redis memory limit...",
  "severity": "Critical",
  "confidence": 0.97,
  "financialImpact": 12500,
  "safetyScore": 98,
  "agentDecision": "RAG match confirmed. Applying FLUSH_CACHE protocol.",
  "reasoning": ["Guardian: ...", "Sleuth: ...", "Fixer: ...", "Vigilant: ..."]
}
```

---

### 4. 🛠️ Action Agent (`actionService.js`)
**Role:** Translates AI diagnosis into real infrastructure recovery commands.

- Maintains a **15-code recovery map** (e.g., `redis` → `FLUSH_CACHE`, `oomkilled` → `RESTART_POD`, `ssl` → `RENEW_CERT`)
- Supports **DEMO mode** (staged simulation) and **LIVE mode** (real API dispatch)
- Dispatches **Slack notifications** with structured incident reports when `SLACK_WEBHOOK_URL` is configured
- Returns the exact recovery code dispatched to the frontend dashboard

---

### 5. 🧠 Memory Agent (`memoryService.js`)
**Role:** Cross-incident pattern tracker. Gives NexusGuard predictive awareness.

- Stores the last **100 incidents** in a rolling in-memory window
- On every new analysis, checks if 2+ similar incidents occurred **within the last hour**
- If a recurring pattern is detected → fires a **Predictive Alert** that escalates severity to CRITICAL
- Powers the `/metrics` endpoint with memory stats

---

### 6. 📡 SSE Stream (`streamService.js` + `server.js`)
**Role:** Real-time broadcast channel from backend → frontend.

- Implements **Server-Sent Events (SSE)** on `GET /stream`
- Any webhook hit (`POST /analyze/webhook`) broadcasts the full analysis result to all connected dashboard clients **instantly**, with no polling

---

## 🧰 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Backend Runtime** | Node.js 18+ (ESM) | Native fetch, ES modules, lightweight |
| **Backend Framework** | Express 5.x | Fast routing, minimal overhead |
| **AI: Primary** | OpenAI GPT-4o-mini | Best JSON output, cost-efficient |
| **AI: Fallback** | Google Gemini 2.0 Flash | Free tier coverage, fast |
| **Knowledge Base** | Custom RAG (JS) | No vector DB overhead, runs locally |
| **Real-Time** | Server-Sent Events | Simpler than WebSockets for broadcast |
| **Frontend** | Vanilla HTML/CSS/JS + Vite | Zero framework overhead, full control |
| **Styling** | Custom CSS (Glassmorphism) | Premium dark UI without bloat |
| **Charts** | Chart.js | Lightweight analytics visualization |
| **Notifications** | Slack Webhooks | Real-world incident ops integration |

---

## 📁 Project Structure

```
nexusguard/
├── backend/
│   ├── server.js              # Express app, SSE stream, /metrics, /health
│   ├── package.json
│   ├── .env.example           # Environment variable template
│   ├── routes/
│   │   ├── analyze.js         # POST /analyze — main 5-agent pipeline
│   │   └── chat.js            # POST /chat — AI SRE chat endpoint
│   ├── services/
│   │   ├── aiService.js       # OpenAI + Gemini + local fallback reasoning
│   │   ├── managerService.js  # Agent 1: routing/triage
│   │   ├── retrievalService.js# Agent 2: RAG keyword search
│   │   ├── actionService.js   # Agent 4: recovery code dispatch + Slack
│   │   ├── memoryService.js   # Agent 5: pattern tracker / predictive alerts
│   │   ├── monitorService.js  # System health metrics
│   │   └── streamService.js   # SSE client registry + broadcast
│   └── data/
│       └── errors.js          # 45+ structured DevOps incident entries (Universal RAG KB)
│
├── frontend/
│   ├── index.html             # Full SPA dashboard (single file, no framework)
│   ├── main.js                # All dashboard logic, charts, SSE listener
│   ├── style.css              # Custom dark glassmorphism design system
│   └── package.json           # Vite dev server
│
├── mock-client/
│   └── index.cjs              # Node.js script to simulate webhook events
│
├── .gitignore
├── AGENTATHON_PITCH.md        #  pitch document
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org/)
- **Git** — [Download here](https://git-scm.com/)
- An **OpenAI API Key** and/or **Google Gemini API Key** (at least one required for AI-powered analysis)

---

### 1. Clone the Repository

```bash
git clone https://github.com/VemireddyBhavana/nexusguard.git
cd nexusguard
```

---

### 2. Configure the Backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
PORT                   # Get your own port number
OPENAI_API_KEY         # Get from platform.openai.com
GEMINI_API_KEY         # Get from aistudio.google.com
SLACK_WEBHOOK_URL       # Optional: for Slack notifications
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The backend will start at **http://localhost:5000**

```
🚀 NexusGuard API Backend running on http://localhost:5000
   → /analyze       — Main analysis pipeline
   → /analyze/webhook — External integration hook
   → /chat          — AI SRE chat
   → /stream        — SSE live feed
   → /metrics       — System metrics
   → /health        — Health check
```

---

### 3. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at **http://localhost:5173**

---

### 4. Test It (Optional — Mock Client)

To simulate an external service sending logs via webhook:

```bash
cd mock-client
node index.cjs
```

This streams mock incidents to `POST /analyze/webhook`, which broadcasts them live to the dashboard via SSE.

---

## 📡 API Reference

### `POST /analyze`
Main analysis endpoint. Triggers the full 5-agent pipeline.

**Request Body:**
```json
{
  "log": "ERROR: OOMKilled – redis-cache pod exceeded memory limit 512Mi",
  "language": "English",
  "liveMode": false,
  "isExternal": false
}
```

**Response:**
```json
{
  "issue": "Redis Cache Memory Overflow",
  "rootCause": "Pod OOMKilled due to memory limit exceeded...",
  "fix": "1. Scale Redis memory...",
  "severity": "Critical",
  "confidence": 0.97,
  "financialImpact": 15000,
  "safetyScore": 98,
  "agentDecision": "RAG match confirmed. Dispatching RESTART_POD.",
  "reasoning": ["Guardian: ...", "Sleuth: ...", "Fixer: ...", "Vigilant: ..."],
  "decision": {
    "strategy": "AI_RAG",
    "engine": "RAG + AI Reasoning",
    "matches": 2,
    "matchedIssues": ["Redis Cache Overflow", "Pod OOMKilled"]
  },
  "action": {
    "success": true,
    "mode": "DEMO",
    "recoveryCode": "RESTART_POD",
    "slackDispatched": false
  },
  "predictiveAlert": null
}
```

---

### `POST /analyze/webhook`
External integration endpoint. Use this to connect your microservices, monitoring tools, or CI/CD pipelines to NexusGuard. Results are broadcast via SSE to all connected dashboard clients.

```bash
curl -X POST http://localhost:5000/analyze/webhook \
  -H "Content-Type: application/json" \
  -d '{"log": "CRITICAL: database connection pool exhausted", "source": "prod-db-01"}'
```

---

### `POST /chat`
AI SRE chat endpoint. Ask questions about your infrastructure.

```json
{ "message": "What caused the last incident?", "context": { "health": 72, "lastIncident": "Redis OOMKill" } }
```

---

### `GET /stream`
**Server-Sent Events** stream. Connect from your browser or frontend to receive real-time incident broadcasts.

```js
const es = new EventSource('http://localhost:5000/stream');
es.onmessage = e => console.log(JSON.parse(e.data));
```

---

### `GET /metrics`
System analytics — uptime, request counts, memory usage, incident tracking stats.

### `GET /health`
Health check: `{ "status": "ok", "ts": 1713... }`

---

## 🖥️ Frontend Features

The NexusGuard dashboard is a **single-page application** built with vanilla JS and Vite. No React, no Angular — just raw HTML, CSS, and JavaScript for maximum performance.

### Dashboard Panels

| Panel | Description |
|---|---|
| **Hero Landing Page** | Full-screen entry with animated particle canvas, 3 orbital rings, stat counters, pipeline pills, and "Launch Dashboard" CTA |
| **Log Analysis** | Text area input for pasting logs; supports file drag-and-drop |
| **Agent Decision Panel** | Shows strategy, matched RAG entries, and recovery code |
| **AI Reasoning Chain** | Guardian → Sleuth → Fixer → Vigilant step breakdown |
| **Incident Results** | Severity badge, root cause, mitigation steps, confidence |
| **Predictive Alerts** | Highlighted warning when patterns recur |
| **Live Feed** | Real-time SSE event list from webhook sources |
| **Affected Area** | Instant identification of the failing stack component (e.g., K8S, NEXT.JS, REDIS) |
| **Code Patch Terminal** | Syntax-highlighted block with exact copy-pasteable CLI commands or code changes |
| **Prevention Strategy** | Green-coded proactive measures to stop incident reoccurrence |
| **AI SRE Chat** | Chat interface backed by the same universal reasoning engine |
| **Analytics** | Chart.js bar/doughnut charts, incident history table |
| **System Metrics** | Live backend health stats from `/metrics` |

### Design System

- **Theme:** Dark glassmorphism with a `#050608` base + `#3b82f6` / `#818cf8` blue-indigo accent palette
- **Typography:** Inter (headings/UI) + JetBrains Mono (console/code)
- **Hero Effects:** Animated particle canvas (80 nodes + connecting lines), 3 orbital rings (28s / 44s / 65s), radial gradient background
- **Dashboard Effects:** Gradient borders, backdrop blur, CSS animations, live pulse indicators
- **Responsive:** Sidebar navigation on desktop; hero collapses gracefully on mobile

---

## 🧠 How the AI Works

### Prompt Engineering Strategy

The core reasoning prompt uses a **structured role-play injection** with four internal sub-agents baked into a single LLM call. This produces consistent, parsable JSON without multiple round-trips:

```
You are a Lead AI Reasoning Agent (NexusGuard v2.1).

KNOWLEDGE BASE CONTEXT (RAG):
[Injected from retrievalService — real past incidents]

GOAL:
- Use RAG knowledge strictly. Flag deviations as "High Complexity Override".
- Output reasoning trace for: Guardian, Sleuth, Fixer, Vigilant.

JSON OUTPUT FORMAT: { issue, rootCause, fix, severity, confidence, ... }

Logs to Process:
[User-provided log text]
```

### RAG Knowledge Base (`data/errors.js`)

The knowledge base is a plain JavaScript array of ~30+ structured incident entries:

```js
{
  issue: "Redis Cache OOMKilled",
  keywords: ["redis", "oomkilled", "memory", "evicted"],
  rootCause: "Redis pod exceeded its memory limit and was killed by the OOM killer.",
  fix: "Increase maxmemory config. Set eviction policy to allkeys-lru.",
  severity: "Critical"
}
```

Matching is keyword-based — the `retrievalService` returns all entries where any keyword appears in the incoming log. This keeps retrieval fast (< 1ms) without needing a vector database.

### Dual-Provider Fallback

```
OpenAI GPT-4o-mini  →  (fails / no key)  →  Google Gemini 2.0 Flash  →  (fails / no key)  →  Local Heuristic Engine
```

The local engine extracts meaningful words from the log and constructs a plausible diagnosis without any API, ensuring the demo always works.

---

##  Journey

### How NexusGuard Was Built — Full Story

**NexusGuard** was conceived, designed, and built entirely during **Agentathon 2026** as a demonstration of what truly autonomous DevOps looks like.

#### Phase 1: Problem Identification
We started with a real pain point — on-call engineers drowning in alerts. The key insight was: **the bottleneck isn't detection, it's the gap between detection and remediation**. Most tools alert you. NexusGuard *fixes it*.

#### Phase 2: Architecture Design
We chose a **multi-agent pipeline** over a monolithic AI call because:
- It mirrors how real SRE teams work (triage → research → diagnose → act → review)
- Each agent can be independently scaled, swapped, or upgraded
- The separation of concerns makes the system auditable and explainable

#### Phase 3: RAG Implementation
Rather than relying purely on LLM training data (which can hallucinate wrong CLI commands), we built a **local RAG knowledge base**. Every analysis first retrieves relevant past incidents, injects them into the prompt, and forces the AI to ground its reasoning in known-good fixes.

#### Phase 4: Dual-LLM Strategy
We engineered OpenAI as primary and Gemini as fallback to ensure **99.9% availability** of the AI engine during the demo and in production. A local heuristic engine provides the final safety net.

#### Phase 5: Real-Time Architecture
SSE was chosen over WebSockets because:
- One-directional (server → client) is all we need for broadcasting
- Native browser support with zero library overhead
- Simpler to scale behind a load balancer

#### Phase 6: Action Engine
The 15-code recovery map was built from real DevOps runbooks. Each code represents a real infrastructure action (kubectl rollout restart, redis-cli FLUSHALL, etc.) that can be wired to real APIs in production.

#### Phase 7: UI/UX
The dashboard was built with pure HTML/CSS/JS — no component framework — to keep the bundle lean and the experience snappy. The glassmorphism design language was chosen to feel premium and futuristic, appropriate for an autonomous enterprise tool.

#### Phase 8: Predictive Intelligence
The Memory Agent was added last — but it's what moves NexusGuard from *reactive* to *predictive*. By tracking incident patterns, it can warn you that a systemic failure is building **before** the next crash hits.

#### Phase 9: Hero Landing Page
First impressions matter — especially at a hackathon. We added a full-screen hero landing experience featuring:
- **Animated particle canvas** — 80 floating nodes with network connection lines
- **Three orbiting rings** at different rotation speeds for depth and motion
- **Animated stat counters** — 99.9% uptime, 850K costs protected, 5 agents, 30+ patterns
- **Agent pipeline pills** — color-coded glowing indicators showing the live agent flow
- **Smooth transition** — scale + fade exit animation into the main dashboard

The hero sets the tone: you're not looking at a demo app. You're looking at an enterprise-grade autonomous AI platform.

---

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">



*NexusGuard — Because your infrastructure deserves a guardian that never sleeps.*

</div>
