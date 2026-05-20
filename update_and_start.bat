@echo off
title Survey App - Update and Start
cd /d "%~dp0"

echo ====================================================
echo           Survey Platform - Update and Start
echo ====================================================
echo.

echo [1/3] Cleaning old build...
if exist ".next" (
    rd /s /q ".next"
)

echo [2/3] Building project (Please wait 1-2 minutes)...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b
)

echo.
echo [3/3] Build Successful! Starting server...
powershell -ExecutionPolicy Bypass -File ".\start-lab.ps1"

pause
