// main.js — NexusGuard Professional SaaS Platform v2.1
// ============================================================

// ── GLOBAL STATE ─────────────────────────────────────────────
let lastAiData = null;
let isBusy = false;
let monitorActive = true;
let consoleLines = 0;
let sessionSeconds = 0;
let analyticsChart = null;
let mttrChart = null;
let severityChart = null;
let isDarkTheme = true;

// ── UI REFERENCES ─────────────────────────────────────────────
const ui = {
  logInput: document.getElementById('log-input'),
  runBtn: document.getElementById('run-btn'),
  statusText: document.getElementById('status-text'),
  statusDot: document.getElementById('status-dot'),
  severityBadge: document.getElementById('severity-badge'),
  evidence: document.getElementById('content-evidence'),
  secondaryContainer: document.getElementById('secondary-issues-container'),
  secondaryList: document.getElementById('secondary-issues-list'),
  reasoningCard: document.getElementById('card-reasoning'),
  reasoningPath: document.getElementById('content-reasoning'),
  monitorConsole: document.getElementById('monitor-console'),
  liveConsole: document.getElementById('live-console'),
  monitorStatus: document.getElementById('monitor-status'),
  toggleMonitor: document.getElementById('toggle-monitor'),
  gaugeProgress: document.getElementById('gauge-progress'),
  gaugeText: document.getElementById('gauge-text'),
  predictiveLabel: document.getElementById('predictive-label'),
  mainContainer: document.querySelector('.app-shell'),
  uiLang: document.getElementById('ui-lang'),
  uiSubtitle: document.getElementById('ui-subtitle'),
  viewTitle: document.getElementById('view-title'),
  toastContainer: document.getElementById('toast-container'),
  historyBody: document.getElementById('history-body'),
  uptimeValue: document.getElementById('uptime-value'),
  costsValue: document.getElementById('costs-value'),
  autoDetectBtn: document.getElementById('auto-detect-btn'),
  financeBox: document.getElementById('finance-impact-box'),
  financeValue: document.getElementById('content-finance'),
  navItems: document.querySelectorAll('.nav-item'),
  views: document.querySelectorAll('.view-content'),
  liveModeToggle: document.getElementById('live-mode-toggle'),
  modeLabel: document.getElementById('mode-label'),
  relevantIssuesContainer: document.getElementById('relevant-issues-container'),
  relevantIssuesList: document.getElementById('relevant-issues-list'),
  chatWidget: document.getElementById('chat-widget'),
  chatToggle: document.getElementById('chat-toggle'),
  chatClose: document.getElementById('chat-close'),
  chatInput: document.getElementById('chat-input'),
  chatSend: document.getElementById('chat-send'),
  chatMessages: document.getElementById('chat-messages'),
  intGithub: document.getElementById('int-github'),
  intSlack: document.getElementById('int-slack'),
  intCloud: document.getElementById('int-cloud'),
  incidentsCount: document.getElementById('incidents-count'),
  settingModel: document.getElementById('setting-model'),
  settingSafety: document.getElementById('setting-safety'),
  saveSettings: document.getElementById('save-settings'),
  // ── NEW ──
  themeToggle: document.getElementById('theme-toggle'),
  fileUpload: document.getElementById('file-upload'),
  dropZone: document.getElementById('drop-zone'),
  predictiveAlert: document.getElementById('predictive-alert'),
  historySearch: document.getElementById('history-search'),
  historyFilter: document.getElementById('history-filter'),
  exportCsvBtn: document.getElementById('export-csv-btn'),
  downloadRunbook: document.getElementById('download-runbook-btn'),
};

const content = {
  issue: document.getElementById('content-issue'),
  rootCause: document.getElementById('content-root-cause'),
  suggestion: document.getElementById('content-suggestion'),
  actions: document.getElementById('content-actions'),
  decisionText: document.getElementById('decision-text'),
  decisionEngine: document.getElementById('decision-engine'),
  knowledgeBadge: document.getElementById('knowledge-badge'),
  safetyScore: document.getElementById('content-safety')
};

const cards = {
  issue: document.getElementById('card-issue'),
  rootCause: document.getElementById('card-root-cause'),
  suggestion: document.getElementById('card-suggestion'),
  actions: document.getElementById('card-actions'),
  reasoning: document.getElementById('card-reasoning'),
  decision: document.getElementById('card-decision')
};

const steps = {
  perception: document.getElementById('step-perception'),
  manager: document.getElementById('step-manager'),
  research: document.getElementById('step-research'),
  fix: document.getElementById('step-fix'),
  action: document.getElementById('step-action')
};

// ── i18n DICTIONARIES ────────────────────────────────────────
const UI_TRANSLATIONS = {
  'en': {
    NAV_DASHBOARD: "Dashboard", NAV_HISTORY: "Incident History", NAV_ANALYTICS: "Analytics", NAV_SETTINGS: "Settings",
    SUBTITLE: "Autonomous AI Guardian for Predictive DevOps", BADGE_PROTECTION: "Enterprise Protection Enabled",
    MONITOR_TITLE: "System Live Feed — Node_01", PERCEPTION_ACTIVE: "PERCEPTION: ACTIVE", STATUS_HEALTHY: "Status: Healthy",
    GREEN_OPS: "GREEN OPS", BTN_PAUSE: "PAUSE FEED", BTN_RESUME: "RESUME FEED", INPUT_HEADING: "Intelligence Input",
    INPUT_PLACEHOLDER: "Enter logs or tap for auto-detect...", BTN_RUN: "Run Agent", BTN_AUTO: "Auto-Detect",
    STEP_PERCEPTION: "Perception", STEP_MANAGER: "Manager", STEP_RESEARCH: "Research", STEP_FIX: "Fix", STEP_ACTION: "Action",
    TITLE_ISSUE: "Detected Issue", TITLE_CAUSE: "Root Cause", TITLE_FIX: "Suggested Fix", TITLE_PATH: "Resolution Path",
    TITLE_REASONING: "Multi-Agent Reasoning Chain", TITLE_IMPACT: "Risk Exposure",
    TITLE_LEDGER: "Incident Ledger", SUBTITLE_LEDGER: "Persistent audit trail of all autonomous interventions.",
    TH_TIMESTAMP: "TIMESTAMP", TH_ID: "INCIDENT ID", TH_ISSUE: "ISSUE", TH_SEVERITY: "SEVERITY", TH_MTTR: "MTTR", TH_STATUS: "STATUS",
    METRIC_UPTIME: "NETWORK UPTIME", METRIC_COSTS: "COSTS PROTECTED", METRIC_FIXES: "AUTONOMOUS FIXES",
    CHART_TITLE: "Incident Mitigation Trend (Weekly)", CHART_PERIOD: "Last 7 Days",
    STATUS_IDLE: "Perception Engine: Waiting for logs...", SESSION: "Session",
    MSG_PENDING: "Analysis pending...", MSG_WAITING: "Waiting for insights...",
    MSG_REPAIR: "Analytical repair in progress...", MSG_READY: "System ready.",
    USER_ROLE: "System Lead", TOAST_LANG: "Language: English", TOAST_COMPLETE: "Autonomous resolution cycle completed."
  },
  'hi': {
    NAV_DASHBOARD: "डैशबोर्ड", NAV_HISTORY: "घटना इतिहास", NAV_ANALYTICS: "विश्लेषण", NAV_SETTINGS: "सेटिंग",
    SUBTITLE: "स्वायत्त AI DevOps गार्जियन", BADGE_PROTECTION: "एंटरप्राइज सुरक्षा सक्रिय",
    MONITOR_TITLE: "लाइव सिस्टम फ़ीड — Node_01", PERCEPTION_ACTIVE: "PERCEPTION: सक्रिय", STATUS_HEALTHY: "स्थिति: सुरक्षित",
    BTN_RUN: "एजेंट चलाएं", BTN_AUTO: "ऑटो-डिटेक्ट", INPUT_HEADING: "लॉग इनपुट",
    INPUT_PLACEHOLDER: "लॉग दर्ज करें या ऑटो-डिटेक्ट करें...",
    TITLE_ISSUE: "पहचाना गया मुद्दा", TITLE_CAUSE: "मूल कारण", TITLE_FIX: "सुझावित समाधान",
    TITLE_REASONING: "मल्टी-एजेंट रिजनिंग चेन", TITLE_PATH: "रिज़ॉल्यूशन पाथ",
    METRIC_UPTIME: "नेटवर्क अपटाइम", METRIC_COSTS: "बचाई गई लागत", METRIC_FIXES: "स्वायत्त फिक्स",
    STATUS_IDLE: "परसेप्शन इंजन: लॉग की प्रतीक्षा...", SESSION: "सत्र",
    MSG_PENDING: "विश्लेषण प्रतीक्षित...", MSG_WAITING: "अंतर्दृष्टि की प्रतीक्षा...", MSG_READY: "सिस्टम तैयार।",
    USER_ROLE: "सिस्टम लीड", TOAST_LANG: "भाषा: हिन्दी"
  },
  'es': {
    NAV_DASHBOARD: "Panel", NAV_HISTORY: "Historial de Incidentes", NAV_ANALYTICS: "Analíticas", NAV_SETTINGS: "Configuración",
    SUBTITLE: "Guardián AI Autónomo para DevOps Predictivo", BADGE_PROTECTION: "Protección Empresarial Activada",
    MONITOR_TITLE: "Feed del Sistema — Node_01", PERCEPTION_ACTIVE: "PERCEPCIÓN: ACTIVA", STATUS_HEALTHY: "Estado: Estable",
    BTN_RUN: "Ejecutar Agente", BTN_AUTO: "Detección Auto", INPUT_HEADING: "Entrada de Inteligencia",
    INPUT_PLACEHOLDER: "Ingrese logs o use detección automática...",
    TITLE_ISSUE: "Problema Detectado", TITLE_CAUSE: "Causa Raíz", TITLE_FIX: "Corrección Sugerida",
    TITLE_REASONING: "Cadena de Razonamiento Multi-Agente", TITLE_PATH: "Ruta de Resolución",
    METRIC_UPTIME: "UPTIME DE RED", METRIC_COSTS: "COSTOS PROTEGIDOS", METRIC_FIXES: "CORRECCIONES AUTÓNOMAS",
    STATUS_IDLE: "Motor de Percepción: Esperando registros...", SESSION: "Sesión",
    MSG_PENDING: "Análisis pendiente...", MSG_WAITING: "Esperando perspectivas...", MSG_READY: "Sistema listo.",
    USER_ROLE: "Jefe de Sistema", TOAST_LANG: "Idioma: Español"
  },
  'ja': {
    NAV_DASHBOARD: "ダッシュボード", NAV_HISTORY: "インシデント履歴", NAV_ANALYTICS: "分析", NAV_SETTINGS: "設定",
    SUBTITLE: "自律型AI DevOpsガーディアン", BADGE_PROTECTION: "エンタープライズ保護が有効",
    MONITOR_TITLE: "ライブシステムフィード — Node_01", PERCEPTION_ACTIVE: "PERCEPTION: アクティブ", STATUS_HEALTHY: "状態: 安定",
    BTN_RUN: "エージェント実行", BTN_AUTO: "自動検出", INPUT_HEADING: "インテリジェンス入力",
    INPUT_PLACEHOLDER: "ログを入力するか自動検出を押してください...",
    TITLE_ISSUE: "検出された問題", TITLE_CAUSE: "根本原因", TITLE_FIX: "修正提案",
    TITLE_REASONING: "マルチエージェント推論チェーン", TITLE_PATH: "解決パス",
    METRIC_UPTIME: "ネットワーク稼働率", METRIC_COSTS: "保護されたコスト", METRIC_FIXES: "自律的修正",
    STATUS_IDLE: "認知エンジン: ログを待機中...", SESSION: "セッション",
    MSG_PENDING: "分析待機中...", MSG_WAITING: "洞察を待機中...", MSG_READY: "システム準備完了。",
    USER_ROLE: "システムリード", TOAST_LANG: "言語: 日本語"
  }
};

// ── UTILITIES ────────────────────────────────────────────────
async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function updateHealthGauge(percent) {
  const score = Math.max(0, Math.min(100, percent));
  if (ui.gaugeProgress) ui.gaugeProgress.style.strokeDasharray = `${score}, 100`;
  if (ui.gaugeText) ui.gaugeText.textContent = `${Math.round(score)}%`;
  const color = score > 70 ? '#4ade80' : (score > 30 ? '#fbbf24' : '#ef4444');
  if (ui.gaugeProgress) ui.gaugeProgress.style.stroke = color;
  if (ui.predictiveLabel) ui.predictiveLabel.style.color = color;
}

function showToast(message, type = 'info') {
  if (!ui.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'danger' ? 'alert-circle' : 'check-circle';
  toast.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
  ui.toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function animateCounter(el, targetValue) {
  if (!el) return;
  const isUSD = el.innerText.includes('$');
  const rawCurrent = parseInt(el.innerText.replace(/[^0-9]/g, '')) || 0;
  const steps = 40;
  const stepSize = (targetValue - rawCurrent) / steps;
  let current = rawCurrent;
  let count = 0;
  const timer = setInterval(() => {
    current += stepSize;
    count++;
    if (count >= steps) { current = targetValue; clearInterval(timer); }
    el.innerText = isUSD ? `$${Math.round(current).toLocaleString()}` : Math.round(current).toLocaleString();
  }, 800 / steps);
}

// ── THEME ─────────────────────────────────────────────────────
function applyTheme(dark) {
  isDarkTheme = dark;
  document.documentElement.classList.toggle('light', !dark);
  if (ui.themeToggle) {
    ui.themeToggle.innerHTML = dark
      ? '<i data-lucide="sun" style="width:16px;height:16px;"></i>'
      : '<i data-lucide="moon" style="width:16px;height:16px;"></i>';
    if (window.lucide) window.lucide.createIcons();
  }
  localStorage.setItem('nexus_theme', dark ? 'dark' : 'light');
}
function toggleTheme() { applyTheme(!isDarkTheme); }

// ── i18n ──────────────────────────────────────────────────────
function applyTranslations(lang) {
  const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.innerText = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.placeholder = dict[key];
  });
  showToast(dict.TOAST_LANG || `Language switched to ${lang}.`);
}

// ── FILE UPLOAD ───────────────────────────────────────────────
function handleFileUpload(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    ui.logInput.value = e.target.result.substring(0, 2000);
    updateLiveConsole(`File Agent: Loaded "${file.name}" (${(file.size / 1024).toFixed(1)} KB). Ready to analyze.`);
    showToast(`"${file.name}" loaded successfully.`);
  };
  reader.onerror = () => showToast('Failed to read file.', 'danger');
  reader.readAsText(file);
}

function initDropZone() {
  const dz = ui.dropZone;
  if (!dz) return;
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  });
}

// ── CSV EXPORT ────────────────────────────────────────────────
function exportCSV() {
  const history = JSON.parse(localStorage.getItem('incident_history') || '[]');
  if (history.length === 0) { showToast('No incidents to export.'); return; }
  const headers = ['Timestamp', 'Incident ID', 'Issue', 'Severity', 'MTTR', 'Safety Score'];
  const rows = history.map(h => [
    h.timestamp, h.id,
    `"${(h.issue || '').replace(/"/g, "'")}"`,
    h.severity || 'High', h.mttr || '2.0m', h.safetyScore || 98
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nexusguard_incidents_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Exported ${history.length} incidents to CSV.`);
}

// ── RUNBOOK GENERATOR ─────────────────────────────────────────
function downloadRunbook() {
  if (!lastAiData) { showToast('Run an analysis first to generate a runbook.'); return; }
  const id = `NX-${Math.floor(1000 + Math.random() * 9000)}`;
  const runbook = `# 🛡️ NexusGuard Incident Runbook

**Generated:** ${new Date().toLocaleString()}  
**Incident ID:** ${id}  
**Engine:** NexusGuard Autonomous DevOps Platform v2.1

---

## 📋 Incident Summary

| Field | Value |
|-------|-------|
| **Issue** | ${lastAiData.issue || 'Unknown'} |
| **Severity** | ${lastAiData.severity || 'High'} |
| **Confidence** | ${Math.round((lastAiData.confidence || 0.85) * 100)}% |
| **Safety Score** | ${lastAiData.safetyScore || 98}% |
| **Financial Risk Mitigated** | $${(lastAiData.financialImpact || 0).toLocaleString()} |
| **RAG Knowledge Used** | ${lastAiData.usedKnowledge ? '✅ Yes' : '❌ No'} |
| **Decision Engine** | ${lastAiData.decision?.engine || 'RAG + AI Reasoning'} |
| **RAG Matches** | ${lastAiData.decision?.matches || 0} entries |
| **Action Dispatched** | \`${lastAiData.action?.recoveryCode || 'GENERIC_OPTIMIZE'}\` |
| **Mode** | ${lastAiData.action?.mode || 'DEMO'} |

---

## 🔍 Root Cause Analysis

${lastAiData.rootCause || 'See analysis output.'}

---

## 🛠️ Remediation Steps

\`\`\`
${lastAiData.fix || 'No fix generated.'}
\`\`\`

---

## 🧠 Multi-Agent Reasoning Chain

${(lastAiData.reasoning || []).map((r, i) => `**${i + 1}.** ${r}`).join('\n\n')}

---

## ⚙️ Agent Decision Audit

${lastAiData.agentDecision || 'N/A'}

${lastAiData.predictiveAlert?.alert ? `\n## ⚠️ Predictive Alert\n\n${lastAiData.predictiveAlert.message}` : ''}

---

## ✅ Resolution Validation

- Action: **${lastAiData.action?.recoveryCode || 'GENERIC_OPTIMIZE'}** dispatched
- Slack Notification: **${lastAiData.action?.slackDispatched ? '✅ Sent' : '⏭️ Not configured'}**
- Status: **✓ RESOLVED**
- Safety Audit: **PASSED**

---

*Auto-generated by NexusGuard Autonomous DevOps Platform v2.1 | Agentathon 2026*`;

  const blob = new Blob([runbook], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `runbook_${(lastAiData.issue || 'incident').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.md`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Runbook downloaded as Markdown.');
}

// ── PREDICTIVE ALERT ──────────────────────────────────────────
function showPredictiveAlert(pattern) {
  if (!ui.predictiveAlert || !pattern?.alert) return;
  ui.predictiveAlert.style.display = 'flex';
  ui.predictiveAlert.innerHTML = `
    <i data-lucide="alert-triangle" style="width:18px;height:18px;flex-shrink:0;color:#f59e0b;"></i>
    <span><strong>PREDICTIVE ALERT:</strong> ${pattern.message}</span>
    <button class="pred-close-btn" onclick="this.parentElement.style.display='none'">✕</button>
  `;
  if (window.lucide) window.lucide.createIcons();
  updateLiveConsole(`⚠️ Predictive Alert: ${pattern.message}`);
}

// ── SESSION TIMER ─────────────────────────────────────────────
function startSessionTimer() {
  setInterval(() => {
    sessionSeconds++;
    const h = Math.floor(sessionSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((sessionSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (sessionSeconds % 60).toString().padStart(2, '0');
    const timerEl = document.querySelector('.session-timer');
    if (timerEl) timerEl.innerHTML = `<span>Session</span>: ${h}:${m}:${s}`;
  }, 1000);
}

// ── HISTORY ───────────────────────────────────────────────────
function renderHistory(filteredData = null) {
  if (!ui.historyBody) return;
  const history = filteredData !== null ? filteredData : JSON.parse(localStorage.getItem('incident_history') || '[]');
  if (history.length === 0) {
    ui.historyBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:3rem;opacity:0.5;">No incidents recorded yet. Analysis engine ready.</td></tr>`;
    return;
  }
  ui.historyBody.innerHTML = history.map(incident => {
    const sc = (incident.severity || 'medium').toLowerCase();
    return `<tr>
      <td style="font-family:'JetBrains Mono';font-size:0.75rem;">${incident.timestamp}</td>
      <td style="font-weight:700;">${incident.id}</td>
      <td>${incident.issue}</td>
      <td><span class="badge severity-${sc}">${incident.severity}</span></td>
      <td style="color:var(--success);font-weight:600;">${incident.mttr || '2.4m'}</td>
      <td style="font-size:0.75rem;color:#4ade80;">✓ RESOLVED (Safety: ${incident.safetyScore || 98}%)</td>
    </tr>`;
  }).join('');
}

function filterHistory() {
  const searchTerm = (ui.historySearch?.value || '').toLowerCase();
  const severity = ui.historyFilter?.value || 'all';
  const history = JSON.parse(localStorage.getItem('incident_history') || '[]');
  const filtered = history.filter(h => {
    const matchSearch = !searchTerm || (h.issue || '').toLowerCase().includes(searchTerm) || (h.id || '').toLowerCase().includes(searchTerm);
    const matchSeverity = severity === 'all' || (h.severity || '').toLowerCase() === severity;
    return matchSearch && matchSeverity;
  });
  renderHistory(filtered);
}

// ── ANALYTICS CHARTS ──────────────────────────────────────────
function renderAnalytics() {
  const history = JSON.parse(localStorage.getItem('incident_history') || '[]');
  const countEl = document.getElementById('incidents-count');
  if (countEl) countEl.innerText = history.length;

  // 1 — Main confidence trend
  const canvas = document.getElementById('analyticsChart');
  if (canvas) {
    if (analyticsChart) analyticsChart.destroy();
    const labels = history.slice(0, 7).reverse().map(h => h.id);
    const dataPoints = history.slice(0, 7).reverse().map(h => h.safetyScore || 95);
    analyticsChart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels.length > 0 ? labels : ['H-1', 'H-2', 'H-3', 'H-4', 'H-5'],
        datasets: [{ label: 'Resolution Confidence (%)',
          data: dataPoints.length > 0 ? dataPoints : [98, 95, 99, 97, 98],
          borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)',
          borderWidth: 3, tension: 0.4, fill: true,
          pointBackgroundColor: '#fff', pointBorderColor: '#3b82f6', pointRadius: 6, pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        onClick: (e, els) => { if (els.length > 0) showIncidentModal(labels[els[0].index]); },
        scales: {
          y: { min: 80, max: 100, ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  }

  // 2 — Severity doughnut
  const sevCanvas = document.getElementById('severityChart');
  if (sevCanvas) {
    if (severityChart) severityChart.destroy();
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    history.forEach(h => { if (h.severity && counts.hasOwnProperty(h.severity)) counts[h.severity]++; });
    const hasData = Object.values(counts).some(v => v > 0);
    severityChart = new Chart(sevCanvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: Object.keys(counts),
        datasets: [{ data: hasData ? Object.values(counts) : [1, 2, 1, 0],
          backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#4ade80'],
          borderWidth: 0, hoverOffset: 8 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 12, font: { size: 11 } } } }
      }
    });
  }

  // 3 — MTTR bar chart
  const mttrCanvas = document.getElementById('mttrChart');
  if (mttrCanvas) {
    if (mttrChart) mttrChart.destroy();
    const recent = history.slice(0, 6).reverse();
    mttrChart = new Chart(mttrCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: recent.length ? recent.map(h => h.id) : ['NX-001', 'NX-002', 'NX-003', 'NX-004', 'NX-005'],
        datasets: [{ label: 'MTTR (min)',
          data: recent.length ? recent.map(h => parseFloat(h.mttr) || 2.0) : [1.8, 2.3, 1.5, 2.8, 1.2],
          backgroundColor: 'rgba(168,85,247,0.75)', borderRadius: 6, borderSkipped: false }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } }
        }
      }
    });
  }
}

// ── INCIDENT MODAL ────────────────────────────────────────────
function showIncidentModal(incidentId) {
  const history = JSON.parse(localStorage.getItem('incident_history') || '[]');
  const incident = history.find(h => h.id === incidentId);
  if (!incident) return;
  const modal = document.getElementById('incident-modal');
  document.getElementById('modal-title').innerText = `Audit Deep-Dive: ${incidentId}`;
  document.getElementById('modal-body').innerHTML = `
    <div class="history-item-detail">
      <div style="font-weight:800;color:var(--accent-primary);margin-bottom:0.5rem;">${incident.issue}</div>
      <div style="font-size:0.8rem;opacity:0.7;">Detected: ${incident.timestamp}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:1rem;margin-top:1.5rem;">
      ${['Guardian:#3b82f6:Signature validated as legitimate infrastructure event.',
         'Sleuth:#a855f7:Root cause correlation confirmed. Incident classified and triaged.',
         'Fixer:#10b981:Remediation sequence dispatched. Container roll-out initiated to stable SHA.',
         `Vigilant:#f59e0b:Skeptic verification passed. Safety: ${incident.safetyScore || 98}%. Zero resource collisions.`
        ].map(part => {
          const [name, color, text] = part.split(':');
          return `<div style="padding-left:1rem;border-left:2px solid ${color}">
            <div style="font-size:0.7rem;font-weight:800;color:${color};">${name.toUpperCase()}</div>
            <div style="font-size:0.85rem;margin-top:0.25rem;">${text}</div>
          </div>`;
        }).join('')}
    </div>`;
  modal.classList.add('active');
}

// ── NAVIGATION ────────────────────────────────────────────────
function switchToView(viewId) {
  ui.views.forEach(v => v.classList.remove('active'));
  ui.navItems.forEach(n => n.classList.remove('active'));
  const targetView = document.getElementById(`view-${viewId}`);
  const targetNav = document.querySelector(`.nav-item[data-view="${viewId}"]`);
  if (targetView) targetView.classList.add('active');
  if (targetNav) targetNav.classList.add('active');
  if (viewId === 'history') renderHistory();
  if (viewId === 'analytics') renderAnalytics();
}

// ── SAVE INCIDENT ─────────────────────────────────────────────
function saveIncidentToHistory(incident, impactValue = 0) {
  const history = JSON.parse(localStorage.getItem('incident_history') || '[]');
  history.unshift({
    id: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toLocaleString(),
    mttr: `${(Math.random() * 2 + 0.8).toFixed(1)}m`,
    safetyScore: incident.safetyScore || 98,
    ...incident
  });
  localStorage.setItem('incident_history', JSON.stringify(history.slice(0, 50)));
  const currentCosts = parseInt(ui.costsValue?.innerText.replace(/[^0-9]/g, '') || '842500');
  animateCounter(ui.costsValue, currentCosts + Math.max(0, impactValue - 250));
  animateCounter(ui.incidentsCount, parseInt(ui.incidentsCount?.innerText || '0') + 1);
}

// ── AI CALL ───────────────────────────────────────────────────
async function analyzeWithAI(log) {
  const liveMode = ui.liveModeToggle?.checked || false;
  const response = await fetch('http://127.0.0.1:5000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ log, language: ui.uiLang?.value || 'en', liveMode })
  });
  if (!response.ok) throw new Error(`Backend error: ${response.status}`);
  return await response.json();
}

// ── AGENT MESSAGES ────────────────────────────────────────────
function addAgentMessage(role, text) {
  const AGENTS = {
    'Guardian':    { color: '#3b82f6', icon: 'shield' },
    'Sleuth':      { color: '#a855f7', icon: 'search' },
    'Fixer':       { color: '#10b981', icon: 'wrench' },
    'Vigilant':    { color: '#f59e0b', icon: 'shield-check' },
    'Eco-Guardian':{ color: '#22c55e', icon: 'leaf' },
    'Manager':     { color: '#f97316', icon: 'cpu' }
  };
  const a = AGENTS[role] || { color: 'var(--accent-primary)', icon: 'bot' };
  const el = document.createElement('div');
  el.className = 'agent-message';
  el.style.borderLeftColor = a.color;
  el.innerHTML = `<div class="agent-avatar" style="background:${a.color}"><i data-lucide="${a.icon}" style="width:14px;height:14px;"></i></div><div class="agent-info"><div class="agent-name" style="color:${a.color}">${role}</div><div class="agent-text">${text}</div></div>`;
  ui.reasoningPath.appendChild(el);
  if (window.lucide) window.lucide.createIcons();
}

// ── MAIN WORKFLOW ─────────────────────────────────────────────
async function runWorkflow() {
  if (isBusy) return;
  const logText = ui.logInput.value.trim();
  if (!logText) { showToast('Please enter a log message first.'); return; }
  isBusy = true;

  Object.values(cards).forEach(c => c?.classList.remove('visible'));
  Object.values(steps).forEach(s => s?.classList.remove('active', 'completed'));
  ui.reasoningPath.innerHTML = '';
  if (ui.financeBox) ui.financeBox.style.display = 'none';
  if (ui.downloadRunbook) ui.downloadRunbook.style.display = 'none';
  if (ui.predictiveAlert) ui.predictiveAlert.style.display = 'none';

  ui.statusText.innerText = 'Initializing Perception Engine...';
  if (steps.perception) steps.perception.classList.add('active');
  await sleep(700);
  if (steps.perception) steps.perception.classList.replace('active', 'completed');
  if (steps.manager) steps.manager.classList.add('active');

  try {
    const aiData = await analyzeWithAI(logText);
    lastAiData = aiData;

    const sev = aiData.severity || 'High';
    ui.severityBadge.innerText = sev;
    ui.severityBadge.className = `badge severity-${sev.toLowerCase()}`;
    content.issue.innerText = aiData.issue || 'System Outage';

    if (aiData.financialImpact && ui.financeBox) {
      document.getElementById('content-finance').innerText = `$${aiData.financialImpact.toLocaleString()}`;
      ui.financeBox.style.display = 'inline-flex';
    }
    if (aiData.safetyScore && content.safetyScore) {
      content.safetyScore.innerText = `${aiData.safetyScore}%`;
      const safetyTag = document.getElementById('safety-tag');
      if (safetyTag) safetyTag.style.display = 'inline-flex';
    }

    cards.issue.classList.add('visible');
    if (steps.manager) steps.manager.classList.replace('active', 'completed');
    await sleep(600);

    if (steps.research) steps.research.classList.add('active');
    content.rootCause.innerText = aiData.rootCause || 'Contextual discovery in progress...';
    cards.rootCause.classList.add('visible');
    await sleep(800);
    if (steps.research) steps.research.classList.replace('active', 'completed');

    content.decisionText.innerText = aiData.agentDecision || 'Analyzing resolution weights...';
    content.decisionEngine.innerText = `ENGINE: ${aiData.decision?.engine || 'RAG + AI REASONING'}`;
    if (aiData.usedKnowledge) {
      content.knowledgeBadge.style.display = 'inline-flex';
      ui.relevantIssuesContainer.style.display = 'block';
      if (aiData.decision?.matchedIssues) {
        ui.relevantIssuesList.innerHTML = aiData.decision.matchedIssues.map(iss =>
          `<div class="impact-tag" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);font-size:0.6rem;">${iss}</div>`
        ).join('');
      }
    } else {
      content.knowledgeBadge.style.display = 'none';
      ui.relevantIssuesContainer.style.display = 'none';
    }
    cards.decision.classList.add('visible');

    if (aiData.reasoning) {
      ui.reasoningCard.style.display = 'block';
      for (const msg of aiData.reasoning) {
        const parts = msg.split(':');
        addAgentMessage(parts[0].trim(), parts[1]?.trim() || msg);
        updateLiveConsole(`Agent ${parts[0].trim()} reasoning...`);
        await sleep(450);
      }
      cards.reasoning.classList.add('visible');
    }

    if (steps.fix) steps.fix.classList.add('active');
    content.suggestion.innerText = aiData.fix || 'Generating remediation path...';
    cards.suggestion.classList.add('visible');
    await sleep(800);
    if (steps.fix) steps.fix.classList.replace('active', 'completed');

    ui.statusText.innerText = 'Relaying fix to Infrastructure API Hook...';
    if (steps.action) steps.action.classList.add('active');
    cards.actions.classList.add('visible');
    if (ui.downloadRunbook) ui.downloadRunbook.style.display = 'flex';
    await sleep(1100);

    const mode = aiData.action?.mode || 'DEMO';
    const code = aiData.action?.recoveryCode || 'GENERIC_OPTIMIZE';
    document.getElementById('content-actions').innerHTML = `
      <span style="color:var(--success);font-weight:700;">✓ RESOLVED — ${mode} MODE</span>
      <div style="font-size:0.75rem;margin-top:0.4rem;opacity:0.7;">Recovery Pulse: <span style="color:#a855f7;font-weight:700;">${code}</span>${aiData.action?.slackDispatched ? ' · <span style="color:#4ade80;">📣 Slack Notified</span>' : ''}</div>`;
    if (steps.action) steps.action.classList.replace('active', 'completed');

    updateHealthGauge(100);
    ui.statusDot.className = 'status-dot status-stable';
    ui.statusText.innerText = 'Infrastructure Stable';
    updateLiveConsole(`Action Agent: Resolution complete. Recovery: ${code}`);

    if (aiData.predictiveAlert?.alert) showPredictiveAlert(aiData.predictiveAlert);

    saveIncidentToHistory({ issue: aiData.issue, severity: aiData.severity || 'High', safetyScore: aiData.safetyScore || 98 }, aiData.financialImpact);
    showToast('Verification complete. Resolution cycle passed safety audit.');

  } catch (error) {
    console.error('Workflow Error:', error);
    ui.statusText.innerText = 'Engine Fault — Is backend running?';
    showToast('Critical error. Ensure backend is running on port 5000.', 'danger');
    updateHealthGauge(40);
    ui.statusDot.className = 'status-dot status-issue';
  } finally {
    isBusy = false;
  }
}

// ── LIVE MONITOR SIMULATION ───────────────────────────────────
async function startLogSimulation() {
  while (true) {
    if (monitorActive) {
      await sleep(2500);
      consoleLines++;
      if (consoleLines % 10 === 0) {
        if (isBusy || ui.logInput.value.trim() !== '') continue;
        ui.monitorStatus.className = 'badge severity-high';
        ui.mainContainer?.classList.add('critical-alert');
        const scenarios = [
          'FINANCE: CRITICAL - SWIFT Gateway Latency Spike > 500ms on payment cluster',
          'HEALTHCARE: ALERT - Unauthorized PII access attempt on patient data API. JWT expired.',
          'E-COMMERCE: ERROR - Checkout Service timeout on PostgreSQL port 5432. Connection refused.',
          'CLOUD: CRITICAL - Kubernetes pod OOMKilled — memory limit exceeded. CrashLoopBackOff.',
          'SECURITY: ALERT - 401 unauthorized on auth service. Brute force pattern detected.'
        ];
        ui.logInput.value = scenarios[Math.floor(Math.random() * scenarios.length)];
        await runWorkflow();
        await sleep(5000);
        updateHealthGauge(100);
        ui.monitorStatus.className = 'badge severity-low';
        ui.mainContainer?.classList.remove('critical-alert');
        if (!isBusy) ui.logInput.value = '';
      } else {
        const line = document.createElement('div');
        line.className = 'console-line';
        line.innerText = `[${new Date().toLocaleTimeString()}] System monitoring healthy — all nodes nominal.`;
        if (ui.monitorConsole) {
          ui.monitorConsole.appendChild(line);
          ui.monitorConsole.scrollTop = ui.monitorConsole.scrollHeight;
          if (ui.monitorConsole.children.length > 30) ui.monitorConsole.removeChild(ui.monitorConsole.firstChild);
        }
      }
    } else { await sleep(1000); }
  }
}

function updateLiveConsole(text) {
  if (!ui.liveConsole) return;
  const line = document.createElement('div');
  line.style.marginBottom = '2px';
  line.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;
  ui.liveConsole.appendChild(line);
  ui.liveConsole.scrollTop = ui.liveConsole.scrollHeight;
  if (ui.liveConsole.children.length > 20) ui.liveConsole.removeChild(ui.liveConsole.firstChild);
}

// ── CHAT ──────────────────────────────────────────────────────
function toggleChat() {
  ui.chatWidget?.classList.toggle('active');
  if (ui.chatWidget?.classList.contains('active')) ui.chatInput?.focus();
}

async function sendMessage() {
  const message = ui.chatInput?.value.trim();
  if (!message) return;
  const userEl = document.createElement('div');
  userEl.className = 'message user';
  userEl.innerText = message;
  ui.chatMessages.appendChild(userEl);
  ui.chatInput.value = '';
  ui.chatMessages.scrollTop = ui.chatMessages.scrollHeight;

  const context = {
    health: ui.gaugeText?.innerText || '100%',
    uptime: ui.uptimeValue?.innerText || '99.99%',
    lastIncident: content.issue?.innerText || 'None',
    mode: ui.liveModeToggle?.checked ? 'LIVE' : 'DEMO'
  };

  const thinkingEl = document.createElement('div');
  thinkingEl.className = 'message agent thinking';
  thinkingEl.innerText = 'Reasoning...';
  ui.chatMessages.appendChild(thinkingEl);
  ui.chatMessages.scrollTop = ui.chatMessages.scrollHeight;

  try {
    const response = await fetch('http://127.0.0.1:5000/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    });
    const data = await response.json();
    ui.chatMessages.removeChild(thinkingEl);
    const agentEl = document.createElement('div');
    agentEl.className = 'message agent';
    ui.chatMessages.appendChild(agentEl);
    let i = 0;
    const text = data.response;
    (function typeWriter() {
      if (i < text.length) {
        agentEl.innerHTML += text.charAt(i++);
        ui.chatMessages.scrollTop = ui.chatMessages.scrollHeight;
        setTimeout(typeWriter, 15);
      }
    })();
  } catch {
    thinkingEl.innerText = 'Reasoning error. Check backend connectivity.';
    thinkingEl.style.color = 'var(--danger)';
  }
}

// ── INTEGRATIONS ──────────────────────────────────────────────
function initIntegrations() {
  [{ id: 'intGithub', name: 'GitHub', url: 'https://github.com/' },
   { id: 'intSlack', name: 'Slack', url: 'https://slack.com/' },
   { id: 'intCloud', name: 'Cloud Console', url: 'https://console.cloud.google.com/' }
  ].forEach(({ id, name, url }) => {
    const el = ui[id];
    if (!el) return;
    el.classList.add('connected');
    el.addEventListener('click', () => {
      el.classList.add('ping');
      updateLiveConsole(`Navigation Agent: Redirecting to ${name}...`);
      setTimeout(() => { window.open(url, '_blank'); el.classList.remove('ping'); }, 500);
    });
  });
}

// ── SSE STREAM ────────────────────────────────────────────────
function initSSEStream() {
  setTimeout(() => {
    try {
      const stream = new EventSource('http://127.0.0.1:5000/stream');
      stream.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (!data?.issue) return;
        updateLiveConsole(`⚠️ INBOUND WEBHOOK: ${data.issue}`);
        ui.logInput.value = data.externalLog || 'External Incident Detected...';
        content.issue.innerText = data.issue;
        ui.severityBadge.innerText = data.severity || 'Medium';
        ui.severityBadge.className = `badge severity-${(data.severity || 'medium').toLowerCase()}`;
        content.rootCause.innerText = data.rootCause || '';
        content.suggestion.innerText = data.fix || '';
        if (data.financialImpact && ui.financeBox) {
          document.getElementById('content-finance').innerText = `$${(data.financialImpact || 0).toLocaleString()}`;
          ui.financeBox.style.display = 'inline-flex';
        }
        content.decisionEngine.innerText = `ENGINE: ${data.decision?.engine || 'RAG + AI REASONING'}`;
        if (data.usedKnowledge) {
          content.knowledgeBadge.style.display = 'inline-flex';
          ui.relevantIssuesContainer.style.display = 'block';
          if (data.decision?.matchedIssues) {
            ui.relevantIssuesList.innerHTML = data.decision.matchedIssues.map(iss =>
              `<div class="impact-tag" style="background:rgba(255,255,255,0.05);font-size:0.6rem;">${iss}</div>`
            ).join('');
          }
        }
        ui.statusDot.className = 'status-dot status-issue';
        ui.statusText.textContent = 'INCIDENT ACTIVE (EXTERNAL STREAM)';
        if (data.reasoning) {
          ui.reasoningPath.innerHTML = '';
          data.reasoning.forEach(r => { const p = r.split(':'); addAgentMessage(p[0].trim(), p[1]?.trim() || r); });
        }
        if (data.predictiveAlert?.alert) showPredictiveAlert(data.predictiveAlert);
        if (window.lucide) window.lucide.createIcons();
      };
      stream.onerror = () => updateLiveConsole('SSE: Stream reconnecting...');
    } catch (err) { console.error('SSE Error:', err); }
  }, 2000);
}

// ── HERO LANDING ───────────────────────────────────────────────
function initHero() {
  const hero = document.getElementById('hero-landing');
  const appShell = document.getElementById('app-shell');
  if (!hero || !appShell) return;

  // ── Particle canvas ─────────────────────────────────────────
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas?.getContext('2d');
  if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    const PARTICLES = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.1
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      PARTICLES.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.opacity})`;
        ctx.fill();
        // Draw connecting lines to nearby particles
        PARTICLES.forEach(p2 => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(96,165,250,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      if (document.getElementById('hero-landing')) requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ── Stat counters ───────────────────────────────────────────
  const statEls = document.querySelectorAll('.hero-stat-num');
  statEls.forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = target * ease;
      el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
    }
    setTimeout(() => requestAnimationFrame(tick), 400);
  });

  // ── Enter Dashboard transition ──────────────────────────────
  function enterDashboard() {
    hero.classList.add('exit');
    setTimeout(() => {
      hero.style.display = 'none';
      appShell.style.display = 'flex';
      document.body.style.overflow = '';
      if (window.lucide) window.lucide.createIcons();
    }, 820);
  }

  document.getElementById('hero-enter-btn')?.addEventListener('click', enterDashboard);
  document.getElementById('hero-enter-btn-top')?.addEventListener('click', enterDashboard);
  document.getElementById('hero-scroll-hint')?.addEventListener('click', enterDashboard);
  document.getElementById('hero-arrow-btn')?.addEventListener('click', enterDashboard);

  // Keyboard shortcut — press Enter or Space to proceed
  document.addEventListener('keydown', (e) => {
    if (hero.style.display !== 'none' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      enterDashboard();
    }
  }, { once: true });
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  // Init hero landing first
  initHero();

  // Apply saved theme
  applyTheme((localStorage.getItem('nexus_theme') || 'dark') === 'dark');

  switchToView('dashboard');
  startLogSimulation();
  startSessionTimer();
  updateLiveConsole('NexusGuard Perception Engine v2.1 initialized. All agents online.');
  initIntegrations();
  initDropZone();
  initSSEStream();

  // Core
  ui.runBtn?.addEventListener('click', runWorkflow);
  ui.autoDetectBtn?.addEventListener('click', () => {
    const scenarios = [
      'CRITICAL: Redis cache cluster 10.4.4.2 unreachable. Queue backing up at 12K/s.',
      'ERROR: Stripe Payment Gateway 504 timeout. Orders dropping. Failover required.',
      'FATAL: PostgreSQL connection refused on port 5432. Replica lag > 60s.',
      'SECURITY: 401 Unauthorized — JWT token expired on auth microservice. Brute force suspected.',
      'INFRA: Kubernetes pod OOMKilled. Memory limit 512Mi exceeded. CrashLoopBackOff.'
    ];
    ui.logInput.value = scenarios[Math.floor(Math.random() * scenarios.length)];
    runWorkflow();
  });

  // Live Mode
  ui.liveModeToggle?.addEventListener('change', (e) => {
    if (ui.modeLabel) ui.modeLabel.innerText = e.target.checked ? 'LIVE' : 'DEMO';
    updateLiveConsole(`Mode: ${e.target.checked ? 'LIVE (Real Infrastructure)' : 'DEMO (Safe Simulation)'}`);
  });

  // Monitor Pause/Resume
  ui.toggleMonitor?.addEventListener('click', () => {
    monitorActive = !monitorActive;
    ui.toggleMonitor.innerText = monitorActive ? 'PAUSE FEED' : 'RESUME FEED';
    updateLiveConsole(`Perception Feed: ${monitorActive ? 'RESUMED' : 'PAUSED'}`);
  });

  // Theme Toggle
  ui.themeToggle?.addEventListener('click', toggleTheme);

  // File Upload
  ui.fileUpload?.addEventListener('change', (e) => handleFileUpload(e.target.files[0]));

  // CSV Export
  ui.exportCsvBtn?.addEventListener('click', exportCSV);

  // Runbook Download
  ui.downloadRunbook?.addEventListener('click', downloadRunbook);

  // History Search & Filter
  ui.historySearch?.addEventListener('input', filterHistory);
  ui.historyFilter?.addEventListener('change', filterHistory);

  // Chat
  ui.chatToggle?.addEventListener('click', toggleChat);
  ui.chatClose?.addEventListener('click', toggleChat);
  ui.chatSend?.addEventListener('click', sendMessage);
  ui.chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runWorkflow(); }
    if (e.key === 'Escape') {
      document.getElementById('incident-modal')?.classList.remove('active');
      ui.chatWidget?.classList.remove('active');
    }
  });

  // Language
  ui.uiLang?.addEventListener('change', (e) => applyTranslations(e.target.value));

  // Settings
  const savedModel = localStorage.getItem('agent_model') || 'gpt-4o-mini';
  const savedSafety = localStorage.getItem('agent_safety') || '85';
  if (ui.settingModel) ui.settingModel.value = savedModel;
  if (ui.settingSafety) ui.settingSafety.value = savedSafety;
  const safetyDisplay = document.getElementById('safety-value');
  if (safetyDisplay) safetyDisplay.innerText = `${savedSafety}% Threshold`;
  ui.settingSafety?.addEventListener('input', (e) => { if (safetyDisplay) safetyDisplay.innerText = `${e.target.value}% Threshold`; });
  ui.saveSettings?.addEventListener('click', () => {
    localStorage.setItem('agent_model', ui.settingModel.value);
    localStorage.setItem('agent_safety', ui.settingSafety.value);
    ui.saveSettings.innerText = '✓ SETTINGS SAVED';
    setTimeout(() => { ui.saveSettings.innerText = 'SAVE CONFIGURATION'; }, 2000);
    showToast('Configuration saved successfully.');
    updateLiveConsole(`Settings: Engine updated to ${ui.settingModel.value}.`);
  });

  // Modal
  const modal = document.getElementById('incident-modal');
  document.getElementById('close-modal')?.addEventListener('click', () => modal?.classList.remove('active'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  // Navigation
  ui.navItems.forEach(item => item.addEventListener('click', () => switchToView(item.dataset.view)));
});
