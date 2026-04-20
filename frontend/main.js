// main.js - NexusGuard Professional SaaS Platform v2.1
// ============================================================

// -- GLOBAL STATE ---------------------------------------------
let lastAiData = null;
let isBusy = false;
let monitorActive = true;
let consoleLines = 0;
let sessionSeconds = 0;
let analyticsChart = null;
let mttrChart = null;
let severityChart = null;
let isDarkTheme = true;
let topologyNodes = []; // Global registry for interactive canvas nodes

// -- UI REFERENCES ---------------------------------------------
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
  // -- NEW --
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

// -- i18n DICTIONARIES ----------------------------------------
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

// -- UTILITIES ------------------------------------------------
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

// -- THEME ----------------------------------------------------─
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

// -- i18n ------------------------------------------------------
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

// -- FILE UPLOAD ----------------------------------------------─
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

// -- CSV EXPORT ------------------------------------------------
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

// -- RUNBOOK GENERATOR ----------------------------------------─
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

// -- PREDICTIVE ALERT ------------------------------------------
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

// -- SESSION TIMER --------------------------------------------─
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

// -- HISTORY --------------------------------------------------─
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

// -- ANALYTICS CHARTS ------------------------------------------
function renderAnalytics() {
  const history = JSON.parse(localStorage.getItem('incident_history') || '[]');
  const countEl = document.getElementById('incidents-count');
  if (countEl) countEl.innerText = history.length;

    // 1 — Main confidence trend
    const canvas = document.getElementById('analyticsChart');
    if (canvas) {
      if (analyticsChart) analyticsChart.destroy();
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

      const labels = history.slice(0, 7).reverse().map(h => h.id);
      const dataPoints = history.slice(0, 7).reverse().map(h => h.safetyScore || 95);
      analyticsChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels.length > 0 ? labels : ['H-1', 'H-2', 'H-3', 'H-4', 'H-5'],
          datasets: [{ label: 'Resolution Confidence (%)',
            data: dataPoints.length > 0 ? dataPoints : [98, 95, 99, 97, 98],
            borderColor: '#3b82f6', backgroundColor: gradient,
            borderWidth: 3, tension: 0.4, fill: true,
            pointBackgroundColor: '#fff', pointBorderColor: '#3b82f6', pointRadius: 6, pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { 
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 10,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1
            }
          },
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

// -- INCIDENT MODAL --------------------------------------------
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

// -- NAVIGATION ------------------------------------------------
function switchToView(viewId) {
  ui.views.forEach(v => v.classList.remove('active'));
  ui.navItems.forEach(n => n.classList.remove('active'));
  
  const targetView = document.getElementById(`view-${viewId}`);
  const targetNav = document.querySelector(`.nav-item[data-view="${viewId}"]`);
  
  if (targetView) targetView.classList.add('active');
  if (targetNav) targetNav.classList.add('active');

  // Update Breadcrumb/Title
  const titleMap = {
    'dashboard': 'Global Command Center',
    'topology': 'Infrastructure Topology',
    'workflow': 'Agent Workflow Builder',
    'status': 'System Operational Status',
    'analytics': 'Global ROI Analytics',
    'security': 'Security & Compliance hub',
    'audit': 'Enterprise Audit Ledger',
    'knowledge': 'RAG Knowledge Base',
    'billing': 'ROI & Financials',
    'profile': 'User Profile Settings',
    'settings': 'Agent Configuration'
  };
  if (document.getElementById('view-title')) {
    document.getElementById('view-title').innerText = titleMap[viewId] || viewId.toUpperCase();
  }

  // Render Logic
  if (viewId === 'history') renderHistory();
  if (viewId === 'analytics') renderAnalytics();
  if (viewId === 'status') renderStatusPage();
  if (viewId === 'topology') renderTopology();
  if (viewId === 'workflow') renderWorkflow();
  if (viewId === 'security') renderSecurity();
  if (viewId === 'audit') renderAudit();
  if (viewId === 'knowledge') renderKnowledge();
  if (viewId === 'billing') renderBilling();
}

function renderSecurity() {
  const matrix = document.getElementById('threat-matrix-grid');
  if (!matrix) return;
  matrix.innerHTML = '';
  // Generate 48 matrix nodes
  for (let i = 0; i < 48; i++) {
    const node = document.createElement('div');
    node.className = 'matrix-node';
    const roll = Math.random();
    if (roll > 0.95) node.classList.add('threat-active');
    else if (roll > 0.85) node.classList.add('warning');
    
    const labels = ['Auth-Gate', 'Redis-L2', 'VPC-Tunnel', 'Core-API', 'K8s-Sdl', 'Ingress-01'];
    node.setAttribute('data-label', labels[Math.floor(Math.random() * labels.length)]);
    matrix.appendChild(node);
  }
}

function renderAudit(filteredData = null) {
    const body = document.getElementById('audit-body');
    if (!body) return;
    const history = filteredData !== null ? filteredData : JSON.parse(localStorage.getItem('incident_history') || '[]');
    if (history.length === 0) {
        body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:3rem;opacity:0.5;">Audit ledger empty. System monitoring active.</td></tr>`;
        return;
    }
    body.innerHTML = history.map(h => {
        const sevClass = (h.severity || 'low').toLowerCase();
        const status = h.status === 'Failed' ? 'failed' : (h.status === 'Processing' ? 'active' : 'resolved');
        const statusText = h.status || 'RESOLVED';
        
        return `<tr class="audit-table-row">
            <td style="font-family:'JetBrains Mono';font-size:0.7rem;opacity:0.8;">${h.timestamp}</td>
            <td style="font-weight:700;font-size:0.75rem;">${h.user || 'AI_AGENT_RESOLVER'}</td>
            <td style="font-size:0.8rem;">${h.issue}</td>
            <td><span class="badge severity-${sevClass}">${h.severity}</span></td>
            <td><span class="audit-pill ${status}">${statusText}</span></td>
        </tr>`;
    }).join('');
}

function filterAudit() {
    const search = (document.getElementById('audit-search')?.value || '').toLowerCase();
    const history = JSON.parse(localStorage.getItem('incident_history') || '[]');
    const filtered = history.filter(h => 
        (h.issue || '').toLowerCase().includes(search) || 
        (h.user || '').toLowerCase().includes(search)
    );
    renderAudit(filtered);
}

// -- KNOWLEDGE INGESTION (HARVESTER) --------------------------
async function handleIngestKnowledge() {
    const category = document.getElementById('ingest-category').value;
    const content = document.getElementById('ingest-content').value.trim();
    if (!content) { showToast('Please enter runbook content to ingest.', 'warning'); return; }

    const harvester = document.querySelector('#view-knowledge-ingest .glass-card');
    const scanner = document.createElement('div');
    scanner.className = 'ingest-scanner-overlay';
    harvester.appendChild(scanner);

    showToast(`Harvester: tokenizing ${category} context...`, 'info');
    updateLiveConsole(`📚 RAG Agent: Processing knowledge chunk [Type: ${category}]`);

    await sleep(2000); // Simulate processing

    const facts = JSON.parse(localStorage.getItem('ingested_facts') || '[]');
    facts.unshift({
        id: `FACT-${Math.floor(1000 + Math.random()*9000)}`,
        category,
        text: content.substring(0, 180) + (content.length > 180 ? '...' : ''),
        trust: 95 + Math.floor(Math.random()*5),
        timestamp: new Date().toLocaleTimeString()
    });
    localStorage.setItem('ingested_facts', JSON.stringify(facts.slice(0, 10)));
    
    scanner.remove();
    document.getElementById('ingest-content').value = '';
    renderKnowledgeFacts();
    
    showToast('Knowledge ingested successfully. Neural weights updated.', 'success');
    updateLiveConsole(`🧠 Brain Ingestion: Concepts integrated into Global Reasoning Hub.`);
}

function renderKnowledgeFacts() {
    const list = document.getElementById('learned-facts-list');
    const badge = document.getElementById('ingest-count-badge');
    if (!list) return;

    const facts = JSON.parse(localStorage.getItem('ingested_facts') || '[]');
    badge.innerText = `${facts.length} Concepts Learned`;

    if (facts.length === 0) {
        list.innerHTML = `<div style="padding:2rem;text-align:center;background:rgba(255,255,255,0.01);border:1px dashed var(--border-color);border-radius:12px;color:var(--text-secondary);font-size:0.85rem;">No dynamic knowledge ingested yet.</div>`;
        return;
    }

    list.innerHTML = facts.map(f => `
        <div class="intelligence-card">
            <div class="int-card-header">
                <span class="int-category">${f.category}</span>
                <span class="int-trust"><i data-lucide="shield-check" style="width:12px;display:inline;margin-right:4px;"></i>${f.trust}% Trust</span>
            </div>
            <div class="int-fact">"${f.text}"</div>
            <div class="int-footer">
                <i data-lucide="clock" style="width:10px;"></i> ${f.timestamp} · ID: ${f.id}
            </div>
        </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
}

// -- SAVE INCIDENT --------------------------------------------─
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

// -- AI CALL --------------------------------------------------─
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

// -- AGENT MESSAGES --------------------------------------------
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

// -- MAIN WORKFLOW --------------------------------------------─
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

// -- LIVE MONITOR SIMULATION ----------------------------------─
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

// -- CHAT ------------------------------------------------------
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

// -- INTEGRATIONS ----------------------------------------------
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

// -- SSE STREAM ------------------------------------------------
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

// -- COLLAPSIBLE SIDEBAR ----------------------------------------
function initSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  if (!sidebar || !toggleBtn) return;
  const savedState = localStorage.getItem('nexus_sidebar_collapsed') === 'true';
  if (savedState) sidebar.classList.add('collapsed');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    localStorage.setItem('nexus_sidebar_collapsed', sidebar.classList.contains('collapsed'));
    if (window.lucide) window.lucide.createIcons();
  });
}

// -- KEYBOARD SHORTCUTS MODAL ----------------------------------─
function initShortcutsModal() {
  const modal = document.getElementById('shortcuts-modal');
  const closeBtn = document.getElementById('shortcuts-close');
  if (!modal) return;
  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}

// -- ONBOARDING WIZARD ------------------------------------------
function initOnboarding() {
  const overlay = document.getElementById('onboarding-overlay');
  if (!overlay) return;
  // Show only on first visit
  if (localStorage.getItem('nexus_onboarded') === 'true') {
    overlay.style.display = 'none';
    return;
  }
  overlay.classList.add('active');

  function goToStep(n) {
    document.querySelectorAll('.onboarding-step').forEach(s => s.style.display = 'none');
    const step = document.getElementById(`ob-step-${n}`);
    if (step) step.style.display = 'flex';
    document.querySelectorAll('.onboarding-step-pip').forEach(p => {
      const sn = parseInt(p.dataset.step);
      p.classList.toggle('active', sn === n);
      p.classList.toggle('done', sn < n);
    });
  }

  document.querySelectorAll('.ob-next').forEach(btn => {
    btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.next)));
  });

  document.getElementById('ob-save-keys')?.addEventListener('click', () => {
    const openKey = document.getElementById('ob-openai-key')?.value.trim();
    const gemKey  = document.getElementById('ob-gemini-key')?.value.trim();
    if (openKey) {
      localStorage.setItem('nexus_openai_key', openKey);
      const st = document.getElementById('ob-key-status');
      if (st) st.innerHTML = '<span>✅</span><span>OpenAI key saved — Live AI mode enabled</span>';
    }
    if (gemKey) localStorage.setItem('nexus_gemini_key', gemKey);
    goToStep(3);
  });

  document.querySelectorAll('.ob-skip').forEach(btn => {
    btn.addEventListener('click', () => {
      const cur = parseInt([...document.querySelectorAll('.onboarding-step')]
        .find(s => s.style.display !== 'none')?.id.split('-').pop() || '1');
      if (cur < 3) goToStep(3); else finishOnboarding();
    });
  });

  document.getElementById('ob-finish')?.addEventListener('click', finishOnboarding);

  function finishOnboarding() {
    overlay.classList.remove('active');
    overlay.style.display = 'none';
    localStorage.setItem('nexus_onboarded', 'true');
    showToast('🎉 Welcome to NexusGuard! Try the Auto-Detect button to run your first analysis.');
  }
}

// -- TEAM MEMBERS ----------------------------------------------─
const AVATAR_COLORS = ['#3b82f6','#818cf8','#10b981','#f59e0b','#ef4444','#a855f7','#ec4899'];
function initTeamMembers() {
  const listEl = document.getElementById('team-members-list');
  const inviteBtn = document.getElementById('invite-btn');
  const emailInput = document.getElementById('invite-email');
  const roleSelect = document.getElementById('invite-role');
  if (!listEl || !inviteBtn) return;

  // Seed default members
  if (!localStorage.getItem('nexus_team')) {
    const defaults = [
      { email: 'admin@nexusguard.io', role: 'admin', joined: 'Owner · Since Apr 2026' },
      { email: 'sre-lead@company.com', role: 'sre', joined: 'Joined Apr 19, 2026' },
    ];
    localStorage.setItem('nexus_team', JSON.stringify(defaults));
  }

  function renderTeam() {
    const members = JSON.parse(localStorage.getItem('nexus_team') || '[]');
    listEl.innerHTML = members.map((m, i) => {
      const initials = m.email.split('@')[0].substring(0, 2).toUpperCase();
      const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
      return `<div class="team-member-row">
        <div class="team-avatar" style="background:${color};">${initials}</div>
        <div class="team-info">
          <div class="team-email">${m.email}</div>
          <div class="team-joined">${m.joined}</div>
        </div>
        <span class="team-role-badge role-${m.role}">${m.role.toUpperCase()}</span>
        ${i > 0 ? `<button class="team-remove-btn" data-idx="${i}" title="Remove">✕</button>` : ''}
      </div>`;
    }).join('');
    listEl.querySelectorAll('.team-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const members = JSON.parse(localStorage.getItem('nexus_team') || '[]');
        members.splice(parseInt(btn.dataset.idx), 1);
        localStorage.setItem('nexus_team', JSON.stringify(members));
        renderTeam();
        showToast('Member removed.');
      });
    });
  }

  inviteBtn.addEventListener('click', () => {
    const email = emailInput?.value.trim();
    if (!email || !email.includes('@')) { showToast('Please enter a valid email.', 'danger'); return; }
    const members = JSON.parse(localStorage.getItem('nexus_team') || '[]');
    if (members.find(m => m.email === email)) { showToast('This member is already in the team.', 'danger'); return; }
    members.push({ email, role: roleSelect.value, joined: `Invited ${new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}` });
    localStorage.setItem('nexus_team', JSON.stringify(members));
    emailInput.value = '';
    renderTeam();
    showToast(`✅ Invitation sent to ${email}`);
    if (window.lucide) window.lucide.createIcons();
  });

  renderTeam();
}

// -- PDF REPORT EXPORT ----------------------------------------─
function exportPDF() {
  if (!lastAiData) { showToast('Run an analysis first to generate a PDF report.', 'danger'); return; }
  const id = `NX-${Math.floor(1000 + Math.random() * 9000)}`;
  const ts = new Date().toLocaleString();
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NexusGuard Incident Report — ${id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',sans-serif; background:#fff; color:#1e293b; padding:48px; font-size:13px; }
    .header { display:flex; align-items:center; gap:16px; margin-bottom:32px; padding-bottom:24px; border-bottom:2px solid #e2e8f0; }
    .logo { font-size:22px; font-weight:900; color:#1e293b; }
    .logo span { color:#3b82f6; }
    .meta { margin-left:auto; text-align:right; font-size:11px; color:#64748b; }
    .badge { display:inline-block; padding:3px 10px; border-radius:999px; font-size:10px; font-weight:800; }
    .badge-critical { background:#fee2e2; color:#ef4444; }
    .badge-high { background:#ffedd5; color:#f97316; }
    .badge-medium { background:#fef9c3; color:#ca8a04; }
    .badge-low { background:#dcfce7; color:#16a34a; }
    h1 { font-size:24px; font-weight:900; margin-bottom:4px; color:#0f172a; }
    h2 { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#3b82f6; margin:28px 0 10px; border-bottom:1px solid #e2e8f0; padding-bottom:6px; }
    p { line-height:1.7; color:#334155; }
    table { width:100%; border-collapse:collapse; margin-bottom:12px; }
    td { padding:8px 12px; border-bottom:1px solid #f1f5f9; font-size:12px; }
    td:first-child { color:#64748b; width:200px; font-weight:600; }
    .code { font-family:'JetBrains Mono',monospace; background:#f8fafc; padding:12px 16px; border-radius:6px; font-size:11.5px; border:1px solid #e2e8f0; line-height:1.7; white-space:pre-wrap; }
    .agent-row { display:flex; gap:10px; padding:8px 0; border-bottom:1px solid #f1f5f9; }
    .agent-name { font-weight:700; width:90px; flex-shrink:0; }
    .footer { margin-top:40px; padding-top:16px; border-top:1px solid #e2e8f0; font-size:10px; color:#94a3b8; display:flex; justify-content:space-between; }
    .status-ok { color:#16a34a; font-weight:700; }
    @media print { body { padding:24px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Nexus<span>Guard</span></div>
      <div style="font-size:10px;color:#94a3b8;margin-top:2px;">Autonomous DevOps Platform v2.1</div>
    </div>
    <div class="meta">
      <div style="font-weight:700;font-size:14px;">Incident Report</div>
      <div>${ts}</div>
      <div style="margin-top:4px;font-weight:600;color:#3b82f6;">${id}</div>
    </div>
  </div>
  <h1>${lastAiData.issue || 'Infrastructure Incident'} <span class="badge badge-${(lastAiData.severity||'high').toLowerCase()}">${lastAiData.severity||'HIGH'}</span></h1>
  <h2>Incident Summary</h2>
  <table>
    <tr><td>Incident ID</td><td><strong>${id}</strong></td></tr>
    <tr><td>Timestamp</td><td>${ts}</td></tr>
    <tr><td>Severity</td><td>${lastAiData.severity||'High'}</td></tr>
    <tr><td>Confidence</td><td>${Math.round((lastAiData.confidence||0.88)*100)}%</td></tr>
    <tr><td>Safety Score</td><td>${lastAiData.safetyScore||98}%</td></tr>
    <tr><td>Financial Risk</td><td>$${(lastAiData.financialImpact||0).toLocaleString()}</td></tr>
    <tr><td>RAG Knowledge Used</td><td>${lastAiData.usedKnowledge ? '✅ Yes' : 'No'}</td></tr>
    <tr><td>Recovery Code</td><td><code>${lastAiData.action?.recoveryCode||'GENERIC_OPTIMIZE'}</code></td></tr>
    <tr><td>Slack Notified</td><td>${lastAiData.action?.slackDispatched ? '✅ Yes' : 'Not configured'}</td></tr>
    <tr><td>Status</td><td class="status-ok">✓ RESOLVED</td></tr>
  </table>
  <h2>Root Cause Analysis</h2>
  <p>${lastAiData.rootCause||'See analysis output.'}</p>
  <h2>Remediation Steps</h2>
  <div class="code">${(lastAiData.fix||'').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
  <h2>Multi-Agent Reasoning Chain</h2>
  ${(lastAiData.reasoning||[]).map(r => {
    const [name,...rest] = r.split(':');
    return `<div class="agent-row"><span class="agent-name">${name||'Agent'}</span><span>${rest.join(':').trim()||r}</span></div>`;
  }).join('')}
  <h2>Agent Decision</h2>
  <p>${lastAiData.agentDecision||'N/A'}</p>
  <div class="footer">
    <span>Auto-generated by NexusGuard Autonomous DevOps Platform v2.1 · Agentathon 2026</span>
    <span>CONFIDENTIAL</span>
  </div>
</body>
</html>`);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 800);
  showToast('📄 PDF report opened in new tab. Use browser print dialog to save.');
}

// -- SIMULATE MAJOR OUTAGE ------------------------------------─
function initSimulateOutage() {
  const btn = document.getElementById('simulate-outage-btn');
  if (!btn) return;
  const OUTAGE_SCENARIOS = [
    'CRITICAL: Database cluster down — PostgreSQL port 5432 refused on ALL replicas. 0 healthy nodes. Failover failed.',
    'FINANCE CRITICAL: SWIFT payment gateway 504 timeout. Checkout orders dropping at 340/min. Redis cache unreachable.',
    'SECURITY: Brute-force detected — 5,200 failed JWT auth attempts in 60s. Auth service CPU at 98%. Possible DDoS.',
    'INFRA: Kubernetes OOMKilled cascade — 12 pods CrashLoopBackOff. Memory limit 512Mi breached on payment namespace.',
    'MULTI-SERVICE: Elasticsearch cluster red (3 shards unassigned) + Kafka consumer lag 2M messages + API latency >8s.'
  ];
  btn.addEventListener('click', async () => {
    if (isBusy) { showToast('Agent pipeline already running. Please wait.'); return; }
    const log = OUTAGE_SCENARIOS[Math.floor(Math.random() * OUTAGE_SCENARIOS.length)];
    btn.classList.add('firing');
    btn.textContent = '⚡ Cascading Failure Detected...';
    showToast('🚨 Multi-service failure injected! Agents activating...', 'danger');
    addNotification('🔴 CRITICAL', log.substring(0, 60) + '…', '#ef4444');
    ui.logInput.value = log;
    switchToView('dashboard');
    await sleep(500);
    await runWorkflow();
    btn.classList.remove('firing');
    btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> 🚨 Simulate Major Outage';
  });
}

// -- NOTIFICATION CENTER ----------------------------------------
const NOTIFICATIONS = [
  { title: '🔴 CRITICAL — Redis OOMKilled', time: '2 min ago', color: '#ef4444', unread: true },
  { title: '🟡 HIGH — Auth 401 spike detected', time: '18 min ago', color: '#f59e0b', unread: true },
  { title: '🔵 INFO — Slack webhook configured', time: '1 hr ago', color: '#3b82f6', unread: true },
  { title: '🟢 OK — All systems recovered', time: '3 hrs ago', color: '#4ade80', unread: false },
  { title: '🟡 WARN — Memory usage at 82%', time: '5 hrs ago', color: '#f59e0b', unread: false },
];

function renderNotifications() {
  const list = document.getElementById('notif-list');
  const count = document.getElementById('notif-count');
  if (!list) return;
  const unread = NOTIFICATIONS.filter(n => n.unread).length;
  if (count) count.textContent = unread > 0 ? unread : '';
  if (count) count.style.display = unread > 0 ? 'flex' : 'none';
  list.innerHTML = NOTIFICATIONS.length === 0
    ? '<div class="notif-empty">No notifications yet</div>'
    : NOTIFICATIONS.map((n, i) => `
      <div class="notif-item ${n.unread ? 'unread' : ''}" data-idx="${i}">
        <div class="notif-dot" style="background:${n.color};box-shadow:0 0 6px ${n.color};"></div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>`).join('');
  list.querySelectorAll('.notif-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.idx);
      NOTIFICATIONS[idx].unread = false;
      renderNotifications();
    });
  });
}

function addNotification(title, detail, color = '#3b82f6') {
  NOTIFICATIONS.unshift({ title: `${title} — ${detail}`, time: 'just now', color, unread: true });
  renderNotifications();
}

function initNotifications() {
  const bell = document.getElementById('notif-bell');
  const panel = document.getElementById('notif-panel');
  const overlay = document.getElementById('notif-overlay');
  const clearBtn = document.getElementById('notif-clear');
  if (!bell || !panel) return;
  renderNotifications();
  bell.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open', !isOpen);
    overlay.classList.toggle('open', !isOpen);
    if (!isOpen) renderNotifications();
  });
  overlay.addEventListener('click', () => {
    panel.classList.remove('open');
    overlay.classList.remove('open');
  });
  clearBtn?.addEventListener('click', () => {
    NOTIFICATIONS.forEach(n => n.unread = false);
    renderNotifications();
  });
}

// -- STATUS PAGE ----------------------------------------------─
async function renderStatusPage() {
  const container = document.getElementById('status-components');
  const heatmap = document.getElementById('status-heatmap');
  const checked = document.getElementById('status-last-checked');
  if (!container) return;

  try {
    const response = await fetch('http://127.0.0.1:5000/metrics');
    const data = await response.json();
    
    // Header Stats Sync
    if (ui.uptimeValue) ui.uptimeValue.innerText = '99.99%'; // Simulated network stability
    
    // Components
    const components = data.components || [];
    container.innerHTML = components.map(c => {
      const cls = c.status === 'OPERATIONAL' ? 'status-operational' : c.status === 'DEGRADED' ? 'status-degraded' : 'status-outage';
      return `<div class="status-component-row">
        <div class="status-comp-dot" style="background:${c.dot || '#4ade80'};box-shadow:0 0 6px ${c.dot || '#4ade80'};"></div>
        <span class="status-comp-name">${c.name}</span>
        <span class="status-latency">${c.latency}</span>
        <span class="status-comp-label ${cls}">${c.status}</span>
      </div>`;
    }).join('');

    // Update global status dot in footer
    if (ui.statusDot) ui.statusDot.className = `status-dot status-${data.status.toLowerCase()}`;

    if (checked) checked.textContent = `Last synced with Perception Hub: ${new Date().toLocaleTimeString()}`;

  } catch (err) {
    container.innerHTML = '<div class="notif-empty" style="color:#ef4444;">⚠️ Backend Offline: Unable to fetch live status.</div>';
    if (ui.statusDot) ui.statusDot.className = 'status-dot status-outage';
  }

  // Heatmap - Real history
  if (heatmap) {
    const history = JSON.parse(localStorage.getItem('incident_history') || '[]');
    heatmap.innerHTML = Array.from({ length: 90 }, (_, i) => {
      // Show real heat for recent days if we have history
      const heat = i > 86 ? Math.min(history.length, 4) : [0,0,1,0,0,2,0,1,0,3,0,0,1,0,0,0,2,1,0,1][i % 20] || 0;
      const date = new Date(); date.setDate(date.getDate() - (89 - i));
      return `<div class="heatmap-cell heat-${heat}" title="${date.toLocaleDateString()}: ${heat} incidents"></div>`;
    }).join('');
  }
}

// -- API KEYS SETTINGS ----------------------------------------─
function initApiKeys() {
  const fields = [
    { inputId: 'api-openai-key', btnId: 'api-openai-save', storageKey: 'nexus_openai_key', statusId: 'openai-status' },
    { inputId: 'api-gemini-key', btnId: 'api-gemini-save', storageKey: 'nexus_gemini_key', statusId: 'gemini-status' },
    { inputId: 'api-slack-key',  btnId: 'api-slack-save',  storageKey: 'nexus_slack_url',  statusId: null },
  ];
  fields.forEach(({ inputId, btnId, storageKey, statusId }) => {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input || !btn) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      input.value = saved;
      if (statusId) {
        const st = document.getElementById(statusId);
        if (st) st.innerHTML = `<span style="color:#4ade80;">✓ Saved · ${saved.substring(0,8)}••••</span>`;
      }
    }
    btn.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) { showToast('Please enter a valid key.', 'danger'); return; }
      localStorage.setItem(storageKey, val);
      if (statusId) {
        const st = document.getElementById(statusId);
        if (st) st.innerHTML = `<span style="color:#4ade80;">✓ Saved · ${val.substring(0,8)}••••</span>`;
      }
      btn.textContent = '✓ Saved!';
      setTimeout(() => btn.textContent = 'Save', 2000);
      showToast(`API key saved to local storage securely.`);
    });
  });
}

// -- AUTHENTICATION --------------------------------------------
function checkAuth() {
  const session = localStorage.getItem('nexus_session');
  const authView = document.getElementById('view-auth');
  const appShell = document.getElementById('app-shell');
  const hero = document.getElementById('hero-landing');

  if (session) {
    if (hero) hero.style.display = 'none';
    if (authView) authView.style.display = 'none';
    if (appShell) appShell.style.display = 'flex';
    document.body.style.overflow = '';
    return true;
  }
  return false;
}

function initAuth() {
  const loginForm  = document.getElementById('auth-login-form');
  const signupForm = document.getElementById('auth-signup-form');
  const toSignup   = document.getElementById('link-to-signup');
  const toLogin    = document.getElementById('link-to-login');
  
  const btnLogin   = document.getElementById('btn-login-submit');
  const btnSignup  = document.getElementById('btn-signup-submit');
  const btnDemo    = document.getElementById('btn-launch-demo');

  toSignup?.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  });

  toLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  const completeAuth = (type) => {
    showToast(`Welcome back! Session initialized via ${type}.`, 'success');
    localStorage.setItem('nexus_session', 'active_' + Date.now());
    document.getElementById('view-auth').classList.add('exit');
    setTimeout(() => {
      document.getElementById('view-auth').style.display = 'none';
      document.getElementById('app-shell').style.display = 'flex';
      if (window.lucide) window.lucide.createIcons();
      // If first time, show onboarding after a small delay
      if (localStorage.getItem('nexus_onboarded') !== 'true') {
        setTimeout(initOnboarding, 1000);
      }
    }, 600);
  };

  btnLogin?.addEventListener('click', () => completeAuth('Credentials'));
  btnSignup?.addEventListener('click', () => completeAuth('Signup'));
  btnDemo?.addEventListener('click', () => completeAuth('Demo Mode'));
}

// -- HERO LANDING ----------------------------------------------─
function initHero() {
  const hero = document.getElementById('hero-landing');
  const authView = document.getElementById('view-auth');
  const appShell = document.getElementById('app-shell');
  if (!hero || !appShell) return;

  // If already logged in, skip hero and auth
  if (checkAuth()) return;

  // -- Particle canvas ----------------------------------------─
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
      if (hero.style.display === 'none') return;
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
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // -- Stat counters ------------------------------------------─
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

  // -- Enter Transition ----------------------------------------
  function proceedToAuth() {
    hero.classList.add('exit');
    setTimeout(() => {
      hero.style.display = 'none';
      authView.style.display = 'flex';
      initAuth();
      if (window.lucide) window.lucide.createIcons();
    }, 820);
  }

  document.getElementById('hero-enter-btn')?.addEventListener('click', proceedToAuth);
  document.getElementById('hero-enter-btn-top')?.addEventListener('click', proceedToAuth);
  document.getElementById('hero-scroll-hint')?.addEventListener('click', proceedToAuth);
  document.getElementById('hero-arrow-btn')?.addEventListener('click', proceedToAuth);

  document.addEventListener('keydown', (e) => {
    if (hero.style.display !== 'none' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      proceedToAuth();
    }
  }, { once: true });
}

// -- ENTERPRISE MODULES LOGIC ----------------------------------─

// 1. TOPOLOGY MAP (Canvas)
async function renderTopology() {
    const canvas = document.getElementById('topo-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    try {
        const res = await fetch('http://127.0.0.1:5000/topology');
        const { nodes, links } = await res.json();

        function draw() {
            if (document.getElementById('view-topology').style.display === 'none') return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw Links
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
            ctx.lineWidth = 1.5;
            links.forEach(l => {
                const fromIdx = nodes.findIndex(n => n.id === l.from);
                const toIdx = nodes.findIndex(n => n.id === l.to);
                if (fromIdx === -1 || toIdx === -1) return;
                const f = nodes[fromIdx]; const t = nodes[toIdx];
                ctx.beginPath();
                ctx.moveTo(f.x, f.y);
                ctx.lineTo(t.x, t.y);
                ctx.stroke();
            });

            // Draw Nodes
            nodes.forEach(n => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = n.type === 'ai' ? '#a855f7' : '#3b82f6';
                ctx.shadowBlur = 15;
                ctx.shadowColor = ctx.fillStyle;
                ctx.fill();
                ctx.shadowBlur = 0;
                
                ctx.fillStyle = '#fff';
                ctx.font = '10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(n.label, n.x, n.y + 22);
            });
            requestAnimationFrame(draw);
        }
        topologyNodes = nodes; // Populate global registry
        draw();
    } catch (e) { console.error('Topology Load Failed'); }
}

// 2. WORKFLOW BUILDER (SVG)
function renderWorkflow() {
    const svg = document.getElementById('workflow-svg');
    if (!svg) return;
    const steps = [
        { id: 'p', label: 'Perception Channel', x: 50, y: 200, color: '#60a5fa' },
        { id: 'm', label: 'Inference Manager', x: 250, y: 200, color: '#818cf8' },
        { id: 'r', label: 'RAG Knowledge', x: 450, y: 300, color: '#a78bfa' },
        { id: 'ai', label: 'Reasoning Engine', x: 450, y: 100, color: '#34d399' },
        { id: 'a', label: 'Action Gateway', x: 650, y: 200, color: '#fb923c' }
    ];

    let html = '';
    // Links
    html += `<path d="M 120 200 L 250 200" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none" />`;
    html += `<path d="M 320 200 L 450 100" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none" />`;
    html += `<path d="M 320 200 L 450 300" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none" />`;
    html += `<path d="M 520 100 L 650 200" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none" />`;
    html += `<path d="M 520 300 L 650 200" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none" />`;

    // Nodes
    steps.forEach(s => {
        html += `<g class="wf-node" data-agent-id="${s.id}" style="cursor: pointer; pointer-events: all;">
            <rect x="${s.x}" y="${s.y - 30}" width="160" height="70" rx="12" fill="rgba(30,41,59,0.9)" stroke="${s.color}" stroke-width="2" pointer-events="all" />
            <text x="${s.x + 80}" y="${s.y + 5}" fill="white" font-size="12" font-weight="bold" text-anchor="middle" pointer-events="none">${s.label}</text>
            <circle cx="${s.x + 10}" cy="${s.y - 18}" r="4" fill="${s.color}" style="filter: drop-shadow(0 0 5px ${s.color});" pointer-events="none" />
        </g>`;
    });
    svg.innerHTML = html;
    
    // Use Event Delegation for SVG nodes (More robust)
    svg.onclick = (e) => {
        const node = e.target.closest('.wf-node');
        if (node) showWorkflowNodeDetails(node.dataset.agentId);
    };

    // Initialize sidebar block interactivity
    initWorkflowSidebar();
}

/**
 * 🛠️ Sidebar Block Interactivity
 */
function initWorkflowSidebar() {
    const blocks = document.querySelectorAll('.workflow-sidebar .wf-block');
    const mapping = {
        'Perception Gate': 'perception',
        'Reasoning Step': 'reasoning_oa',
        'Action Decider': 'action'
    };

    blocks.forEach(block => {
        block.style.cursor = 'pointer';
        // Remove existing to avoid duplicates if re-rendered
        block.onclick = null; 
        block.onclick = () => {
            const agentId = mapping[block.innerText.trim()];
            if (agentId) showWorkflowNodeDetails(agentId);
            else showToast(`Agent logic for "${block.innerText}" is still initializing...`, 'info');
        };
    });
}

/**
 * 🛠️ Show Agent Detail Modal (Blueprint Alignment Step 4/5)
 */
async function showWorkflowNodeDetails(agentId) {
    const modal = document.getElementById('incident-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    if (!modal || !body) return;

    // ID Mapping
    const idMap = { 'p': 'perception', 'm': 'manager', 'r': 'rag', 'ai': 'reasoning_oa', 'a': 'action' };
    const targetId = idMap[agentId] || agentId;

    title.innerText = "🔍 Agent Pipeline Intelligence";
    body.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
            <i data-lucide="loader" class="spin" style="width: 32px; height: 32px; color: var(--accent-primary);"></i>
            <p style="margin-top: 1rem; opacity: 0.7;">Syncing with live agent telemetry...</p>
        </div>
    `;
    modal.classList.add('active');
    if (window.lucide) lucide.createIcons();

    try {
        const res = await fetch('http://127.0.0.1:5000/metrics');
        const data = await res.json();
        const agent = data.components.find(c => c.id === targetId);

        if (!agent) {
             body.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                    <i data-lucide="alert-triangle" style="width: 40px; height: 40px; margin-bottom: 1rem;"></i>
                    <p>Metadata for agent "${targetId}" is still initializing or offline.</p>
                </div>
             `;
             if (window.lucide) lucide.createIcons();
             return;
        }

        body.innerHTML = `
            <div class="agent-detail-view" style="padding: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 2rem;">
                    <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        ${(agent.name || '🤖').split(' ')[0]}
                    </div>
                    <div>
                        <h2 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 4px;">${agent.name || 'Anonymous Agent'}</h2>
                        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: var(--accent-primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
                            <span style="width: 8px; height: 8px; background: ${agent.dot || '#4ade80'}; border-radius: 50%; box-shadow: 0 0 10px ${agent.dot || '#4ade80'};"></span>
                            ${agent.status || 'ACTIVE'} · ${agent.role || 'SRE Assistant'}
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                    <div class="glass-card" style="padding: 1.25rem; border-color: rgba(255,255,255,0.05);">
                        <div style="font-size: 0.65rem; color: var(--text-secondary); margin-bottom: 5px;">CURRENT LATENCY</div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #4ade80;">${agent.latency || 'N/A'}</div>
                    </div>
                    <div class="glass-card" style="padding: 1.25rem; border-color: rgba(255,255,255,0.05);">
                        <div style="font-size: 0.65rem; color: var(--text-secondary); margin-bottom: 5px;">INTEGRITY SCORE</div>
                        <div style="font-size: 1.5rem; font-weight: 800;">99.9%</div>
                    </div>
                </div>

                <div class="glass-card" style="padding: 1.5rem; background: rgba(59,130,246,0.05); border-color: rgba(59,130,246,0.2);">
                    <h4 style="font-size: 0.8rem; margin-bottom: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="info" style="width: 14px; height: 14px;"></i> Functional Description
                    </h4>
                    <p style="font-size: 0.85rem; line-height: 1.6; opacity: 0.8;">${agent.desc || 'No detailed data available for this component in the current session context.'}</p>
                </div>

                <div style="margin-top: 2rem; display: flex; gap: 10px;">
                    <button class="btn-primary" style="flex: 1; justify-content: center;" onclick="document.getElementById('incident-modal').classList.remove('active')">Acknowledge</button>
                    <button class="btn-secondary" onclick="showToast('Initiating diagnostic handshake...', 'info')">Re-probe Agent</button>
                </div>
            </div>
        `;
        if (window.lucide) lucide.createIcons();

    } catch (err) {
        body.innerHTML = `<div class="error-msg">Backend sync failed. Agent details unavailable.</div>`;
    }
}

// 3. SECURITY CENTER
async function renderSecurity() {
    try {
        const res = await fetch('http://127.0.0.1:5000/security');
        const data = await res.json();
        document.getElementById('sec-compliance-score').innerText = data.complianceScore;
        document.getElementById('sec-active-threats').innerText = data.vulnerabilities.critical;
        
        const matrix = document.getElementById('threat-matrix-grid');
        if (matrix) {
            matrix.innerHTML = data.threatMatrix.map(v => `<div class="matrix-cell ${v ? 'active' : ''}"></div>`).join('');
        }
    } catch (e) {}
}

// 5. KNOWLEDGE HARVESTER (Step 7 Blueprint)
async function renderKnowledgeIngest() {
    const list = document.getElementById('learned-facts-list');
    const badge = document.getElementById('ingest-count-badge');
    if (!list) return;

    try {
        const res = await fetch('http://127.0.0.1:5000/learned-facts');
        const facts = await res.json();
        
        if (badge) badge.innerText = `${facts.length} Concepts Learned`;

        if (facts.length === 0) {
            list.innerHTML = `<div style="padding:2rem;text-align:center;background:rgba(255,255,255,0.01);border:1px dashed var(--border-color);border-radius:12px;color:var(--text-secondary);font-size:0.85rem;">No dynamic knowledge ingested yet. Feed the brain to see improvements in analysis.</div>`;
            return;
        }

        list.innerHTML = facts.map(f => `
            <div class="glass-card" style="padding:1.25rem;border-left:4px solid var(--accent-primary);">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;font-size:0.7rem;color:var(--accent-primary);text-transform:uppercase;font-weight:700;">
                    <span>${f.category}</span>
                    <span style="opacity:0.5;">${new Date(f.timestamp).toLocaleTimeString()}</span>
                </div>
                <p style="font-size:0.85rem;line-height:1.5;">${f.content}</p>
                <div style="margin-top:0.75rem;display:flex;gap:6px;flex-wrap:wrap;">
                    ${f.keywords.slice(0, 5).map(k => `<span style="font-size:0.6rem;background:rgba(255,255,255,0.05);padding:2px 6px;border-radius:4px;">#${k}</span>`).join('')}
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Knowledge Load Failed');
    }
}

async function handleIngestKnowledge() {
    const content = document.getElementById('ingest-content').value;
    const category = document.getElementById('ingest-category').value;
    const btn = document.getElementById('btn-ingest-knowledge');

    if (!content.trim()) {
        showToast('Please enter some documentation text.', 'warning');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader" class="spin"></i> <span>ANALYZING DOCUMENT...</span>`;
    if (window.lucide) lucide.createIcons();

    try {
        const res = await fetch('http://127.0.0.1:5000/ingest-knowledge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, category })
        });
        const data = await res.json();
        
        if (data.success) {
            showToast('Brain Expansion Complete: Context Ingested.', 'success');
            updateLiveConsole(`🧠 Knowledge Harvester: New context "${category}" integrated into RAG pipeline.`);
            document.getElementById('ingest-content').value = '';
            renderKnowledgeIngest();
        }
    } catch (e) {
        showToast('Ingestion failed.', 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="zap"></i> <span>INGEST INTO GLOBAL ENGINE</span>`;
        if (window.lucide) lucide.createIcons();
    }
}

// 4. AUDIT LEDGER
async function renderAudit() {
    try {
        const res = await fetch('http://127.0.0.1:5000/audit');
        const logs = await res.json();
        const body = document.getElementById('audit-body');
        if (!body) return;
        body.innerHTML = logs.map(l => `
            <tr>
                <td style="font-size:0.7rem;">${new Date(l.ts).toLocaleString()}</td>
                <td style="font-weight:700;">${l.user}</td>
                <td>${l.action}</td>
                <td><span class="badge severity-low">${l.impact}</span></td>
                <td style="color:#4ade80;">${l.status}</td>
            </tr>
        `).join('');
    } catch (e) {}
}

// 5. KNOWLEDGE BASE
async function renderKnowledge() {
    try {
        const res = await fetch('http://127.0.0.1:5000/knowledge');
        const sources = await res.json();
        const list = document.getElementById('kb-sources-list');
        if (!list) return;
        list.innerHTML = sources.map(s => `
            <div class="kb-source-card glass-card">
                <i data-lucide="${s.type === 'PDF' ? 'file-text' : 'globe'}"></i>
                <div style="flex:1;">
                    <div style="font-weight:800;font-size:0.85rem;">${s.name}</div>
                    <div style="font-size:0.7rem;opacity:0.6;">Relevance: ${s.relevance} · ${s.status}</div>
                </div>
                <button class="btn-icon"><i data-lucide="trash-2"></i></button>
            </div>
        `).join('');
        if (window.lucide) window.lucide.createIcons();
    } catch (e) {}
}

// 6. BILLING & ROI
async function renderBilling() {
    try {
        const res = await fetch('http://127.0.0.1:5000/billing');
        const data = await res.json();
        const roiEl = document.querySelector('.roi-val');
        if (roiEl) roiEl.innerText = data.roi;
    } catch (e) {}
}

// -- REAL-TIME SYNC POLLER ------------------------------------─
async function syncGlobalDashboard() {
  try {
    const response = await fetch('http://127.0.0.1:5000/metrics');
    const data = await response.json();
    
    // Header Stats
    if (ui.uptimeValue) ui.uptimeValue.innerText = data.networkUptime || '99.99%';
    if (ui.costsValue) animateCounter(ui.costsValue, data.costsProtected || 842500);

    // Dynamic Host Info
    const monitorTitle = document.querySelector('.monitor-title h4');
    if (monitorTitle && data.hostname) {
        monitorTitle.innerText = `Real-Time Data Feed — ${data.hostname} (${data.platform})`;
    }
    
    // Refresh active view data
    const activeView = ui.views.find(v => v.classList.contains('active'))?.id;
    if (activeView === 'view-status') renderStatusPage();
    if (activeView === 'view-security') renderSecurity();
    if (activeView === 'view-topology') renderTopology();
    if (activeView === 'view-knowledge-ingest') renderKnowledgeIngest();

  } catch (err) {
    console.warn('Dashboard Sync: Backend offline.');
  }
}

// -- APP INITIALIZATION ----------------------------------------
function initCommonUI() {
  if (window.lucide) window.lucide.createIcons();

  // Theme
  applyTheme((localStorage.getItem('nexus_theme') || 'dark') === 'dark');
  ui.themeToggle?.addEventListener('click', toggleTheme);

  // Navigation
  ui.navItems.forEach(item => item.addEventListener('click', () => switchToView(item.dataset.view)));

  // Core Buttons
  ui.runBtn?.addEventListener('click', runWorkflow);
  
  const scanBtn = document.getElementById('scan-url-btn');
  ui.logInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const isURL = urlRegex.test(val) || val.includes('localhost:');
    if (scanBtn) scanBtn.style.display = isURL ? 'inline-flex' : 'none';
  });

  scanBtn?.addEventListener('click', async () => {
    const url = ui.logInput.value.trim();
    if (!url) return;
    
    showToast(`Probing ${url}...`, 'info');
    updateLiveConsole(`🔍 Sleuth Agent: Initiating deep handshake with ${url}`);
    
    try {
      const res = await fetch('http://127.0.0.1:5000/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      
      if (data.success) {
        updateLiveConsole(`✅ Prober: Handshake successful (${data.latency}). Service is up.`);
        showToast("Service is healthy.", "success");
      } else {
        updateLiveConsole(`❌ Prober Failure: ${data.errorType} - ${data.message}`);
        updateLiveConsole(`💡 Diagnostics: ${data.diagnostics}`);
        ui.logInput.value = `CRITICAL: URL ${url} is unreachable.\nError: ${data.errorType}\nDiagnostic: ${data.diagnostics}`;
        runWorkflow(); // Analyze the diagnostic log
      }
    } catch (e) {
      showToast("Prober engine offline.", "error");
    }
  });

  ui.autoDetectBtn?.addEventListener('click', () => {
    const scenarios = [
      'CRITICAL: Redis cache cluster 10.4.4.2 unreachable.',
      'ERROR: Stripe Payment Gateway 504 timeout.',
      'FATAL: PostgreSQL connection refused 5432.',
      'SECURITY: JWT token expired on auth service.',
      'INFRA: K8s pod OOMKilled. Memory limit exceeded.',
      'UI: React White Screen of Death detected on /checkout.',
      'AUTH: Multiple brute force attempts from IP 192.168.1.45',
      'API: Webhook signature mismatch for Stripe event.',
      'NETWORK: 502 Bad Gateway while accessing Upstream Proxy.',
      'CLOUD: AWS Spot Instance termination notice received.',
      'DB: Database deadlock detected on transaction_id 9942.',
      'PERF: API Latency P99 exceeded 2500ms.',
      'CERT: SSL Certificate for production.api.nexus expires in 2 hours.'
    ];
    ui.logInput.value = scenarios[Math.floor(Math.random() * scenarios.length)];
    runWorkflow();
  });

  // Knowledge Ingestion
  document.getElementById('btn-ingest-knowledge')?.addEventListener('click', handleIngestKnowledge);
  document.getElementById('audit-search')?.addEventListener('input', filterAudit);

  // Export/Download
  ui.exportCsvBtn?.addEventListener('click', exportCSV);
  ui.downloadRunbook?.addEventListener('click', exportPDF);
  ui.fileUpload?.addEventListener('change', (e) => handleFileUpload(e.target.files[0]));

  // Chat
  ui.chatToggle?.addEventListener('click', toggleChat);
  ui.chatClose?.addEventListener('click', toggleChat);
  ui.chatSend?.addEventListener('click', sendMessage);
  ui.chatInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  // Settings & Language
  ui.uiLang?.addEventListener('change', (e) => applyTranslations(e.target.value));
  ui.saveSettings?.addEventListener('click', () => {
    localStorage.setItem('agent_model', ui.settingModel.value);
    localStorage.setItem('agent_safety', ui.settingSafety.value);
    ui.saveSettings.innerText = '✓ SETTINGS SAVED';
    setTimeout(() => { ui.saveSettings.innerText = 'SAVE CONFIGURATION'; }, 2000);
    showToast('Configuration saved successfully.');
  });

  // Modal Close
  const modal = document.getElementById('incident-modal');
  document.getElementById('close-modal')?.addEventListener('click', () => modal?.classList.remove('active'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  // Workspace Selector
  const wsSelect = document.getElementById('workspace-ctx-select');
  wsSelect?.addEventListener('change', (e) => {
    const ws = e.target.value;
    showToast(`Switching context to ${ws.toUpperCase()}...`, 'info');
    updateLiveConsole(`System Context: Switched to ${ws.toUpperCase()} Infrastructure Cluster.`);
    // In a real app, this would trigger a global re-fetch with ws_id
  });

  // Global Key Shortcuts
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    const isInput = ['INPUT','TEXTAREA','SELECT'].includes(tag);
    if (e.key === 'Escape') {
      document.getElementById('incident-modal')?.classList.remove('active');
      document.getElementById('shortcuts-modal')?.classList.remove('active');
      ui.chatWidget?.classList.remove('active');
    }
    if (isInput) return;
    if (e.key === '?' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); document.getElementById('shortcuts-modal')?.classList.add('active'); return; }
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'Enter': e.preventDefault(); runWorkflow(); break;
        case 'b': e.preventDefault(); document.getElementById('sidebar-toggle')?.click(); break;
        case 'd': e.preventDefault(); switchToView('dashboard'); break;
        case 'h': e.preventDefault(); switchToView('history'); break;
        case 'p': e.preventDefault(); exportPDF(); break;
        case 's': e.preventDefault(); ui.saveSettings?.click(); break;
      }
    }
  });

  // -- INTERACTIVE TOPOLOGY LOGIC --
  const topoCanvas = document.getElementById('topo-canvas');
  if (topoCanvas) {
    const findNodeAt = (x, y) => {
      return topologyNodes.find(n => {
        const dist = Math.hypot(n.x - x, n.y - y);
        return dist < 15; // Hit area radius
      });
    };

    topoCanvas.addEventListener('mousemove', (e) => {
      const rect = topoCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      topoCanvas.style.cursor = findNodeAt(x, y) ? 'pointer' : 'default';
    });

    topoCanvas.addEventListener('click', async (e) => {
      const rect = topoCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const node = findNodeAt(x, y);
      if (node) {
        showToast(`🛡️ Perception Agent: Probing ${node.label}...`, 'info');
        updateLiveConsole(`🔍 Sleuth Agent: Initiating diagnostic handshake with ${node.label}`);
        
        // Update Side Panel (Intelligence Sync)
        const detailPanel = document.getElementById('topo-details-content');
        if (detailPanel) {
            detailPanel.innerHTML = `
                <div style="margin-top:1rem;">
                    <div style="font-size:0.9rem;font-weight:700;margin-bottom:0.5rem;color:var(--accent-primary);">${node.label}</div>
                    <div style="font-size:0.75rem;margin-bottom:1rem;opacity:0.8;line-height:1.4;">${node.desc || 'Telemetery pulse active. Syncing role data...'}</div>
                    
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <div style="display:flex;justify-content:space-between;font-size:0.7rem;background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:4px;">
                            <span style="opacity:0.6;">Status</span>
                            <span style="color:#4ade80;font-weight:700;">OPERATIONAL</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:0.7rem;background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:4px;">
                            <span style="opacity:0.6;">Role</span>
                            <span style="font-weight:700;">${node.role || 'Service'}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:0.7rem;background:rgba(255,255,255,0.03);padding:6px 10px;border-radius:4px;">
                            <span style="opacity:0.6;">Response</span>
                            <span style="font-weight:700;color:var(--accent-primary);">${5 + Math.floor(Math.random()*15)}ms</span>
                        </div>
                    </div>
                </div>
            `;
        }

        await sleep(600);
        updateLiveConsole(`✅ Guardian Node: ${node.label} (${node.type.toUpperCase()}) heartbeat confirmed. Integrity nominal.`);
        showToast(`Node ${node.id} is healthy.`, 'success');
      }
    });
  }
}

function initDashboardApp() {
  switchToView('dashboard');
  startLogSimulation();
  startSessionTimer();
  initIntegrations();
  initDropZone();
  initSSEStream();
  initSimulateOutage();
  initNotifications();
  initApiKeys();
  initSidebar();
  initShortcutsModal();
  initTeamMembers();
  renderKnowledgeFacts();
  
  // Real Data Fetching
  syncGlobalDashboard();
  setInterval(syncGlobalDashboard, 10000);
  
  updateLiveConsole('NexusGuard Perception Engine v2.1 initialized. All agents online.');
}

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  if (checkAuth()) {
    initDashboardApp();
  } else {
    initHero();
  }
});
