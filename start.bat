@echo off
TITLE Survey Platform Starter
echo ====================================================
echo       Survey Platform - Production Mode
echo ====================================================
echo.
echo Launching via PowerShell...
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\start-lab.ps1"
pause
