import { errorDB } from "../data/errors.js";
import { getLearnedContext } from "./knowledgeService.js";

/**
 * RAG Retrieval Agent
 * Matches incoming logs against BOTH the core errorDB and dynamic session knowledge.
 */
export function retrieveRelevantErrors(logText) {
  const lower = logText.toLowerCase();

  const scoreMatch = (item) => {
    let score = 0;
    const matchedKeywords = [];
    item.keywords.forEach(kw => {
      if (lower.includes(kw.toLowerCase())) {
        score += 1 + (kw.length / 100); // Add small bonus for keyword length (specificity)
        matchedKeywords.push(kw);
      }
    });
    return { score, matchedKeywords };
  };

  // 1. Fetch and score from static error knowledge base
  const staticMatches = errorDB.map(item => {
    const { score, matchedKeywords } = scoreMatch(item);
    return { ...item, score, matchedKeywords };
  }).filter(item => item.score > 0);

  // 2. Fetch and score from dynamic learned context
  const dynamicMatches = getLearnedContext(logText).map(fact => {
    const { score, matchedKeywords } = scoreMatch(fact);
    return {
      issue: `[Learned] ${fact.category}`,
      keywords: fact.keywords,
      rootCause: fact.content,
      suggestion: "Follow instructions from uploaded runbook.",
      isDynamic: true,
      score,
      matchedKeywords
    };
  }).filter(item => item.score > 0);

  const allMatches = [...staticMatches, ...dynamicMatches];

  // Sort by score (descending)
  allMatches.sort((a, b) => b.score - a.score);

  allMatches.forEach(m => console.log(`   - [Score ${m.score.toFixed(3)}] ${m.issue} (Matched: ${m.matchedKeywords.join(', ')})`));

  console.log(`📚 Retrieval Agent: Found ${allMatches.length} matching knowledge entries. Top Match Score: ${allMatches[0]?.score || 0}`);
  return allMatches;
}
