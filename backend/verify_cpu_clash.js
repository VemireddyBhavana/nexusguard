// backend/verify_cpu_clash.js
import { retrieveRelevantErrors } from './services/retrievalService.js';

async function test() {
  console.log("🧪 Testing Diagnostic Precision Fix...");
  const log = "CRITICAL: CPU threshold exceeded 99% on Checkout Service container.";
  
  console.log("\n1. RAG Scoring Verification:");
  const knowledge = retrieveRelevantErrors(log);
  const topMatch = knowledge[0];
  
  if (topMatch && topMatch.issue === "CPU Spike Detected") {
    console.log("✅ SUCCESS: Correctly identified as CPU Spike.");
    console.log(`   Score: ${topMatch.score.toFixed(2)}`);
    console.log(`   Matched: ${topMatch.matchedKeywords.join(', ')}`);
  } else {
    console.log("❌ FAILURE: Incorrectly identified issue.");
    if (topMatch) console.log(`   Found: ${topMatch.issue} (Score: ${topMatch.score.toFixed(2)})`);
  }

  console.log("\n2. Action Mapping Verification:");
  // Simulate the action mapping logic in actionService
  const RECOVERY_MAP = {
    "stripe":       "FAILOVER_PAYMENT",
    "payment failure": "FAILOVER_PAYMENT",
    "checkout error": "FAILOVER_PAYMENT",
    "cpu":          "SCALE_OUT",
    "threshold":    "SCALE_OUT"
  };
  
  const searchText = `${topMatch.issue} ${log}`.toLowerCase();
  const matchedKey = Object.keys(RECOVERY_MAP).find(key => searchText.includes(key));
  const recoveryCode = matchedKey ? RECOVERY_MAP[matchedKey] : "GENERIC_OPTIMIZE";
  
  if (recoveryCode === "SCALE_OUT") {
    console.log("✅ SUCCESS: Correctly mapped to SCALE_OUT.");
  } else {
    console.log(`❌ FAILURE: Mapped to ${recoveryCode} (Expected SCALE_OUT).`);
  }
}

test();
