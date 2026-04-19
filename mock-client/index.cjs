const http = require('http');

console.log("==========================================");
console.log("🚀 [E-Commerce Microservice] Online and serving traffic...");
console.log("==========================================\n");

const errors = [
  "FATAL: Redis cache cluster 10.4.4.2 unreachable. Queue backing up.",
  "ERROR: Stripe Payment Gateway Timeout (504). Orders dropping.",
  "CRITICAL: CPU threshold exceeded 99% on Checkout Service container.",
  "WARN: Database Connection Failure on port no 50032. Retrying..."
];

const suppressedCodes = new Set();

const RECOVERY_MAP = {
  "Redis": "FLUSH_CACHE",
  "Stripe": "FAILOVER_PAYMENT",
  "CPU": "SCALE_OUT",
  "Database": "RESTART_DB"
};

function getCodeForError(text) {
  for (const [key, code] of Object.entries(RECOVERY_MAP)) {
    if (text.includes(key)) return code;
  }
  return "GENERIC_OPTIMIZE";
}

setInterval(() => {
  // Filter out errors that are currently being "Fixed"
  const availableErrors = errors.filter(err => !suppressedCodes.has(getCodeForError(err)));

  if (availableErrors.length > 0 && Math.random() > 0.4) {
    const errorText = availableErrors[Math.floor(Math.random() * availableErrors.length)];
    const errorCode = getCodeForError(errorText);

    console.log(`❌ [APP CRASH] Submitting error payload to NexusGuard Webhook...`);
    console.log(`    Log: "${errorText}"`);

    const data = JSON.stringify({
      log: errorText,
      language: "en",
      liveMode: true,
      isExternal: true
    });

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        const response = JSON.parse(body);
        const recoveryCode = response.action?.recoveryCode;

        console.log(`✅ [NEXUSGUARD HTTP 200] Automated resolution triggered successfully.`);
        if (recoveryCode && recoveryCode !== "GENERIC_OPTIMIZE") {
          console.log(`✨ [SELF-HEAL] NexusGuard dispatched ${recoveryCode}. Recovering system...`);
          suppressedCodes.add(recoveryCode);
          
          // Suppress this error for 60 seconds to simulate a fix
          setTimeout(() => {
            suppressedCodes.delete(recoveryCode);
            console.log(`📡 [SYSTEM] Health Verified. Recovery window closed for ${recoveryCode}.`);
          }, 60000);
        }
        console.log(""); // New line for readability
      });
    });

    req.on('error', error => console.error(error));
    req.write(data);
    req.end();
  } else {
    if (suppressedCodes.size > 0) {
      console.log(`🛡️ [SELF-HEALING] Active fixes in progress: ${Array.from(suppressedCodes).join(', ')}`);
    } else {
      console.log("✅ [E-Commerce Microservice] Traffic normal. 0 active alarms.");
    }
  }
}, 8000);
