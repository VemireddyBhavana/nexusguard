// backend/services/retrievalService.js
import { errorDB } from "../data/errors.js";

/**
 * RAG Retrieval Agent
 * Matches incoming logs against the internal knowledge base.
 */
export function retrieveRelevantErrors(logText) {
  const lower = logText.toLowerCase();

  const matches = errorDB.filter(item =>
    item.keywords.some(keyword => lower.includes(keyword))
  );

  console.log(`📚 Retrieval Agent: Found ${matches.length} matching knowledge entries.`);
  return matches;
}
