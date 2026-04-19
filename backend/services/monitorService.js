// backend/services/monitorService.js
/**
 * Perception Agent
 * Monitors the log stream and manual entries.
 * Automatically triggers the analysis workflow when anomalies are detected.
 */
import { errorDB } from '../data/errors.js';

class MonitorService {
  constructor() {
    this.isActive = true;
    this.onDetection = null; // Callback for workflow trigger
  }

  // Simulate incoming logs
  startAutoScan() {
    setInterval(() => {
      if (!this.isActive) return;
      
      // Randomly decide if a healthy or critical event happens
      if (Math.random() > 0.8) {
        const scenario = this.generateAnomaly();
        console.log(`📡 Perception Agent: Anomaly detected! [${scenario}]`);
        if (this.onDetection) this.onDetection(scenario, "AUTO");
      }
    }, 15000); // 15s interval for demo
  }

  generateAnomaly() {
    const criticalScenarios = [
      "CRITICAL: 502 Bad Gateway detected on checkout service",
      "SECURITY ALERT: Unauthorized access attempt on PII endpoint",
      "INFRA: Connection refused on PostgreSQL port 5432",
      "PERF: Cross-service latency > 800ms between Order and Payment modules"
    ];
    return criticalScenarios[Math.floor(Math.random() * criticalScenarios.length)];
  }

  // Manual Trigger Integration
  processManualLog(log) {
    console.log(`📡 Perception Agent: Manual log processing triggered... [${log.substring(0, 30)}...]`);
    if (this.onDetection) this.onDetection(log, "MANUAL");
  }
}

export const monitor = new MonitorService();
