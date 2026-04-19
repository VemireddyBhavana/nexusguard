// backend/services/managerService.js

/**
 * Manager Agent
 * Decides the analysis strategy based on log complexity.
 */
export function decideAnalysisType(logText) {
  const complexity = logText.split(" ").length;

  if (complexity > 15 || logText.includes("multiple") || logText.includes("CRITICAL")) {
    return {
        strategy: "AI_RAG",
        complexity,
        reason: "High complexity log detected. Triggering Multi-Agent AI + RAG reasoning."
    };
  }

  return {
      strategy: "RULE_BASED",
      complexity,
      reason: "Standard pattern detected. Using high-speed pattern matching."
  };
}
