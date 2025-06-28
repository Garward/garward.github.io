# Ragnarok Online Clicker Launcher
# PowerShell script to launch the game

Write-Host "=== Ragnarok Online Clicker Launcher ===" -ForegroundColor Cyan
Write-Host ""

# Get the directory where this script is located
$GameDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if index.html exists
$IndexPath = Join-Path $GameDir "index.html"
if (-not (Test-Path $IndexPath)) {
    Write-Host "ERROR: index.html not found in $GameDir" -ForegroundColor Red
    Write-Host "Please make sure this script is in the same folder as index.html" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Game directory: $GameDir" -ForegroundColor Green
Write-Host "Launching Ragnarok Online Clicker..." -ForegroundColor Yellow
Write-Host ""

# Convert to file:// URL
$FileUrl = "file:///" + $IndexPath.Replace('\', '/')

# Try different browsers in order of preference
$browsers = @(
    @{Name="Chrome"; Path="chrome.exe"; Args="--new-window --app=`"$FileUrl`""},
    @{Name="Edge"; Path="msedge.exe"; Args="--new-window --app=`"$FileUrl`""},
    @{Name="Firefox"; Path="firefox.exe"; Args="`"$FileUrl`""}
)

$launched = $false

foreach ($browser in $browsers) {
    try {
        Write-Host "Trying $($browser.Name)..." -ForegroundColor Gray
        Start-Process $browser.Path -ArgumentList $browser.Args -ErrorAction Stop
        Write-Host "✓ Game launched successfully with $($browser.Name)!" -ForegroundColor Green
        $launched = $true
        break
    }
    catch {
        Write-Host "✗ $($browser.Name) not available" -ForegroundColor Gray
    }
}

# Fallback to default browser
if (-not $launched) {
    Write-Host "Launching with default browser..." -ForegroundColor Yellow
    try {
        Start-Process $IndexPath
        Write-Host "✓ Game launched with default browser!" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed to launch game" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "🎮 Ragnarok Online Clicker is now running!" -ForegroundColor Cyan
Write-Host "You can close this window." -ForegroundColor Gray
Write-Host ""

# Auto-close after 3 seconds
Start-Sleep -Seconds 3
