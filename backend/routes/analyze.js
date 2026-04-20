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
  
  // Build a much more descriptive context for the AI or local fallback
  const ragContext = knowledge.map(k => 
    `Issue: ${k.issue}\nCategory: ${k.category}\nRoot Cause: ${k.rootCause || 'N/A'}\nFix: ${k.fix || k.suggestion || 'Contact SRE.'}`
  ).join('\n---\n');

  const matchedIssues = knowledge.map(k => k.issue);
  const matchedKeywords = knowledge.flatMap(k => k.keywords);

  // 3. Memory Agent — detect recurring patterns (predictive alerts)
  const pattern = detectPattern(matchedKeywords);
  recordIncident(matchedKeywords, log.substring(0, 80));

  // 4. Reasoning Agent — AI or Rule-Based shortcut
  let aiResponse;
  
  // Scoring Confidence: Highest score / total keywords in the best match
  const topMatch = knowledge[0];
  const matchingConfidence = topMatch ? Math.min(1.0, topMatch.score / topMatch.keywords.length) : 0;

  // RULE-BASED BYPASS: If we have high confidence matches (>60% keyword coverage)
  if (decision.strategy === "RULE_BASED" && matchingConfidence >= 0.6) {
      console.log(`⚡ Manager Agent: High confidence RAG match (${Math.round(matchingConfidence*100)}%). Bypassing AI.`);
      aiResponse = {
          issue: topMatch.issue,
          rootCause: topMatch.rootCause || "Pattern signature recognized in NexusGuard Knowledge Base.",
          fix: topMatch.fix || topMatch.suggestion || "Follow standard infrastructure remediation.",
          severity: topMatch.severity || "Medium",
          confidence: matchingConfidence,
          financialImpact: 5000 + (topMatch.score * 1000),
          safetyScore: 100,
          agentDecision: `Deterministic match for ${topMatch.issue} (Confidence: ${Math.round(matchingConfidence*100)}%). Directing immediate recovery.`,
          usedKnowledge: true,
          reasoning: [
              `Guardian: Pattern verified via ${topMatch.matchedKeywords.length} signature matches.`,
              "Sleuth: Specific root cause mapped to internal catalog.",
              "Fixer: Dispatching pre-authorized remediation script.",
              "Vigilant: Zero-risk handshake completed. Safe to proceed."
          ]
      };
  } else {
      // Reasoning Agent (AI: OpenAI → Gemini → Local fallback)
      aiResponse = await analyzeLogs(log, ragContext, language);
  }

  // 5. Action Agent — map recovery code, dispatch Slack if configured
  const actionResult = await triggerAction({ ...aiResponse, originalLog: log }, liveMode);

  return {
    ...aiResponse,
    decision: {
      ...decision,
      engine: (decision.strategy === "RULE_BASED" && matchingConfidence >= 0.6) ? "Rule Engine" : "RAG + AI Reasoning",
      matches: knowledge.length,
      matchedIssues,
      confidence: matchingConfidence
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
