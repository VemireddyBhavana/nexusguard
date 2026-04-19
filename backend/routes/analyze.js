// backend/routes/analyze.js
import express from 'express';
const router = express.Router();
import { analyzeLogs } from '../services/aiService.js';
import { retrieveRelevantErrors } from '../services/retrievalService.js';
import { decideAnalysisType } from '../services/managerService.js';
import { triggerAction } from '../services/actionService.js';
import { broadcast } from '../services/streamService.js';
import { recordIncident, detectPattern } from '../services/memoryService.js';

// ── Shared pipeline function used by both POST / and POST /webhook ──
async function runAnalysisPipeline(log, language = 'English', liveMode = false, isExternal = false) {
  // 1. Manager Agent — decides strategy
  const decision = decideAnalysisType(log);

  // 2. Retrieval Agent (RAG) — fetch matching knowledge
  const knowledge = retrieveRelevantErrors(log);
  const knowledgeTag = knowledge.map(k => k.issue).join(', ');
  const matchedKeywords = knowledge.flatMap(k => k.keywords);

  // 3. Memory Agent — detect recurring patterns (predictive alerts)
  const pattern = detectPattern(matchedKeywords);
  recordIncident(matchedKeywords, log.substring(0, 80));

  // 4. Reasoning Agent (AI: OpenAI → Gemini → Local fallback)
  const aiResponse = await analyzeLogs(log, knowledgeTag, language);

  // 5. Action Agent — map recovery code, dispatch Slack if configured
  const actionResult = await triggerAction({ ...aiResponse, originalLog: log }, liveMode);

  return {
    ...aiResponse,
    decision: {
      ...decision,
      engine: decision.strategy === "AI_RAG" ? "RAG + AI Reasoning" : "Rule Engine",
      matches: knowledge.length,
      matchedIssues: knowledge.map(k => k.issue)
    },
    action: actionResult,
    predictiveAlert: pattern.alert ? pattern : null,
    externalLog: isExternal ? log : null
  };
}

// POST /analyze — Main analysis endpoint
router.post('/', async (req, res) => {
  const { log, language, liveMode, isExternal } = req.body;
  try {
    const result = await runAnalysisPipeline(log, language, liveMode, isExternal);
    if (isExternal) broadcast(result);
    res.json(result);
  } catch (error) {
    console.error("❌ Workflow Chain Broken:", error);
    res.status(500).json({ error: "Autonomous Engine Failure", details: error.message, stack: error.stack });
  }
});

// POST /analyze/webhook — External service integration endpoint
// External microservices POST here to trigger autonomous analysis + SSE broadcast
router.post('/webhook', async (req, res) => {
  const { log, source = 'WEBHOOK', liveMode = true } = req.body;
  if (!log) return res.status(400).json({ error: 'log field is required' });
  try {
    const result = await runAnalysisPipeline(log, 'English', liveMode, true);
    broadcast({ ...result, source });
    res.json({ success: true, source, timestamp: new Date().toISOString(), ...result });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).json({ error: "Webhook processing failed", details: error.message });
  }
});

// GET /analyze/status
router.get('/status', (req, res) => {
  res.json({ status: "NexusGuard Autonomous Engine v2.1 Online" });
});

export default router;
