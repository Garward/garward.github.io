# Ragnarok Online Clicker Launcher
# PowerShell script with proper Steam integration

# Hide PowerShell window for cleaner experience
Add-Type -Name Window -Namespace Console -MemberDefinition '
[DllImport("Kernel32.dll")]
public static extern IntPtr GetConsoleWindow();
[DllImport("user32.dll")]
public static extern bool ShowWindow(IntPtr hWnd, Int32 nCmdShow);
'
$consolePtr = [Console.Window]::GetConsoleWindow()
[Console.Window]::ShowWindow($consolePtr, 0) # 0 = hide

# Get the directory where this script is located
$GameDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if index.html exists
$IndexPath = Join-Path $GameDir "index.html"
if (-not (Test-Path $IndexPath)) {
    [System.Windows.Forms.MessageBox]::Show(
        "ERROR: index.html not found in $GameDir`n`nPlease make sure this script is in the same folder as index.html",
        "Ragnarok Online Clicker - Error",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Error
    )
    exit 1
}

# Convert to file:// URL
$FileUrl = "file:///" + $IndexPath.Replace('\', '/')

# Browser configurations with full paths
$browsers = @(
    @{
        Name = "Chrome"
        Paths = @(
            "chrome.exe",
            "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
            "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
            "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
        )
        Args = "--new-window --app=`"$FileUrl`""
    },
    @{
        Name = "Edge"
        Paths = @(
            "msedge.exe",
            "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
            "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
        )
        Args = "--new-window --app=`"$FileUrl`""
    },
    @{
        Name = "Firefox"
        Paths = @(
            "firefox.exe",
            "$env:ProgramFiles\Mozilla Firefox\firefox.exe",
            "$env:ProgramFiles(x86)\Mozilla Firefox\firefox.exe"
        )
        Args = "`"$FileUrl`""
    }
)

$launched = $false

# Try each browser
foreach ($browser in $browsers) {
    foreach ($path in $browser.Paths) {
        try {
            if ($path -notlike "*:*") {
                # Check if command is in PATH
                $null = Get-Command $path -ErrorAction Stop
                $execPath = $path
            } else {
                # Check if full path exists
                if (Test-Path $path) {
                    $execPath = $path
                } else {
                    continue
                }
            }
            
            # Try to launch
            Start-Process $execPath -ArgumentList $browser.Args -ErrorAction Stop
            $launched = $true
            break
        }
        catch {
            continue
        }
    }
    if ($launched) { break }
}

# Fallback to default browser
if (-not $launched) {
    try {
        Start-Process $IndexPath
    }
    catch {
        [System.Windows.Forms.MessageBox]::Show(
            "Failed to launch Ragnarok Online Clicker`n`nPlease check that you have a web browser installed.",
            "Ragnarok Online Clicker - Launch Error",
            [System.Windows.Forms.MessageBoxButtons]::OK,
            [System.Windows.Forms.MessageBoxIcon]::Error
        )
        exit 1
    }
}

# Exit silently
exit 0
