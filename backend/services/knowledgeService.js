// backend/services/knowledgeService.js
// Step 7: Dynamic Intelligence Ingestion Layer

const dynamicKnowledge = [];
const MAX_LEARNED_FACTS = 50;

/**
 * Ingests a new "fact" or runbook excerpt into the agent's short-term RAG store.
 * @param {string} content - The extracted text from a runbook or manual teaching.
 * @param {string} category - Category (e.g., 'Database', 'Scaling')
 */
export function ingestFact(content, category = 'General') {
    const fact = {
        id: `FACT-${Date.now()}`,
        content,
        category,
        keywords: content.toLowerCase().split(/\W+/).filter(w => w.length > 3),
        timestamp: new Date().toISOString(),
        source: 'User Uploaded Runbook'
    };

    dynamicKnowledge.unshift(fact);
    
    // Keep a rolling window of learned knowledge
    if (dynamicKnowledge.length > MAX_LEARNED_FACTS) {
        dynamicKnowledge.pop();
    }

    console.log(`🧠 Knowledge Service: Ingested new context — "${content.substring(0, 40)}..."`);
    return fact;
}

/**
 * Retrieves learned knowledge matching the given log text.
 */
export function getLearnedContext(logText) {
    const lower = logText.toLowerCase();
    const matches = dynamicKnowledge.filter(fact => 
        fact.keywords.some(kw => lower.includes(kw))
    );
    
    return matches;
}

/**
 * returns all learned facts for the Knowledge Harvester UI
 */
export function getAllLearnedFacts() {
    return dynamicKnowledge;
}
