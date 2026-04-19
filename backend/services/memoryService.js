// backend/services/memoryService.js
// Cross-incident pattern tracker — Agent Memory Module

const incidentMemory = [];
const MAX_MEMORY = 100;

/**
 * Records a new incident into the in-memory store.
 * @param {string[]} keywords - RAG keywords matched by the incident
 * @param {string} logSnippet - First 80 chars of the original log
 */
export function recordIncident(keywords = [], logSnippet = '') {
  incidentMemory.unshift({
    keywords,
    logSnippet,
    timestamp: Date.now()
  });
  if (incidentMemory.length > MAX_MEMORY) incidentMemory.pop();
  console.log(`🧠 Memory Agent: ${incidentMemory.length} incidents in rolling window.`);
}

/**
 * Detects repeated patterns in the last hour.
 * If 2+ incidents share keywords within 1 hour → predictive escalation.
 * @param {string[]} keywords - Keywords to match against memory
 * @returns {{ alert: boolean, count: number, message: string }}
 */
export function detectPattern(keywords = []) {
  if (keywords.length === 0) return { alert: false, count: 0 };

  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const recentSimilar = incidentMemory.filter(inc =>
    inc.timestamp > oneHourAgo &&
    keywords.some(kw => inc.keywords.includes(kw))
  );

  if (recentSimilar.length >= 2) {
    const sharedKeyword = keywords.find(kw =>
      recentSimilar.some(inc => inc.keywords.includes(kw))
    ) || 'system';

    console.log(`⚠️ Pattern Agent: Predictive alert triggered — ${recentSimilar.length + 1} similar incidents in last hour.`);
    return {
      alert: true,
      count: recentSimilar.length + 1,
      message: `${recentSimilar.length + 1} similar "${sharedKeyword}" incidents detected in the last hour. Pattern suggests systemic failure — escalating priority to CRITICAL.`
    };
  }

  return { alert: false, count: 0 };
}

/**
 * Returns memory stats for the /metrics endpoint.
 */
export function getMemoryStats() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  return {
    totalTracked: incidentMemory.length,
    lastHourCount: incidentMemory.filter(i => i.timestamp > oneHourAgo).length,
    recentLogs: incidentMemory.slice(0, 3).map(i => i.logSnippet)
  };
}
