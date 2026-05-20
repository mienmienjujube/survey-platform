@echo off
chcp 65001 >nul
title 问卷平台 - 更新并启动
cd /d "%~dp0"

echo ====================================================
echo           问卷平台 - 正在更新代码并重新启动
echo ====================================================
echo.

echo [1/3] 正在清理旧的构建文件...
if exist ".next" (
    rd /s /q ".next"
)

echo [2/3] 正在重新构建项目 (请耐心等待 1-2 分钟)...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [错误] 构建失败，请检查上方报错信息。
    pause
    exit /b
)

echo.
echo [3/3] 构建成功！正在启动稳定版服务器...
powershell -ExecutionPolicy Bypass -File ".\start-lab.ps1"

pause
