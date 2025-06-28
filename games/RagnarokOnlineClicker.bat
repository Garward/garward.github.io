@echo off
setlocal enabledelayedexpansion

:: Set window title
title Ragnarok Online Clicker

:: Get the directory where this batch file is located
set "GAME_DIR=%~dp0"

:: Check if index.html exists
if not exist "%GAME_DIR%index.html" (
    echo ERROR: index.html not found in %GAME_DIR%
    echo Please make sure this batch file is in the same folder as index.html
    pause
    exit /b 1
)

:: Convert path to file:// URL format
set "FILE_URL=file:///%GAME_DIR%index.html"
set "FILE_URL=!FILE_URL:\=/!"

:: Try Chrome first (app mode for best experience)
where chrome.exe >nul 2>&1
if !errorlevel! equ 0 (
    start "" "chrome.exe" --new-window --app="!FILE_URL!"
    if !errorlevel! equ 0 goto :success
)

:: Try Chrome in Program Files
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --new-window --app="!FILE_URL!"
    if !errorlevel! equ 0 goto :success
)

:: Try Chrome in Program Files (x86)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --new-window --app="!FILE_URL!"
    if !errorlevel! equ 0 goto :success
)

:: Try Edge
where msedge.exe >nul 2>&1
if !errorlevel! equ 0 (
    start "" "msedge.exe" --new-window --app="!FILE_URL!"
    if !errorlevel! equ 0 goto :success
)

:: Try Edge in Program Files
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --new-window --app="!FILE_URL!"
    if !errorlevel! equ 0 goto :success
)

:: Try Firefox
where firefox.exe >nul 2>&1
if !errorlevel! equ 0 (
    start "" "firefox.exe" "!FILE_URL!"
    if !errorlevel! equ 0 goto :success
)

:: Try Firefox in Program Files
if exist "%ProgramFiles%\Mozilla Firefox\firefox.exe" (
    start "" "%ProgramFiles%\Mozilla Firefox\firefox.exe" "!FILE_URL!"
    if !errorlevel! equ 0 goto :success
)

:: Try Firefox in Program Files (x86)
if exist "%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe" (
    start "" "%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe" "!FILE_URL!"
    if !errorlevel! equ 0 goto :success
)

:: Fallback to default browser
start "" "!FILE_URL!"

:success
:: Exit silently without pause
exit /b 0
