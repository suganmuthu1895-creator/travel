@echo off
echo ========================================================
echo Starting WanderBus Application (Node.js Backend + React)
echo ========================================================

start "Backend Server (Port 5000)" cmd /k "cd backend && npm start"
start "Frontend App (Port 5173)" cmd /k "cd frontend && npm run dev"

echo Backend and Frontend have been launched in separate windows!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
pause
