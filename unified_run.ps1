# NexusGuard Unified Launch Script
# Starts both Backend (Express) and Frontend (Vite)

Write-Host "🛡️  NexusGuard Autonomous Platform — Unified Launch Sequence" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Backend
Write-Host "🚀 Launching AI Reasoning Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# 2. Start Frontend
Write-Host "🖥️  Launching Modern Dashboard Frontend (Vite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`n✅ Both engines are initializing." -ForegroundColor Cyan
Write-Host "→ Backend: http://localhost:5000"
Write-Host "→ Frontend: http://localhost:5173 (Check console for exact port)"
Write-Host "`nNexusGuard is now in REAL TELEMETRY mode."
