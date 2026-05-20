@echo off
cd /d "%~dp0"
echo Starting Survey App...
echo Checking for start-lab.ps1...
if not exist "start-lab.ps1" (
    echo Error: start-lab.ps1 not found!
    pause
    exit /b
)
powershell -ExecutionPolicy Bypass -File ".\start-lab.ps1"
if %errorlevel% neq 0 (
    echo Error occurred.
)
pause
