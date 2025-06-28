@echo off
title Ragnarok Online Clicker
echo Starting Ragnarok Online Clicker...
echo.

REM Get the directory where this batch file is located
set "GAME_DIR=%~dp0"

REM Check if index.html exists
if not exist "%GAME_DIR%index.html" (
    echo ERROR: index.html not found in %GAME_DIR%
    echo Please make sure this batch file is in the same folder as index.html
    pause
    exit /b 1
)

REM Try to open with different browsers in order of preference
echo Attempting to launch game...

REM Try Chrome first
start "" "chrome.exe" --new-window --app="file:///%GAME_DIR%index.html" 2>nul
if %errorlevel% equ 0 (
    echo Game launched successfully with Chrome!
    goto :success
)

REM Try Edge
start "" "msedge.exe" --new-window --app="file:///%GAME_DIR%index.html" 2>nul
if %errorlevel% equ 0 (
    echo Game launched successfully with Edge!
    goto :success
)

REM Try Firefox
start "" "firefox.exe" "file:///%GAME_DIR%index.html" 2>nul
if %errorlevel% equ 0 (
    echo Game launched successfully with Firefox!
    goto :success
)

REM Fallback to default browser
echo Launching with default browser...
start "" "file:///%GAME_DIR%index.html"

:success
echo.
echo Ragnarok Online Clicker is now running!
echo You can close this window.
echo.
timeout /t 3 /nobreak >nul
exit /b 0
