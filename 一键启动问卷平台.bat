@echo off
:: 设置代码页为 UTF-8 兼容中文显示
chcp 65001 >nul
title 问卷平台启动器 - 正在初始化...

:: 切换到脚本所在目录，防止路径错误
cd /d "%~dp0"

echo ====================================================
echo           问卷平台 - 一键启动器 (调试模式)
echo ====================================================
echo.
echo [1/3] 正在检查环境...

:: 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js (https://nodejs.org/)
    pause
    exit /b
)
echo [OK] 已找到 Node.js 环境

:: 检查 PowerShell 脚本是否存在
if not exist "start-lab.ps1" (
    echo [错误] 找不到核心脚本 "start-lab.ps1"，请确保它在同一文件夹下。
    pause
    exit /b
)
echo [OK] 已找到启动脚本

echo.
echo [2/3] 正在启动核心程序...
echo (如果是第一次启动，可能需要 1-2 分钟进行初始化，请稍候...)
echo.

:: 调用 PowerShell，增加 -NoExit 以便出错时窗口不消失
powershell -ExecutionPolicy Bypass -File ".\start-lab.ps1"

if %errorlevel% neq 0 (
    echo.
    echo [错误] 程序运行过程中出现异常 (代码: %errorlevel%)
    echo 请检查上方具体报错信息。
)

echo.
echo [3/3] 运行结束。
pause
