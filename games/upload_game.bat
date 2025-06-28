@echo off
REM Ragnarok Online Clicker - GitHub Upload Script
REM Place this file in your game directory and run it to upload to GitHub Pages

echo.
echo 🎮 Ragnarok Online Clicker - GitHub Upload
echo ================================================

REM Get the directory where this batch file is located
set GAME_DIR=%~dp0

REM Try to find ClaudeEVO installation
set CLAUDE_PATH=
if exist "C:\claude\ClaudeEvo" set CLAUDE_PATH=C:\claude
if exist "E:\claude\ClaudeEvo" set CLAUDE_PATH=E:\claude
if exist "%USERPROFILE%\claude\ClaudeEvo" set CLAUDE_PATH=%USERPROFILE%\claude

REM Check if we found ClaudeEVO
if "%CLAUDE_PATH%"=="" (
    echo ❌ ClaudeEVO not found in common locations
    echo 💡 Please make sure ClaudeEVO is installed in C:\claude or E:\claude
    echo.
    set /p CLAUDE_PATH="📁 Enter path to ClaudeEVO directory: "
)

REM Verify ClaudeEVO exists
if not exist "%CLAUDE_PATH%\ClaudeEvo" (
    echo ❌ ClaudeEVO not found at: %CLAUDE_PATH%
    echo 💡 Please check the path and try again
    pause
    exit /b 1
)

echo ✅ Found ClaudeEVO at: %CLAUDE_PATH%
echo 📁 Game directory: %GAME_DIR%
echo.

REM Run the upload script
echo 🚀 Starting upload...
python "%CLAUDE_PATH%\scripts\game_upload_script.py" "%GAME_DIR%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 Upload successful!
    echo 🌐 Your game will be live at GitHub Pages in 5-10 minutes
) else (
    echo.
    echo ❌ Upload failed. Check the errors above.
)

echo.
echo Press any key to close...
pause >nul
